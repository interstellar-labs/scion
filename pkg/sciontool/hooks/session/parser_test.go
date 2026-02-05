/*
Copyright 2025 The Scion Authors.
*/

package session

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestParseSessionFile(t *testing.T) {
	// Create a temporary session file
	tmpDir := t.TempDir()
	sessionFile := filepath.Join(tmpDir, "session-test.json")

	sessionData := `{
		"sessionId": "sess-123",
		"startTime": "2025-02-05T10:00:00Z",
		"endTime": "2025-02-05T10:30:00Z",
		"model": "gemini-2.0-flash",
		"turns": [
			{
				"role": "user",
				"content": "Hello"
			},
			{
				"role": "assistant",
				"content": "Hi there!",
				"tokenUsage": {
					"inputTokens": 10,
					"outputTokens": 5,
					"cachedTokens": 2
				},
				"toolCalls": [
					{"name": "Bash", "input": "ls", "output": "file.txt"}
				]
			}
		],
		"tokenUsage": {
			"inputTokens": 100,
			"outputTokens": 50,
			"cachedTokens": 10
		},
		"toolResults": [
			{"toolName": "Bash", "success": true}
		]
	}`

	if err := os.WriteFile(sessionFile, []byte(sessionData), 0644); err != nil {
		t.Fatalf("Failed to write session file: %v", err)
	}

	metrics, err := ParseSessionFile(sessionFile)
	if err != nil {
		t.Fatalf("ParseSessionFile failed: %v", err)
	}

	// Verify metrics
	if metrics.TokensInput != 100 {
		t.Errorf("TokensInput = %d, want 100", metrics.TokensInput)
	}
	if metrics.TokensOutput != 50 {
		t.Errorf("TokensOutput = %d, want 50", metrics.TokensOutput)
	}
	if metrics.TokensCached != 10 {
		t.Errorf("TokensCached = %d, want 10", metrics.TokensCached)
	}
	if metrics.Model != "gemini-2.0-flash" {
		t.Errorf("Model = %s, want gemini-2.0-flash", metrics.Model)
	}
	if metrics.TurnCount != 2 {
		t.Errorf("TurnCount = %d, want 2", metrics.TurnCount)
	}
	if metrics.Duration != 30*time.Minute {
		t.Errorf("Duration = %v, want 30m", metrics.Duration)
	}

	// Verify tool calls
	bashStats, ok := metrics.ToolCalls["Bash"]
	if !ok {
		t.Error("ToolCalls should contain Bash")
	} else {
		if bashStats.Calls != 1 {
			t.Errorf("Bash.Calls = %d, want 1", bashStats.Calls)
		}
		if bashStats.Success != 1 {
			t.Errorf("Bash.Success = %d, want 1", bashStats.Success)
		}
	}
}

func TestParseSessionFile_NotFound(t *testing.T) {
	_, err := ParseSessionFile("/nonexistent/path/session.json")
	if err == nil {
		t.Error("ParseSessionFile should fail for nonexistent file")
	}
}

func TestParseSessionFile_InvalidJSON(t *testing.T) {
	tmpDir := t.TempDir()
	sessionFile := filepath.Join(tmpDir, "session-invalid.json")

	if err := os.WriteFile(sessionFile, []byte("not json"), 0644); err != nil {
		t.Fatalf("Failed to write session file: %v", err)
	}

	_, err := ParseSessionFile(sessionFile)
	if err == nil {
		t.Error("ParseSessionFile should fail for invalid JSON")
	}
}

func TestParseSessionFile_TurnLevelTokens(t *testing.T) {
	// Test aggregation from turns when session-level stats are zero
	tmpDir := t.TempDir()
	sessionFile := filepath.Join(tmpDir, "session-turns.json")

	sessionData := `{
		"sessionId": "sess-456",
		"turns": [
			{
				"role": "assistant",
				"tokenUsage": {"inputTokens": 20, "outputTokens": 10, "cachedTokens": 5}
			},
			{
				"role": "assistant",
				"tokenUsage": {"inputTokens": 30, "outputTokens": 15, "cachedTokens": 5}
			}
		],
		"tokenUsage": {}
	}`

	if err := os.WriteFile(sessionFile, []byte(sessionData), 0644); err != nil {
		t.Fatalf("Failed to write session file: %v", err)
	}

	metrics, err := ParseSessionFile(sessionFile)
	if err != nil {
		t.Fatalf("ParseSessionFile failed: %v", err)
	}

	// Should aggregate from turns
	if metrics.TokensInput != 50 {
		t.Errorf("TokensInput = %d, want 50 (aggregated from turns)", metrics.TokensInput)
	}
	if metrics.TokensOutput != 25 {
		t.Errorf("TokensOutput = %d, want 25 (aggregated from turns)", metrics.TokensOutput)
	}
}

