# Agent Auth Refactor

## Status: Draft

## Problem Statement

The current harness authentication system has grown organically and suffers from several issues:

1. **Fragmented auth discovery**: Each harness implements `DiscoverAuth()` independently, reading from different env vars, files, and settings with inconsistent logic. Some harnesses (Codex, OpenCode) also read env vars directly in `GetEnv()` rather than through `AuthConfig`, bypassing the auth abstraction.

2. **Incomplete `AuthConfig` struct**: The struct is missing fields that harnesses already consume (`CodexAPIKey`, `GoogleCloudRegion`). Some fields are obsolete (`VertexAPIKey` duplicates `GoogleAPIKey`). Claude's Vertex auth support isn't represented at all.

3. **Divergent local vs hub paths**: Local provisioning uses `DiscoverAuth() → GetEnv()/PropagateFiles()`, while hub-dispatched provisioning uses `ResolvedSecrets + env-gather`. These paths have different validation, different env var coverage, and different failure modes. The `AuthConfig` struct is essentially unused in the hub path.

4. **No auth validation before container launch**: The system can launch containers with incomplete auth and only discover the problem when the harness fails at runtime. The `RequiredEnvKeys()` method exists but only covers the env-gather path.

5. **File path normalization is ad-hoc**: `GoogleAppCredentials`, `OAuthCreds`, `OpenCodeAuthFile`, `CodexAuthFile` all store host paths but need to be translated to container paths. Each harness does this translation differently in `PropagateFiles()` and `GetVolumes()`.

## Current Architecture

### AuthConfig Struct (`pkg/api/types.go:299-310`)

```go
type AuthConfig struct {
    GeminiAPIKey         string  // env: GEMINI_API_KEY
    GoogleAPIKey         string  // env: GOOGLE_API_KEY
    VertexAPIKey         string  // env: VERTEX_API_KEY (obsolete, redundant with GoogleAPIKey)
    GoogleAppCredentials string  // env: GOOGLE_APPLICATION_CREDENTIALS, or ~/.config/gcloud/application_default_credentials.json
    GoogleCloudProject   string  // env: GOOGLE_CLOUD_PROJECT, ANTHROPIC_VERTEX_PROJECT_ID
    OAuthCreds           string  // file: ~/.gemini/oauth_creds.json
    AnthropicAPIKey      string  // env: ANTHROPIC_API_KEY
    OpenCodeAuthFile     string  // file: ~/.local/share/opencode/auth.json
    CodexAuthFile        string  // file: ~/.codex/auth.json
    SelectedType         string  // Gemini-specific auth mode selector
}
```

### Auth Flow (Local)

```
cmd/start.go → agent.Start()
    → harness.DiscoverAuth(agentHome) → AuthConfig
    → runtime.Run(RunConfig{Auth: auth, Harness: h, ...})
        → harness.PropagateFiles(homeDir, auth)  // copy files into agent home
        → harness.GetVolumes(auth)                // or mount as volumes
        → harness.GetEnv(auth)                    // set env vars
```

### Auth Flow (Hub-Dispatched)

```
Hub: resolveSecrets() → []ResolvedSecret
    → DispatchAgentCreateWithGather(ResolvedSecrets, RequiredSecrets)
Broker: createAgent()
    → extractRequiredEnvKeys() → check satisfaction
    → if missing: return 202 + requirements
    → CLI gathers missing env → finalizeEnv()
    → agent.Start(opts.ResolvedSecrets, opts.Env)
        → inject env-type secrets into opts.Env
        → runtime projects file/variable secrets
```

### Harness Auth Summary

