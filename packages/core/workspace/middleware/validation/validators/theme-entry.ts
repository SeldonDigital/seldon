import { canMutateThemeTokens } from "../../../helpers/themes/can-mutate-theme-tokens"
import { check } from "../check"

import type { Workspace } from "../../../types"

export const themeEntryValidators = {
  exists: (workspace: Workspace, id: string | undefined) => {
    if (!id) return
    check(workspace.themes[id], `Theme ${id} not found`)
  },
  /**
   * Asserts the theme entry may receive token writes. Stock catalog defaults
   * stay locked. Authored theme defaults and every variant may be edited.
   */
  canMutateTokens: (workspace: Workspace, id: string) => {
    const entry = workspace.themes[id]

    check(entry, `Theme ${id} not found`)
    check(
      canMutateThemeTokens(workspace, id),
      `Custom theme tokens may only be added to variant theme entries or authored theme defaults; ${id} is type "${entry!.type}"`,
    )
  },
  customTokenExists: (workspace: Workspace, themeId: string, section: string, id: string) => {
    const entry = workspace.themes[themeId]
    const bag = entry?.overrides?.[section] as Record<string, unknown> | undefined

    check(bag?.[id], `Custom ${section} token ${id} not found in ${themeId}`)
  },
}
