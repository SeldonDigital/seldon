import { produce } from "immer"
import { ComponentId } from "../../../../components/constants"
import { Workspace } from "../../../types"

/**
 * Updates a component ID throughout the workspace, moving the board and updating all references.
 * @param workspace - The workspace to update
 * @param oldId - The old component ID to replace
 * @param newId - The new component ID to use
 * @returns The updated workspace with the new component ID
 */
export function updateComponentId(
  workspace: Workspace,
  oldId: ComponentId,
  newId: ComponentId,
) {
  return produce(workspace, (draft) => {
    if (draft.boards[oldId]) {
      draft.boards[newId] = draft.boards[oldId]
      draft.boards[newId].id = newId

      for (const node of Object.values(draft.byId)) {
        if (node.component === oldId) {
          node.component = newId
        }
      }

      delete draft.boards[oldId]
    }
  })
}
