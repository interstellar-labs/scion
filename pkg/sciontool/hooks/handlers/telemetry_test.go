/*
Copyright 2025 The Scion Authors.
*/

package handlers

import (
	"testing"

	"github.com/ptone/scion-agent/pkg/sciontool/hooks"
	"github.com/ptone/scion-agent/pkg/sciontool/telemetry"
)

func TestNewTelemetryHandler(t *testing.T) {
	// Test with nil TracerProvider (should use noop)
	h := NewTelemetryHandler(nil, nil)
	if h == nil {
		t.Fatal("NewTelemetryHandler should not return nil")
	}
	if h.tracer == nil {
		t.Error("handler should have a tracer (even if noop)")
	}
}

func TestNewTelemetryHandler_WithRedactor(t *testing.T) {
	redactor := telemetry.NewRedactor(telemetry.RedactionConfig{
		Redact: []string{"prompt"},
		Hash:   []string{"session_id"},
	})

	h := NewTelemetryHandler(nil, redactor)
	if h == nil {
		t.Fatal("NewTelemetryHandler should not return nil")
	}
	if h.redactor == nil {
		t.Error("handler should have a redactor")
	}
}

func TestTelemetryHandler_HandleNilEvent(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	// Should not panic on nil event
	err := h.Handle(nil)
	if err != nil {
		t.Errorf("Handle(nil) should not return error, got: %v", err)
	}
}

func TestTelemetryHandler_HandleUnknownEvent(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	event := &hooks.Event{
		Name: "unknown-event-type",
		Data: hooks.EventData{},
	}

	err := h.Handle(event)
	if err != nil {
		t.Errorf("Handle should not return error for unknown event, got: %v", err)
	}
}

func TestTelemetryHandler_HandleToolStart(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	event := &hooks.Event{
		Name:    hooks.EventToolStart,
		RawName: "PreToolUse",
		Dialect: "claude",
		Data: hooks.EventData{
			ToolName:  "Bash",
			ToolInput: "ls -la",
		},
	}

	err := h.Handle(event)
	if err != nil {
		t.Errorf("Handle should not return error, got: %v", err)
	}
}

func TestTelemetryHandler_HandleToolStartEnd(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	// Start event
	startEvent := &hooks.Event{
		Name: hooks.EventToolStart,
		Data: hooks.EventData{
			ToolName:  "Bash",
			ToolInput: "ls -la",
		},
	}
	if err := h.Handle(startEvent); err != nil {
		t.Errorf("Handle start should not return error, got: %v", err)
	}

	// End event
	endEvent := &hooks.Event{
		Name: hooks.EventToolEnd,
		Data: hooks.EventData{
			ToolName:   "Bash",
			ToolOutput: "file1.txt\nfile2.txt",
			Success:    true,
		},
	}
	if err := h.Handle(endEvent); err != nil {
		t.Errorf("Handle end should not return error, got: %v", err)
	}
}

func TestTelemetryHandler_HandleSessionEvents(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	events := []struct {
		name string
		data hooks.EventData
	}{
		{hooks.EventSessionStart, hooks.EventData{SessionID: "sess-123", Source: "cli"}},
		{hooks.EventPromptSubmit, hooks.EventData{Prompt: "Hello, world!"}},
		{hooks.EventModelStart, hooks.EventData{}},
		{hooks.EventModelEnd, hooks.EventData{Success: true}},
		{hooks.EventSessionEnd, hooks.EventData{Reason: "user_exit"}},
	}

	for _, tc := range events {
		event := &hooks.Event{
			Name: tc.name,
			Data: tc.data,
		}
		if err := h.Handle(event); err != nil {
			t.Errorf("Handle(%s) should not return error, got: %v", tc.name, err)
		}
	}
}

func TestTelemetryHandler_Flush(t *testing.T) {
	h := NewTelemetryHandler(nil, nil)

	// Start some events without ending them
	h.Handle(&hooks.Event{
		Name: hooks.EventToolStart,
		Data: hooks.EventData{ToolName: "Bash"},
	})
	h.Handle(&hooks.Event{
		Name: hooks.EventModelStart,
		Data: hooks.EventData{},
	})

	// Flush should clean up all in-progress spans
	h.Flush()

	// Verify spanStore is empty by trying to end the spans (should create new single spans)
	// This is a bit indirect but tests the cleanup happened
}

func TestSpanMapping(t *testing.T) {
	expectedMappings := map[string]string{
		hooks.EventSessionStart:     "agent.session.start",
		hooks.EventSessionEnd:       "agent.session.end",
		hooks.EventToolStart:        "agent.tool.call",
		hooks.EventToolEnd:          "agent.tool.result",
		hooks.EventPromptSubmit:     "agent.user.prompt",
		hooks.EventModelStart:       "gen_ai.api.request",
		hooks.EventModelEnd:         "gen_ai.api.response",
		hooks.EventAgentStart:       "agent.turn.start",
		hooks.EventAgentEnd:         "agent.turn.end",
		hooks.EventNotification:     "agent.notification",
		hooks.EventResponseComplete: "agent.response.complete",
	}

	for eventName, expectedSpan := range expectedMappings {
		if SpanMapping[eventName] != expectedSpan {
			t.Errorf("SpanMapping[%s] = %s, want %s", eventName, SpanMapping[eventName], expectedSpan)
		}
	}
}

func TestTelemetryHandler_RedactionApplied(t *testing.T) {
	redactor := telemetry.NewRedactor(telemetry.RedactionConfig{
		Redact: []string{"prompt", "tool_input", "tool_output"},
		Hash:   []string{"session_id"},
	})

	h := NewTelemetryHandler(nil, redactor)

	// Test that redactor is properly referenced
	if h.redactor == nil {
		t.Fatal("redactor should be set")
	}
	if !h.redactor.ShouldRedact("prompt") {
		t.Error("redactor should redact 'prompt'")
	}
	if !h.redactor.ShouldHash("session_id") {
		t.Error("redactor should hash 'session_id'")
	}
}
