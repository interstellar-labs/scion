package cmd

import (
	"fmt"

	"github.com/ptone/gswarm/pkg/config"
	"github.com/spf13/cobra"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize gswarm in the current project",
	Long: `Initialize gswarm by creating the .gswarm directory structure
and seeding the default template. It also ensures the global ~/.gswarm
directory exists for playground swarms.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Initializing gswarm project...")
		if err := config.InitProject(); err != nil {
			return fmt.Errorf("failed to initialize project: %w", err)
		}

		fmt.Println("Initializing global gswarm directory...")
		if err := config.InitGlobal(); err != nil {
			return fmt.Errorf("failed to initialize global config: %w", err)
		}

		fmt.Println("gswarm successfully initialized.")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
