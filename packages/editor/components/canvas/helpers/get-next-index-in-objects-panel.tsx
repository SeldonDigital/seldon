import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"
import { Placement } from "@lib/types"
import { Instance, InstanceId, Variant, VariantId } from "@seldon/core"
import { canNodeHaveChildren } from "@seldon/core/workspace/helpers/can-node-have-children"

/**
 * Checks the reposition index of the current object panel based on the drag location and target node.
 *
 * @param {DragLocationHistory} location - The drag location history.
 * @param {Variant | Instance} targetNode - The target node.
 * @param {function} findParentNode - The function to find the parent node by child ID.
 * @returns {number | undefined} - The reposition index or undefined if not found.
 */
export function getNextIndexInObjectsPanel(
  location: DragLocationHistory,
  targetNode: Variant | Instance,
  findParentNode: (
    childId: InstanceId | VariantId,
  ) => Variant | Instance | null,
): number | null {
  const destination = location.current.dropTargets[0]

  if (!destination) {
    return null
  }

  const currentNode = destination.data.targetNode as Variant | Instance
  const placement = destination.data.placement as Placement
  const parentNode = findParentNode(currentNode.id)

  if (parentNode?.id !== targetNode.id || !canNodeHaveChildren(parentNode)) {
    return null
  }

  const targetIndex = parentNode.children?.findIndex(
    (childId) => childId === currentNode.id,
  )
  if (typeof targetIndex !== "number") {
    return null
  }

  return placement === "before" ? targetIndex : targetIndex + 1
}