| Harness  | DiscoverAuth Sources | File Creds | Env Vars in GetEnv | Auth Modes |
|----------|---------------------|------------|-------------------|------------|
| Claude   | `ANTHROPIC_API_KEY` only | None | `ANTHROPIC_API_KEY` | API key only (Vertex via harness-config env) |
| Gemini   | Env + scion-agent.json + agent settings + host settings + files | OAuth, GCP ADC | `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `VERTEX_API_KEY`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_APPLICATION_CREDENTIALS` | gemini-api-key, vertex-ai, oauth-personal, compute-default-credentials |
| Generic  | Env + settings + files | OAuth, GCP ADC | All mapped from AuthConfig | Passthrough |
| OpenCode | `ANTHROPIC_API_KEY` + file | auth.json | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` (direct) | API key + auth file |
| Codex    | File only | auth.json | `OPENAI_API_KEY`, `CODEX_API_KEY` (both direct) | Auth file + API keys |

**Key Issue**: OpenCode and Codex read `OPENAI_API_KEY` and `CODEX_API_KEY` directly from `os.Getenv()` in `GetEnv()`, bypassing AuthConfig entirely.

## Proposed Design

### Phase 1: Update AuthConfig to Be Complete

Add missing fields and remove obsolete ones:

```go
type AuthConfig struct {
    // Google/Gemini auth
    GeminiAPIKey         string  // env: GEMINI_API_KEY
    GoogleAPIKey         string  // env: GOOGLE_API_KEY
    GoogleAppCredentials string  // env/file: GOOGLE_APPLICATION_CREDENTIALS or ~/.config/gcloud/application_default_credentials.json
    GoogleCloudProject   string  // env: GOOGLE_CLOUD_PROJECT, GCP_PROJECT, ANTHROPIC_VERTEX_PROJECT_ID
    GoogleCloudRegion    string  // env: GOOGLE_CLOUD_REGION, CLOUD_ML_REGION, GOOGLE_CLOUD_LOCATION
    OAuthCreds           string  // file: ~/.gemini/oauth_creds.json

    // Anthropic auth
    AnthropicAPIKey      string  // env: ANTHROPIC_API_KEY

    // OpenAI/Codex auth
    OpenAIAPIKey         string  // env: OPENAI_API_KEY
    CodexAPIKey          string  // env: CODEX_API_KEY
    CodexAuthFile        string  // file: ~/.codex/auth.json
    OpenCodeAuthFile     string  // file: ~/.local/share/opencode/auth.json

    // Auth mode selection (primarily Gemini, but available to all)
    SelectedType         string  // e.g. "gemini-api-key", "vertex-ai", "oauth-personal"
}
```

**Changes**:
- Add `GoogleCloudRegion` (sources: `GOOGLE_CLOUD_REGION`, `CLOUD_ML_REGION`, `GOOGLE_CLOUD_LOCATION`)
- Add `OpenAIAPIKey` (source: `OPENAI_API_KEY`)
- Add `CodexAPIKey` (source: `CODEX_API_KEY`)
- Remove `VertexAPIKey` (redundant with `GoogleAPIKey`; if anything still references it, migrate to `GoogleAPIKey`)

### Phase 2: Centralize Auth Gathering

Create a central function that populates AuthConfig from all available sources, replacing per-harness `DiscoverAuth()`:

```go
// pkg/harness/auth.go

