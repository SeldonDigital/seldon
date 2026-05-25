import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import type { EntryTheme } from "../../model/entry-theme"
import { isEntryThemeDefault, isEntryThemeVariant } from "../../model/entry-theme"
import type { Workspace } from "../../model/workspace"
import { getThemeCatalogId } from "./get-theme-catalog-id"

/**
 * Label editors expect after a catalog-aligned reset for this `themes` entry.
 */
export function getDefaultThemeEntryLabel(
  theme: EntryTheme,
  workspace: Workspace,
): string {
  const catalogId = getThemeCatalogId(theme, workspace)
  if (!catalogId) return theme.label

  if (isEntryThemeDefault(theme)) {
    const board = workspace.components[catalogId]
    if (board?.label) return board.label
    if (isComponentId(catalogId)) {
      try {
        return getComponentSchema(catalogId).name
      } catch {
        return catalogId
      }
    }
    return catalogId
  }

  if (isEntryThemeVariant(theme)) {
    return "Custom"
  }

  return theme.label
}
