import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

type TypeSpecimenPreviewBase = {
  workspace: Workspace
  rootId: string | null
}

let cached: TypeSpecimenPreviewBase | null = null

/**
 * Builds a throwaway workspace containing a single Type Specimen board and its nodes.
 *
 * The result is deterministic, so it is instantiated once and cached. Font
 * collection board previews clone this base and point the Type Specimen root at a board theme.
 */
export function getTypeSpecimenPreviewBase(): TypeSpecimenPreviewBase {
  if (cached) {
    return cached
  }

  const workspace = addComponent(
    { boardKey: ComponentId.TYPE_SPECIMEN },
    createEmptyWorkspace(),
  )
  const board = workspace.boards[ComponentId.TYPE_SPECIMEN]
  const rootId = board?.variants?.[0]?.id ?? null

  cached = { workspace, rootId }
  return cached
}