// GatherAuth populates an AuthConfig from the environment, filesystem,
// and settings. It is source-agnostic: it checks env vars and well-known
// file paths without knowing which harness will consume the result.
func GatherAuth() AuthConfig {
    home, _ := os.UserHomeDir()

    auth := AuthConfig{
        // Env-var sourced fields
        GeminiAPIKey:       os.Getenv("GEMINI_API_KEY"),
        GoogleAPIKey:       os.Getenv("GOOGLE_API_KEY"),
        AnthropicAPIKey:    os.Getenv("ANTHROPIC_API_KEY"),
        OpenAIAPIKey:       os.Getenv("OPENAI_API_KEY"),
        CodexAPIKey:        os.Getenv("CODEX_API_KEY"),
        GoogleCloudProject: util.FirstNonEmpty(
            os.Getenv("GOOGLE_CLOUD_PROJECT"),
            os.Getenv("GCP_PROJECT"),
            os.Getenv("ANTHROPIC_VERTEX_PROJECT_ID"),
        ),
        GoogleCloudRegion: util.FirstNonEmpty(
            os.Getenv("GOOGLE_CLOUD_REGION"),
            os.Getenv("CLOUD_ML_REGION"),
            os.Getenv("GOOGLE_CLOUD_LOCATION"),
        ),
        GoogleAppCredentials: os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"),
    }

    // File-sourced fields: check well-known paths
    if auth.GoogleAppCredentials == "" {
        adcPath := filepath.Join(home, ".config", "gcloud", "application_default_credentials.json")
        if _, err := os.Stat(adcPath); err == nil {
            auth.GoogleAppCredentials = adcPath
        }
    }

    oauthPath := filepath.Join(home, ".gemini", "oauth_creds.json")
    if _, err := os.Stat(oauthPath); err == nil {
        auth.OAuthCreds = oauthPath
    }

    codexPath := filepath.Join(home, ".codex", "auth.json")
    if _, err := os.Stat(codexPath); err == nil {
        auth.CodexAuthFile = codexPath
    }

    opencodePath := filepath.Join(home, ".local", "share", "opencode", "auth.json")
    if _, err := os.Stat(opencodePath); err == nil {
        auth.OpenCodeAuthFile = opencodePath
    }

    return auth
}
```

**Settings overlay**: After `GatherAuth()`, the caller can overlay values from settings (agent settings, host settings, scion-agent.json) for things like `SelectedType` and API keys stored in settings files. This overlay logic currently lives in Gemini's `DiscoverAuth()` and should be extracted.

### Phase 3: Harness Auth Resolution (Per-Harness Preference Order)

Each harness defines its auth preference order and resolves which auth method to use given a populated AuthConfig. This replaces the current ad-hoc logic spread across `GetEnv()`.

```go
// pkg/api/harness.go - add to Harness interface

// ResolveAuth examines a fully-populated AuthConfig and returns the
// resolved auth method plus the env vars and files needed to establish it.
// Returns an error if no valid auth method could be determined.
type ResolvedAuth struct {
    Method   string            // e.g. "anthropic-api-key", "vertex-ai", "oauth-personal"
    EnvVars  map[string]string // env vars to inject into container
    Files    []FileMapping     // files to copy/mount into container
}

type FileMapping struct {
    SourcePath    string // host path (or AuthConfig field value)
    ContainerPath string // target path inside container (uses ~ for home)
}
```

#### Claude Auth Resolution

```
Preference order:
1. AnthropicAPIKey → set ANTHROPIC_API_KEY
2. GoogleAppCredentials + GoogleCloudProject + GoogleCloudRegion → Vertex mode
   → set CLAUDE_CODE_USE_VERTEX=1, CLOUD_ML_REGION, ANTHROPIC_VERTEX_PROJECT_ID
   → propagate ADC file
