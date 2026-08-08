import type { CustomState } from "./node-state"
import type { WorkspaceStringMap } from "./string-maps"

export interface WorkspaceMetadata {
  version: number
  /**
   * Stable workspace identity. Written into every persisted file so a live-store
   * record and an exported workspace copy resolve to the same workspace. The
   * migration backfills it on load and the store stamps it on create, so a
   * persisted workspace always carries one; it stays optional on the type only
   * to spare in-memory and fixture literals that predate an id.
   */
  id?: string
  owner?: string
  label?: string
  lastUpdate?: string
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  /**
   * Workspace-wide custom interaction states. Target-agnostic: each entry holds
   * a name and label only, with no render or selector data. Reserved state
   * names cannot appear here.
   */
  customStates?: CustomState[]
}
