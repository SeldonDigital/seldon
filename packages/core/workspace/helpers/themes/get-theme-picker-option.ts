import { isThemeBoard } from "../../model/components"
import type { Workspace } from "../../types"
import { getBoardOrder } from "../components/board-sort-order"
import { getThemeEntryDisplayName } from "./get-theme-entry-display-name"

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

  const themeBoards = Object.values(workspace.boards ?? {})
    .filter(isThemeBoard)
    .sort((a, b) => getBoardOrder(a) - getBoardOrder(b))

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
