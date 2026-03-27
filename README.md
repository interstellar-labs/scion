# Scion

_sci·on /ˈsīən/ noun 1. a young shoot or twig of a plant, especially one cut for grafting or rooting._

Scion is an experimental multi-agent orchestration testbed designed to manage "deep agents" running in containers.


It can manage agents across your local machine and remote clusters. It enables developers to run groups of specialized agents with isolated identities, credentials, and workspaces, allowing for a dynamic and evolving graph of parallel execution of tasks such as research, coding, auditing, and testing.

Scion takes a "less is more" approach to allowing modern powerful models to determine the execution of orchestration patterns by leveraging the progressive skill approach of dynamically loading the usage help text of the `scion` cli tool to manage other agents. This provides a system to rapidly experiment with different orchestration patterns and approaches through natural language prompting. See more in [philosophy](https://googlecloudplatform.github.io/scion/philosophy/)

**NOTE** Currently this project is early and experimental. Most of the concepts are settled in, but many features may not be fully implemented, anything might break or change and the future is not set. Local use is relatively stable, Hub based workflows are ~80% verified, Kubernetes runtime support and remote-git Groves are early and have rough edges.

## Key Features

- **Parallelism**: Run multiple agents concurrently as full independent processes either locally or remote.
- **Isolation**: Each agent runs in its own container with strict separation of credentials, configuration, and environment. Scion uses `git worktree` to provide each agent with a dedicated workspace, preventing merge conflicts and ensuring clean separation of concerns.
- **Context Management**: Each agent has a dedicated context window, and optionally its own system instruction.
- **Runtimes**: Manage multiple execution environments (e.g., Local, Docker, Kubernetes) via named profiles. Distributed across local workstion, remote VMs, and container clusters.
- **Specialization**: Agents can be customized via [Templates](https://googlecloudplatform.github.io/scion/advanced-local/templates/) (e.g., "Security Auditor", "QA Tester") to perform specific roles.
- **Interactivity**: Agents run in `tmux` sessions by default, allowing for "detached" background operation, enqueuing messages to running agents, and "attaching" for human-in-the-loop interaction. Attach to running agents across automatically established network tunnels for secure remote control.
- **Harness Agnostic**: Works with Gemini CLI, Claude Code, OpenCode, and Codex. Easily adaptable to any harness which can run in a container.
- **Observability**: Supports normalized OTEL telemetry across harnesses for logging and metrics allowing easy aggregation across agent swarms.

## Core Concepts in brief

- **Agent** - a containerized process running a deep agent harness (eg Claude Code, Gemini CLI, etc)
- **Grove** - a project namespace, acts as a collection of agents. Often 1:1 with a git repo
- **Hub** - an optional central control plane capturing agent state and providing basic messages
- **Template** - The scion abstraction of an agent definition, essentially a system prompt and collection of skills
- **Runtime** - A container runtime, such as Docker, Podman, Apple-Container, or Kubernetes
- **Runtime Broker** - A participating computer (laptop or VM) which offers access to one or more runtime to the hub

Not all of these concepts are in play for all scenarios (local mode is simpler) but are required for agents to fully participate in orchestration (agents creating agents). More details are on the
[concept page in the docs](https://googlecloudplatform.github.io/scion/concepts/).

## A current proof point

A common metaphor used when describing Scion is that getting agents to organize, requires instructions similar to describing the rules of a game. Scion is the game engine for multi-agent pattern exploration. What more fitting a way to demonstrate what agents can do then to have them solve a 'challenge quest' style game, where each challenge involved a computational puzzle, often best solved by writing code:

### Relics of Athenaeum

The [Relics of Athenaeum](https://github.com/ptone/scion-athenaeum) is an "agent game" that shows how "just markdown" is sufficient to set up agent orchestration on Scion.

<img width="425" height="238" alt="Image" src="https://github.com/user-attachments/assets/cbee74a3-f3aa-4739-b423-0a83d5dd4c13" /><a href="https://www.youtube.com/watch?v=w16bsh6lFL8"><img width="300" height="200" alt="Image" src="https://github.com/user-attachments/assets/a615da24-33d8-4882-abe1-95adea4ed79a" /></a>

The [associated visualization](https://www.youtube.com/watch?v=w16bsh6lFL8) shows agents using both group and direct messaging as they solve challenges across the quest. A 'dungeon master' style agent presents the challenges to them, which the group of agents must work together to solve.

These agents are defined simply in markdown, are running in containers using off-the-shelf harnesses such as Claude Code, Gemini CLI, and Codex.

While this is "just a game" similar team definitions can set software engineering, data research, or platform engineering team definitions.

## Documentation

Visit our **[Documentation Site](https://googlecloudplatform.github.io/scion/)** for comprehensive guides and reference.

- **[Overview](https://googlecloudplatform.github.io/scion/overview/)**: Introduction to Scion.
- **[Installation](https://googlecloudplatform.github.io/scion/getting-started/install/)**: How to get Scion up and running.
- **[Concepts](https://googlecloudplatform.github.io/scion/concepts/)**: Understanding Agents, Groves, Harnesses, and Runtimes.
- **[CLI Reference](https://googlecloudplatform.github.io/scion/reference/cli/)**: Comprehensive guide to all Scion commands.
- **Guides**:
    - [Using Templates](https://googlecloudplatform.github.io/scion/advanced-local/templates/)
    - [Using Tmux](https://googlecloudplatform.github.io/scion/advanced-local/tmux/)
    - [Kubernetes Runtime](https://googlecloudplatform.github.io/scion/hub-admin/kubernetes/)

## Installation

See the **[Installation Guide](https://googlecloudplatform.github.io/scion/getting-started/install/)** for detailed instructions.

Quick start from source:
```bash
go install github.com/GoogleCloudPlatform/scion/cmd/scion@latest
```

## Quick Start

### 1. Initialize a Grove

Navigate to your project root and initialize a new Scion grove. This creates the `.scion` directory and seeds default templates.

```bash
cd my-project
scion init
```

Note: If you are in a git repository, it is recommended to add `.scion/agents` to your `.gitignore` to avoid issues with nested git worktrees:
```bash
echo ".scion/agents" >> .gitignore
```

Note: Scion automatically detects your operating system and configures the default runtime (Docker for Linux/Windows, Container for macOS). You can change this in `.scion/settings.json`.

### 2. Start Agents

You can launch an agent immediately using `start` (or its alias `run`). By default, this runs in the background using the `gemini` template.

```bash
# Start a gemini agent named "coder"
scion start coder "Refactor the authentication middleware in pkg/auth"

# Start a Claude-based agent
scion run auditor "Audit the user input validation" --type claude

# Start and immediately attach to the session
scion start debug "Help me debug this error" --attach
```

### 3. Manage Agents

- **List active agents**: `scion list` (alias `ps`)
- **Attach to an agent**: `scion attach <agent-name>`
- **Send a message**: `scion message <agent-name> "New task..."` (alias `msg`)
- **View logs**: `scion logs <agent-name>`
- **Stop an agent**: `scion stop <agent-name>`
- **Resume an agent**: `scion resume <agent-name>`
- **Delete an agent**: `scion delete <agent-name>` (removes container, directory, and worktree)

## Configuration

Scion settings are managed in `settings.json` files, following a precedence order: **Grove** (`.scion/settings.json`) > **Global** (`~/.scion/settings.json`) > **Defaults**.

Profiles allow you to switch runtimes and configurations easily (e.g. `scion --profile remote start ...`).

Templates serve as blueprints and can be managed via the `templates` subcommand. See the [Templates Guide](https://googlecloudplatform.github.io/scion/advanced-local/templates/) for more details.

## Disclaimers

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security)

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.
