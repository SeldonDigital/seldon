import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

type DialogPreviewBase = {
  workspace: Workspace
  rootId: string | null
}

let cached: DialogPreviewBase | null = null

/**
 * Builds a throwaway workspace containing a single Dialog board and its nodes.
 *
 * The result is deterministic, so it is instantiated once and cached. Theme
 * board previews clone this base and point the Dialog root at a variant theme.
 */
export function getDialogPreviewBase(): DialogPreviewBase {
  if (cached) {
    return cached
  }

  const workspace = addComponent(
    { componentId: ComponentId.DIALOG },
    createEmptyWorkspace(),
  )
  const board = workspace.components[ComponentId.DIALOG]
  const rootId = board?.variants?.[0]?.id ?? null

  cached = { workspace, rootId }
  return cached
}
