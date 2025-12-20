package config

import (
	"fmt"
	"os"
	"path/filepath"
)

type Template struct {
	Name string
	Path string
}

func FindTemplate(name string) (*Template, error) {
	// 1. Check project-local templates
	projectTemplatesDir, err := GetProjectTemplatesDir()
	if err == nil {
		path := filepath.Join(projectTemplatesDir, name)
		if info, err := os.Stat(path); err == nil && info.IsDir() {
			return &Template{Name: name, Path: path}, nil
		}
	}

	// 2. Check global templates
	globalTemplatesDir, err := GetGlobalTemplatesDir()
	if err == nil {
		path := filepath.Join(globalTemplatesDir, name)
		if info, err := os.Stat(path); err == nil && info.IsDir() {
			return &Template{Name: name, Path: path}, nil
		}
	}

	return nil, fmt.Errorf("template %s not found", name)
}

// GetTemplateChain returns a list of templates in inheritance order (base first)
func GetTemplateChain(name string) ([]*Template, error) {
	var chain []*Template

	// Always start with default if it's not the requested template
	if name != "default" {
		def, err := FindTemplate("default")
		if err == nil {
			chain = append(chain, def)
		}
	}

	tpl, err := FindTemplate(name)
	if err != nil {
		return nil, err
	}
	chain = append(chain, tpl)

	return chain, nil
}
