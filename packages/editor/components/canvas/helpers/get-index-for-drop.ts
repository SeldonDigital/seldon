import { DragLocation } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"
import { Instance, Variant } from "@seldon/core"
import { canNodeHaveChildren } from "@seldon/core/workspace/helpers/can-node-have-children"
import { getChildDistance } from "./get-child-distance"
import { getIsHalfwayPassedLastChild } from "./get-is-halfway-passed-last-child"

/**
 * Calculates the index at which the node will be dropped within targetNode's children.
 * The index is determined based on the closest child to the drop location and the orientation of the drop.
 * If the drop location is below the middle of the last child, the node should be inserted after the last child.
 * @param {Variant | Instance} targetNode - The target node where the drop is happening.
 * @param {DragLocation} location - Details about the user's current mouse location.
 * @returns The index at which the node should be dropped.
 */

export function getIndexForDrop(
  targetNode: Variant | Instance,
  location: DragLocation,
): number {
  // This shouldn't happen, we're not dragging onto an primitive, but just in case
  if (targetNode.level === "primitive" || !canNodeHaveChildren(targetNode)) {
    return 0
  }

  const { pageX, pageY } = location.input
  const { children } = targetNode
  const parentDomElement = location.dropTargets[0].element
  const domChildren = parentDomElement.children
  const isHorizontal =
    targetNode.properties.orientation &&
    "value" in targetNode.properties.orientation
      ? targetNode.properties.orientation.value === "horizontal"
      : false

  if (!children || children.length === 0) return 0

  // Find out the index of the child closest to the drop location
  const closestChild = Array.from(domChildren).reduce(
    (closest, child, index) => {
      const childRect = child.getBoundingClientRect()
      // calculating the distance, details in get-closest-child-index.ts
      const distance = getChildDistance(childRect, pageX, pageY, isHorizontal)

      if (distance < closest.distance) {
        return { distance, index }
      } else {
        return closest
      }
    },
    { distance: Infinity, index: 0 },
  )

  const lastChild = domChildren[domChildren.length - 1]
  const isHalfwayPassedLastChild = getIsHalfwayPassedLastChild(
    lastChild.getBoundingClientRect(),
    pageX,
    pageY,
    isHorizontal,
  )

  // If the drop location is below the middle of the last child, we should insert after the last child
  if (isHalfwayPassedLastChild) {
    return closestChild.index + 1
  } else {
    return closestChild.index
  }
}
