import type { CustomState } from "./node-state"
import type { WorkspaceStringMap } from "./string-maps"

export interface WorkspaceMetadata {
  owner?: string
  label?: string
  version: number
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
