import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

type ThemeSpecPreviewBase = {
  workspace: Workspace
  rootId: string | null
}

let cached: ThemeSpecPreviewBase | null = null

/**
 * Builds a throwaway workspace containing a single Theme Spec Sheet board and
 * its nodes.
 *
 * The result is deterministic, so it is instantiated once and cached. Theme
 * board previews clone this base and point the root at a variant theme.
 */
export function getThemeSpecPreviewBase(): ThemeSpecPreviewBase {
  if (cached) {
    return cached
  }

  const workspace = addComponent(
    { boardKey: ComponentId.THEME_SPEC },
    createEmptyWorkspace(),
  )
  const board = workspace.boards[ComponentId.THEME_SPEC]
  const rootId = board?.variants?.[0]?.id ?? null

  cached = { workspace, rootId }
  return cached
}
