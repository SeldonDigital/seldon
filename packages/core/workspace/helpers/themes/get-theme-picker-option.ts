import { isThemeBoard } from "../../model/components"
import type { Workspace } from "../../types"
import { getThemeEntryDisplayName } from "./get-theme-entry-display-name"
import { sortThemeBoardsForDisplay } from "./sort-theme-boards"

export type ThemePickerOption = {
  value: string
  name: string
}

export type ThemePickerOptionsInput = {
  workspace: Workspace
  allowInherit?: boolean
}

/**
 * Picker options for assigning a workspace theme entry to a node or board.
 *
 * Lists each theme board's entries. The default entry shows the board label,
 * and every variant shows `{board label} · {variant label}`.
 */
export function getThemePickerOptions({
  workspace,
  allowInherit = true,
}: ThemePickerOptionsInput): ThemePickerOption[] {
  const options: ThemePickerOption[] = []

  if (allowInherit) {
    options.push({ value: "none", name: "Inherit" })
  }

  const themeBoards = sortThemeBoardsForDisplay(
    Object.values(workspace.boards ?? {}).filter(isThemeBoard),
  )

  for (const board of themeBoards) {
    board.variants.forEach((variantRef) => {
      const name = getThemeEntryDisplayName(variantRef.id, workspace)
      if (!name) {
        return
      }
      options.push({ value: variantRef.id, name })
    })
  }

  return options
}
