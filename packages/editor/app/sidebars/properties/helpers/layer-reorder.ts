/**
 * Placement of a layer drop relative to a target row, in display terms.
 * "before" is the visual gap above the target row, "after" the gap below.
 */
export type LayerPlacement = "before" | "after"

/**
 * Translates a layer drag-and-drop drop into the array `toIndex` expected by the
 * core `reorder_node_layer` action.
 *
 * Layer rows render in reverse array order (highest index on top, base index 0
 * at the bottom), so a visual "before"/above gap maps to a higher array index
 * and "after"/below maps to a lower one. The result is the destination array
 * index for `fromIndex` after a single splice-out/splice-in move, leaving the
 * other layers in their relative order.
 */
export function computeLayerToIndex(
  layerCount: number,
  fromIndex: number,
  targetIndex: number,
  placement: LayerPlacement,
): number {
  const arrayOrder = Array.from({ length: layerCount }, (_, i) => i)
  const displayOrder = arrayOrder.slice().reverse()

  const withoutSource = displayOrder.filter((index) => index !== fromIndex)
  const targetPosition = withoutSource.indexOf(targetIndex)
  if (targetPosition === -1) return fromIndex

  const insertPosition =
    placement === "before" ? targetPosition : targetPosition + 1
  withoutSource.splice(insertPosition, 0, fromIndex)

  const newArrayOrder = withoutSource.slice().reverse()
  return newArrayOrder.indexOf(fromIndex)
}
