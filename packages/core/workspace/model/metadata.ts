import type { WorkspaceStringMap } from "./string-maps"

export interface WorkspaceMetadata {
  owner?: string
  label?: string
  version: number
  lastUpdate?: string
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
}
