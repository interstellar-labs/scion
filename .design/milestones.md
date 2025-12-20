# gswarm Implementation Milestones

This document breaks down the implementation of `gswarm` into independent stages, allowing for iterative development and verification.

## Milestone 1: Project Scaffolding & Configuration
**Goal**: Establish the basic CLI structure and filesystem management.

- [ ] Implement `gswarm init`
    - [ ] Create `.gswarm/` directory structure in the current repo.
    - [ ] Seed `.gswarm/templates/default` with basic agent structure.
    - [ ] Create global `~/.gswarm/` structure for Playground swarms.
- [ ] Implement Template Loading
    - [ ] Logic to find and load templates (Project-local vs. Global).
    - [ ] Simple inheritance (custom template merged with `default`).

## Milestone 2: Container Runtime Abstraction
**Goal**: Create a unified interface for managing containers across different platforms.

- [ ] Implement `Runtime` interface (Go package)
    - [ ] Methods: `RunDetached`, `Stop`, `List`, `GetLogs`.
- [ ] Implement macOS `container` backend.
    - [ ] Integrate configuration loading (`GEMINI_SANDBOX` env, `settings.json`).
    - [ ] Implement Network Management (check for `container network` support on macOS).
- [ ] Implement Linux `docker` backend (optional for first pass).
- [ ] Verify basic container launch with TTY allocation.

## Milestone 3: Basic Agent Provisioning
**Goal**: Launch isolated agents without Git Worktree complexity.

- [ ] Implement `gswarm start` (v1)
    - [ ] Select template.
    - [ ] Copy template to `.gswarm/agents/<name>/home`.
    - [ ] Implement Environment & Credential Propagation (API keys, gcloud config).
    - [ ] Launch container with home directory mounted to `/home/gemini`.
- [ ] Implement basic ID management to prevent name collisions.
- [ ] Verify agent has unique identity and persistent history.

## Milestone 4: Git Worktree Integration
**Goal**: Enable concurrent agents to work on the same repository safely.

- [ ] Implement Worktree Manager
    - [ ] Logic to create worktrees in `../.gswarm_worktrees/`.
    - [ ] Automatic branch creation for the agent.
- [ ] Update `gswarm start` (v2)
    - [ ] Mount worktree to `/workspace` in the container.
    - [ ] Implement macOS-specific path isolation checks (ensure Home and Workspace paths do not overlap to satisfy VirtioFS).
- [ ] Verify two agents can run in the same swarm with different file states.

## Milestone 5: Swarm Management & Observability
**Goal**: Provide visibility into running agents and manage their lifecycle.

- [ ] Implement `gswarm list`
    - [ ] Query container runtime for running agents.
    - [ ] Parse and display agent status from `.gemini-status.json`.
- [ ] Implement `gswarm stop`
    - [ ] Graceful container termination.
    - [ ] Git worktree cleanup (removal of worktree and optional branch deletion).
- [ ] Implement Playground Swarm support (global context).

## Milestone 6: Interactivity & Human-in-the-Loop
**Goal**: Support "detached" operation with the ability to intervene.

- [ ] Implement `gswarm attach`
    - [ ] Connect host TTY to the running container's session.
    - [ ] Ensure escape sequences (Ctrl-P, Ctrl-Q) work for detaching.
- [ ] Implement status-driven alerts (simple console output when an agent is `WAITING_FOR_INPUT`).
- [ ] Support "Yolo" mode flag in `start`.

## Milestone 7: Advanced Template Management
**Goal**: Facilitate easy customization of agent personas.

- [ ] Implement `gswarm templates` subcommands.
    - [ ] `list`, `create`, `delete`.
- [ ] Implement Extension management.
    - [ ] `extensions install` (modifies `settings.json` in the template).