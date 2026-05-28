import { computeWorkspaceThemes } from "../../compute/compute-workspace-themes"
import type { Workspace } from "../../types"

export type WorkspaceThemePickerOption = {
  value: string
  name: string
}

export type WorkspaceThemePickerOptionsInput = {
  workspace: Workspace
  allowInherit?: boolean
}

/**
 * Picker options for assigning a workspace theme entry to a node or board.
 */
export function getWorkspaceThemePickerOptions({
  workspace,
  allowInherit = true,
}: WorkspaceThemePickerOptionsInput): WorkspaceThemePickerOption[] {
  const options: WorkspaceThemePickerOption[] = []

  if (allowInherit) {
    options.push({ value: "none", name: "Inherit" })
  }

  for (const theme of computeWorkspaceThemes(workspace)) {
    options.push({
      value: theme.id,
      name: theme.metadata.name,
    })
  }

  return options
}
