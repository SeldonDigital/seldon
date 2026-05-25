import { invariant } from "../../../index"
import { EntryTheme, EntryThemeId, Workspace } from "../../types"

export function getThemeById(themeId: EntryThemeId, workspace: Workspace): EntryTheme {
  const theme = workspace.themes[themeId]
  invariant(theme, `Theme ${themeId} not found.`)
  return theme
}
