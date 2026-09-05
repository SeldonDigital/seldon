import { completeExportSettings, hasCompleteExportSettings } from "../../../model/export-settings"

import type { Workspace } from "../../../model/workspace"

/**
 * Fills missing `metadata.exportSettings` fields from the shared defaults.
 *
 * New workspaces seed a complete block. Older files may omit the block or some
 * fields. This repair runs on every load so the editor, the CLI, and the MCP
 * host export from the same defaults without a versioned migration.
 */
export function repairExportSettings(workspace: Workspace): Workspace {
  const current = workspace.metadata.exportSettings
  const completed = completeExportSettings(current)

  if (hasCompleteExportSettings(current) && current.outputFolder === completed.outputFolder) {
    return workspace
  }

  return {
    ...workspace,
    metadata: {
      ...workspace.metadata,
      exportSettings: completed,
    },
  }
}
