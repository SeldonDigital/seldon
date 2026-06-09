import { isEntryThemeVariant } from "../../../model/entry-theme"
import type { Workspace } from "../../../types"
import { check } from "../check"

export const themeEntryValidators = {
  exists: (workspace: Workspace, id: string | undefined) => {
    if (!id) return
    check(workspace.themes[id], `Theme ${id} not found`)
  },
  /** Asserts the theme entry exists and has `type: "variant"`. Default entries stay catalog-aligned. */
  isVariant: (workspace: Workspace, id: string) => {
    const entry = workspace.themes[id]
    check(entry, `Theme ${id} not found`)
    check(
      isEntryThemeVariant(entry!),
      `Custom theme tokens may only be added to variant theme entries; ${id} is type "${entry!.type}"`,
    )
  },
  customTokenExists: (
    workspace: Workspace,
    themeId: string,
    section: string,
    id: string,
  ) => {
    const entry = workspace.themes[themeId]
    const bag = entry?.overrides?.[section] as
      | Record<string, unknown>
      | undefined
    check(bag?.[id], `Custom ${section} token ${id} not found in ${themeId}`)
  },
}
