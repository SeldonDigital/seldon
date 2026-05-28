import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { getComputedTheme } from "../../../compute"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Removes a custom swatch from a variant theme entry's `overrides.swatch` bag.
 * First inlines the swatch's resolved color into any property that referenced it via
 * `@swatch.<key>`, then drops the slot. No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomSwatch(
  payload: ExtractPayload<"remove_theme_custom_swatch">,
  workspace: Workspace,
): Workspace {
  const entry = workspace.themes[payload.themeId]
  if (!entry || isEntryThemeDefault(entry)) return workspace

  const theme = getComputedTheme(payload.themeId, workspace as never)
  const workspaceWithoutRefs =
    workspaceMutationService.replaceSwatchRefsWithExactColor(
      theme,
      `@swatch.${payload.key}`,
      workspace,
    )

  return produce(workspaceWithoutRefs, (draft) => {
    const draftEntry = draft.themes[payload.themeId]
    if (!draftEntry) return
    removeCustomToken(draftEntry, "swatch", payload.key)
  })
}
