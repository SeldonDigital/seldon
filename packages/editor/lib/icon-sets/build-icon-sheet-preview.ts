import { ComponentId } from "@seldon/core/components/constants"
import { componentBoardDefaultNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

type IconSheetPreviewBase = {
  workspace: Workspace
  rootId: string | null
}

let cached: IconSheetPreviewBase | null = null

/**
 * Builds a throwaway workspace containing an Icon board and its nodes.
 *
 * The result is deterministic, so it is instantiated once and cached. Icon set
 * board previews clone this base, point the Icon root at a board theme, and
 * inject one icon symbol per included icon. The root is the Icon default variant
 * node (`component-icon-default`).
 */
export function getIconSheetPreviewBase(): IconSheetPreviewBase {
  if (cached) {
    return cached
  }

  const workspace = addComponent(
    { componentId: ComponentId.ICON },
    createEmptyWorkspace(),
  )
  const rootId = componentBoardDefaultNodeId(ComponentId.ICON)
  const exists = Boolean(workspace.nodes[rootId])

  cached = { workspace, rootId: exists ? rootId : null }
  return cached
}