3. Fail: no valid auth
```

#### Gemini Auth Resolution

```
Preference order (respects SelectedType if set):
1. If SelectedType == "oauth-personal" && OAuthCreds exists → oauth mode
2. If SelectedType == "vertex-ai" → vertex mode (needs GoogleCloudProject)
3. If SelectedType == "gemini-api-key" → api key mode (needs GeminiAPIKey or GoogleAPIKey)
4. If SelectedType == "compute-default-credentials" → ADC mode
5. Auto-detect: GeminiAPIKey/GoogleAPIKey → api-key, GoogleAppCredentials → ADC, OAuthCreds → oauth
6. Fail: no valid auth
```

#### Codex Auth Resolution

```
Preference order:
1. CodexAPIKey → set CODEX_API_KEY
2. OpenAIAPIKey → set OPENAI_API_KEY
3. CodexAuthFile → propagate to ~/.codex/auth.json
4. Fail: no valid auth
```

#### OpenCode Auth Resolution

```
Preference order:
1. AnthropicAPIKey → set ANTHROPIC_API_KEY
2. OpenAIAPIKey → set OPENAI_API_KEY
3. OpenCodeAuthFile → propagate to ~/.local/share/opencode/auth.json
4. Fail: no valid auth
```

### Phase 4: Unified Provisioning Flow

Replace the current split between `DiscoverAuth()`/`GetEnv()`/`PropagateFiles()`/`GetVolumes()` with a single flow:

```
1. GatherAuth()                    → AuthConfig (env + filesystem scan)
2. overlaySettings(auth, settings) → AuthConfig (settings/config overlays)
3. harness.ResolveAuth(auth)       → ResolvedAuth (method + env + files)
4. validateAuth(resolved)          → error if insufficient
5. applyAuth(resolved, container)  → inject env vars, copy/mount files
```

This flow works identically for both local and hub-dispatched modes:

- **Local**: `GatherAuth()` reads from host env/filesystem. `overlaySettings()` applies local settings.
- **Hub-dispatched**: `GatherAuth()` reads from broker env + injected `ResolvedSecrets` (environment-type secrets become env vars, file-type secrets are already written to target paths). The same `ResolveAuth()` logic applies.

### Phase 5: Simplify Harness Interface

The following Harness interface methods can be consolidated:

**Remove** (replaced by `ResolveAuth`):
- `DiscoverAuth(agentHome string) AuthConfig` — replaced by `GatherAuth()` + `ResolveAuth()`
- `GetVolumes(unixUsername string, auth AuthConfig) []VolumeMount` — volumes are derived from `ResolvedAuth.Files`

**Simplify** (derive from `ResolvedAuth`):
- `GetEnv()` — non-auth env vars remain (system prompt, telemetry), but auth env moves to `ResolvedAuth.EnvVars`
- `PropagateFiles()` — auth file propagation moves to `ResolvedAuth.Files`; non-auth file ops (settings.json updates) remain in `Provision()`

**New**:
- `ResolveAuth(auth AuthConfig) (*ResolvedAuth, error)` — per-harness auth resolution with preference order

### Phase 6: Align Hub Secrets with AuthConfig Fields

Document the mapping between hub secret names and AuthConfig fields so users know what to store:

| Hub Secret Name | Type | Target | AuthConfig Field |
|----------------|------|--------|-----------------|
| `GEMINI_API_KEY` | environment | `GEMINI_API_KEY` | GeminiAPIKey |
| `GOOGLE_API_KEY` | environment | `GOOGLE_API_KEY` | GoogleAPIKey |
| `ANTHROPIC_API_KEY` | environment | `ANTHROPIC_API_KEY` | AnthropicAPIKey |
| `OPENAI_API_KEY` | environment | `OPENAI_API_KEY` | OpenAIAPIKey |
| `CODEX_API_KEY` | environment | `CODEX_API_KEY` | CodexAPIKey |
| `GOOGLE_CLOUD_PROJECT` | environment | `GOOGLE_CLOUD_PROJECT` | GoogleCloudProject |
| `GOOGLE_CLOUD_REGION` | environment | `GOOGLE_CLOUD_REGION` | GoogleCloudRegion |
| `GOOGLE_APPLICATION_CREDENTIALS` | file | `~/.config/gcloud/application_default_credentials.json` | GoogleAppCredentials |
| `OAUTH_CREDS` | file | `~/.gemini/oauth_creds.json` | OAuthCreds |
| `CODEX_AUTH` | file | `~/.codex/auth.json` | CodexAuthFile |
| `OPENCODE_AUTH` | file | `~/.local/share/opencode/auth.json` | OpenCodeAuthFile |

For file-type secrets, the Hub stores base64-encoded content and the runtime projects them to the target path. The `GatherAuth()` function on the broker side would detect these projected files the same way it detects host files.

## Implementation Plan

### Step 1: Expand AuthConfig
- Add `GoogleCloudRegion`, `OpenAIAPIKey`, `CodexAPIKey`
- Remove `VertexAPIKey` (search for all references, migrate to `GoogleAPIKey`)
- Update all test fixtures

### Step 2: Create GatherAuth
- Implement `GatherAuth()` in `pkg/harness/auth.go`
- Add settings overlay function
- Write tests

### Step 3: Implement ResolveAuth Per Harness
- Add `ResolveAuth(AuthConfig) (*ResolvedAuth, error)` to Harness interface
- Implement for each harness with documented preference order
- Add `ResolvedAuth`, `FileMapping` types to `pkg/api/types.go`
- Write tests for each harness's resolution logic (valid combos, missing fields, preference order)

### Step 4: Wire Into Provisioning
- Update `agent.Start()` to use new flow: `GatherAuth → overlay → ResolveAuth → validate → apply`
- Update `runtime/common.go` to apply `ResolvedAuth` (env vars + files)
- Ensure hub-dispatched path produces same results
- Update broker `extractRequiredEnvKeys()` to consult `ResolveAuth`

### Step 5: Clean Up Legacy Methods
- Remove `DiscoverAuth` from interface (after all callers migrated)
- Simplify `GetEnv` to only return non-auth env vars
- Simplify `PropagateFiles` to only handle non-auth file ops
- Remove `GetVolumes` if fully subsumed

### Step 6: Validation and Error Reporting
- Add `ValidateAuth()` that checks `ResolvedAuth` completeness before container launch
- Produce clear error messages: "Claude requires ANTHROPIC_API_KEY or Vertex credentials (GOOGLE_APPLICATION_CREDENTIALS + GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_REGION)"
- Integrate with env-gather to only request what's actually needed

## Open Questions

### 1. Should `ResolveAuth` return multiple viable methods?

Currently proposed as returning the single best method. An alternative is returning all viable methods ranked, letting the caller (or user) choose. This would complicate the flow but enable scenarios like "prefer Vertex but fall back to API key".

**Recommendation**: Return the single best method for now. The `SelectedType` field already allows users to force a specific method; auto-detection picks the best available.

### 2. How should Gemini settings.json integration work?

Gemini's `DiscoverAuth()` currently reads from `~/.gemini/settings.json` (agent and host) for API keys and `SelectedType`. With centralized `GatherAuth()`, we need to decide whether settings.json parsing belongs in the gather phase or the overlay phase.

**Recommendation**: Settings overlay. `GatherAuth()` is env+filesystem only. Settings values are applied in `overlaySettings()`, which is called after `GatherAuth()` and before `ResolveAuth()`. This keeps `GatherAuth()` simple and source-agnostic.

### 3. File path normalization: when and how?

File paths in AuthConfig reference host paths (e.g., `/home/user/.config/gcloud/...`). These need to become container paths (e.g., `/home/scion/.config/gcloud/...`). Currently each harness does this ad-hoc in `PropagateFiles()` and `GetEnv()`.

**Recommendation**: `ResolvedAuth.Files[].ContainerPath` uses `~` as the home directory placeholder. The runtime layer expands `~` to the actual container home at apply time. This normalizes the abstraction and avoids harness-level path manipulation.

### 4. Should `GatherAuth` be harness-aware?

The current proposal has `GatherAuth()` scan for all possible credentials regardless of which harness will use them. This means it may check for files that aren't relevant (e.g., checking for `~/.codex/auth.json` when running a Claude agent).

**Recommendation**: Keep it harness-agnostic. The cost of a few extra `os.Stat` calls is negligible, and it simplifies the architecture. `ResolveAuth()` is where harness-specificity lives.

### 5. What about the `AuthProvider` interface?

The `AuthProvider` interface (`GetAuthConfig(context.Context) (AuthConfig, error)`) is currently used in `agent.Start()` as an alternative to `DiscoverAuth()`. With the new flow, `AuthProvider` could be the settings-overlay mechanism or could be removed entirely.

**Recommendation**: Keep `AuthProvider` as an injection point for testing and for cases where auth comes from an external source (e.g., a vault). The default implementation would be `GatherAuth() + overlaySettings()`.

### 6. Claude Vertex auth: harness-config env vs AuthConfig?

Currently Claude's Vertex auth is configured entirely through harness-config `settings.json` env vars (`CLAUDE_CODE_USE_VERTEX=1`, `CLOUD_ML_REGION=global`, `ANTHROPIC_VERTEX_PROJECT_ID=...`). The AuthConfig has no role. Should we bring this into the AuthConfig flow?

**Recommendation**: Yes. Claude's `ResolveAuth()` should detect when `GoogleAppCredentials + GoogleCloudProject` are available and produce the Vertex env vars. The harness-config env vars become a static default that `ResolveAuth` can override when better credentials are available. This unifies local and hub auth for Claude.

### 7. Breaking change: removing `VertexAPIKey`

`VertexAPIKey` appears in AuthConfig and Gemini's `GetEnv()` (mapped to `VERTEX_API_KEY`). The K8s runtime also references it in backward-compat fallback code. Removing it requires checking whether any deployed configurations reference it.

**Recommendation**: Deprecate rather than remove in the first pass. Map `VertexAPIKey → GoogleAPIKey` in `GatherAuth()` and log a deprecation warning. Remove in a follow-up once configs are migrated.

### 8. The `OPENAI_API_KEY` precedent: env vars read outside AuthConfig

Both Codex and OpenCode read `OPENAI_API_KEY` directly in `GetEnv()` via `os.Getenv()`. This bypasses AuthConfig and means the key isn't visible to auth validation. Adding `OpenAIAPIKey` to AuthConfig fixes this, but we need to ensure no other harnesses have similar leaks.

**Recommendation**: Audit all harness `GetEnv()` methods for direct `os.Getenv()` calls that should be in AuthConfig. The Codex harness also reads `CODEX_API_KEY` directly. Both should move into AuthConfig.

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking existing local setups | Phase the rollout; keep `DiscoverAuth` as fallback initially |
| Hub secrets not yet stored for all field types | Document the mapping; existing env-type secrets already work |
| Gemini's complex settings.json chain | Extract to overlay function with thorough test coverage |
| K8s runtime backward-compat code references old fields | Update K8s M1 fallback to use new field names |
| Harness interface changes break external consumers | Alpha project; interface changes are acceptable per CLAUDE.md |

## Files Affected

### Core Changes
- `pkg/api/types.go` — AuthConfig struct, new ResolvedAuth type
- `pkg/api/harness.go` — Harness interface (add ResolveAuth, eventually remove DiscoverAuth/GetVolumes)
- `pkg/harness/auth.go` — **New**: GatherAuth, overlaySettings
- `pkg/harness/claude_code.go` — Add ResolveAuth, simplify GetEnv/PropagateFiles
- `pkg/harness/gemini_cli.go` — Add ResolveAuth, extract settings overlay, simplify GetEnv/PropagateFiles
- `pkg/harness/generic.go` — Add ResolveAuth, simplify GetEnv/PropagateFiles
- `pkg/harness/opencode.go` — Add ResolveAuth, simplify GetEnv/PropagateFiles
- `pkg/harness/codex.go` — Add ResolveAuth, simplify GetEnv/PropagateFiles

### Provisioning Flow
- `pkg/agent/run.go` — Use new GatherAuth → ResolveAuth flow
- `pkg/runtime/common.go` — Apply ResolvedAuth (env + files)
- `pkg/runtime/interface.go` — RunConfig may carry ResolvedAuth instead of AuthConfig

### Hub/Broker
- `pkg/runtimebroker/handlers.go` — Update extractRequiredEnvKeys to use ResolveAuth
- `pkg/runtime/k8s_runtime.go` — Update M1 backward-compat fallback

### Tests
- `pkg/harness/*_test.go` — New tests for ResolveAuth, update existing
- `pkg/runtime/common_test.go` — Update for new auth flow
- `pkg/config/mock_harness_test.go` — Add ResolveAuth to mock