func TestFindLatestSession(t *testing.T) {
	tmpDir := t.TempDir()

	// Create some session files with different timestamps
	files := []string{"session-001.json", "session-002.json", "session-003.json"}
	for i, f := range files {
		path := filepath.Join(tmpDir, f)
		if err := os.WriteFile(path, []byte("{}"), 0644); err != nil {
			t.Fatalf("Failed to create %s: %v", f, err)
		}
		// Ensure different modification times
		mtime := time.Now().Add(time.Duration(i) * time.Second)
		if err := os.Chtimes(path, mtime, mtime); err != nil {
			t.Fatalf("Failed to set mtime: %v", err)
		}
	}

	latest, err := FindLatestSession(tmpDir)
	if err != nil {
		t.Fatalf("FindLatestSession failed: %v", err)
	}

	// Should return the newest file (session-003.json)
	if filepath.Base(latest) != "session-003.json" {
		t.Errorf("FindLatestSession returned %s, want session-003.json", filepath.Base(latest))
	}
}

func TestFindLatestSession_NoFiles(t *testing.T) {
	tmpDir := t.TempDir()

	_, err := FindLatestSession(tmpDir)
	if err == nil {
		t.Error("FindLatestSession should fail when no session files exist")
	}
}

func TestFindLatestSession_IgnoresNonSessionFiles(t *testing.T) {
	tmpDir := t.TempDir()

	// Create a non-session file
	if err := os.WriteFile(filepath.Join(tmpDir, "other.json"), []byte("{}"), 0644); err != nil {
		t.Fatalf("Failed to create file: %v", err)
	}

	// Create a session file
	sessionPath := filepath.Join(tmpDir, "session-test.json")
	if err := os.WriteFile(sessionPath, []byte("{}"), 0644); err != nil {
		t.Fatalf("Failed to create file: %v", err)
	}

	latest, err := FindLatestSession(tmpDir)
	if err != nil {
		t.Fatalf("FindLatestSession failed: %v", err)
	}

	if filepath.Base(latest) != "session-test.json" {
		t.Errorf("FindLatestSession returned %s, want session-test.json", filepath.Base(latest))
	}
}

func TestDefaultSessionDir(t *testing.T) {
	dir := DefaultSessionDir()
	if dir == "" {
		t.Error("DefaultSessionDir should not return empty string")
	}
	if !filepath.IsAbs(dir) {
		t.Error("DefaultSessionDir should return absolute path")
	}
}

func TestParseTime(t *testing.T) {
	tests := []struct {
		input string
		valid bool
	}{
		{"2025-02-05T10:00:00Z", true},
		{"2025-02-05T10:00:00.123Z", true},
		{"2025-02-05 10:00:00", true},
		{"invalid", false},
		{"", false},
	}

	for _, tc := range tests {
		_, err := parseTime(tc.input)
		if tc.valid && err != nil {
			t.Errorf("parseTime(%q) should succeed, got error: %v", tc.input, err)
		}
		if !tc.valid && err == nil {
			t.Errorf("parseTime(%q) should fail", tc.input)
		}
	}
}

func TestToolStatsWithErrors(t *testing.T) {
	tmpDir := t.TempDir()
	sessionFile := filepath.Join(tmpDir, "session-errors.json")

	sessionData := `{
		"turns": [
			{
				"role": "assistant",
				"toolCalls": [
					{"name": "Bash", "input": "cmd1"},
					{"name": "Bash", "input": "cmd2"},
					{"name": "Read", "input": "file.txt"}
				]
			}
		],
		"toolResults": [
			{"toolName": "Bash", "success": false, "error": "command failed"}
		]
	}`

	if err := os.WriteFile(sessionFile, []byte(sessionData), 0644); err != nil {
		t.Fatalf("Failed to write session file: %v", err)
	}

	metrics, err := ParseSessionFile(sessionFile)
	if err != nil {
		t.Fatalf("ParseSessionFile failed: %v", err)
	}

	// Bash: 2 calls, 1 error from toolResults
	bashStats := metrics.ToolCalls["Bash"]
	if bashStats.Calls != 2 {
		t.Errorf("Bash.Calls = %d, want 2", bashStats.Calls)
	}
	if bashStats.Errors != 1 {
		t.Errorf("Bash.Errors = %d, want 1", bashStats.Errors)
	}
	if bashStats.Success != 1 {
		t.Errorf("Bash.Success = %d, want 1 (2 calls - 1 error)", bashStats.Success)
	}

	// Read: 1 call, no errors
	readStats := metrics.ToolCalls["Read"]
	if readStats.Calls != 1 {
		t.Errorf("Read.Calls = %d, want 1", readStats.Calls)
	}
	if readStats.Success != 1 {
		t.Errorf("Read.Success = %d, want 1", readStats.Success)
	}
}
