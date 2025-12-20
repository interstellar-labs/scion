package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFindTemplate(t *testing.T) {
	// Setup a temporary project directory
	tmpDir, err := os.MkdirTemp("", "gswarm-test-*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	origWd, _ := os.Getwd()
	os.Chdir(tmpDir)
	defer os.Chdir(origWd)

	// Initialize project
	if err := InitProject(); err != nil {
		t.Fatal(err)
	}

	// Test finding default template
	tpl, err := FindTemplate("default")
	if err != nil {
		t.Errorf("expected to find default template, got %v", err)
	}
	if tpl.Name != "default" {
		t.Errorf("expected template name 'default', got '%s'", tpl.Name)
	}

	// Create a custom project template
	projectTemplatesDir, _ := GetProjectTemplatesDir()
	customDir := filepath.Join(projectTemplatesDir, "custom")
	os.MkdirAll(customDir, 0755)

	tpl, err = FindTemplate("custom")
	if err != nil {
		t.Errorf("expected to find custom template, got %v", err)
	}
	if tpl.Name != "custom" {
		t.Errorf("expected template name 'custom', got '%s'", tpl.Name)
	}

	// Test inheritance chain
	chain, err := GetTemplateChain("custom")
	if err != nil {
		t.Fatal(err)
	}
	if len(chain) != 2 {
		t.Errorf("expected chain length 2, got %d", len(chain))
	}
	if chain[0].Name != "default" || chain[1].Name != "custom" {
		t.Errorf("expected [default, custom], got [%s, %s]", chain[0].Name, chain[1].Name)
	}
}
