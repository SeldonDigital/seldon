# Workspace Migration

This folder holds migration middleware for the workspace file. It runs after the reducer on `set_workspace`, applies pending version steps, then sets `metadata.version` to the current baseline.

## Flow

```mermaid
flowchart TB
  action[set_workspace action] --> reducer[Reducer returns workspace]
  reducer --> migration[Migration middleware]
  migration --> steps[Run steps above stored version]
  steps --> version[metadata.version = CURRENT]
  version --> out[Workspace for verification]
```

## Major Types And Functions

| Type Or Function | File | Purpose |
| --- | --- | --- |
| `CURRENT_WORKSPACE_VERSION` | `migrate-workspace.ts` | Current `metadata.version` value. Re-exported from `middleware.ts`. |
| `migrateWorkspace` | `migrate-workspace.ts` | Runs sequential migration steps from stored version + 1 through current. |
| `migrationMiddleware` | `middleware.ts` | Migrates on `set_workspace` and stamps version. Registered in `workspaceReducer` post-reducer chain. |
| `migrateV1BackgroundBlendFilter` | `steps/migrate-00001-background-blend-filter.ts` | v1 step. Normalizes legacy EXACT `blendMode` and `filter` values. |

## Version 1

Normalizes background blend and filter stored shapes:

- `blendMode` EXACT with a known CSS blend keyword becomes OPTION.
- `blendMode` EXACT with an unknown string becomes EMPTY.
- `filter` EXACT that matches a catalog preset becomes OPTION.
- Other `filter` EXACT strings stay unchanged.

The step walks `nodes[*].overrides`, `themes[*].overrides`, and board `componentProperties`.

## Notes

`metadata.version` is the version counter on the file. The file format spec version is `WORKSPACE_SPEC_VERSION` in `workspace/model/constants.ts`, documented in `workspace/README.md`.

When a breaking saved shape lands, add a versioned migration step in `migrate-workspace.ts` and bump `CURRENT_WORKSPACE_VERSION`.

Name step files `migrate-NNNNN-short-description.ts`, where `NNNNN` is the target version zero-padded to five digits. Zero-padding keeps step files in version order when sorted by name. Version 1 is `migrate-00001-...` and version 2 is `migrate-00002-...`.
