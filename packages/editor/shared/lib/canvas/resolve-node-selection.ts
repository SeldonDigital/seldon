/** The gesture that drove a canvas node selection. */
export type CanvasSelectMode = "root" | "drill" | "exact"

/** A resolved node selection: the node id and its render-position path. */
export type ResolvedNodeSelection = { id: string; rootId: string }

/**
 * Resolves which node a canvas gesture selects from the clicked node's render
 * path and the current selection path. The clicked path is the slash-joined
 * node-id chain from the variant root down to the deepest node under the cursor,
 * as stamped on `data-selection-root-id`. The current path is the same shape for
 * the active selection, or null when nothing is selected.
 *
 * - `root`: the top-most node of the clicked tree, for a single click.
 * - `exact`: the deepest node under the cursor, for a cmd/ctrl click. This is
 *   the plain selection the sidebar arrow produces.
 * - `drill`: one level deeper than the current selection along the clicked path,
 *   for a double click. When the current selection is an ancestor on the path,
 *   the next node down that path is selected. Otherwise the gesture enters at the
 *   first child below the root, so repeated double clicks walk down the tree.
 */
export function resolveCanvasNodeSelection(
  clickedRootId: string,
  currentRootId: string | null,
  mode: CanvasSelectMode,
): ResolvedNodeSelection {
  const path = clickedRootId.split("/")
  const deepestIndex = path.length - 1

  if (mode === "exact") {
    return { id: path[deepestIndex], rootId: clickedRootId }
  }

  if (mode === "root") {
    return { id: path[0], rootId: path[0] }
  }

  const selectionPath = currentRootId ? currentRootId.split("/") : []
  const selectionOnPath =
    selectionPath.length > 0 &&
    selectionPath.every((segment, index) => path[index] === segment)

  let index: number
  if (selectionOnPath && selectionPath.length <= deepestIndex) {
    index = selectionPath.length
  } else if (selectionOnPath) {
    index = deepestIndex
  } else {
    index = Math.min(1, deepestIndex)
  }

  return { id: path[index], rootId: path.slice(0, index + 1).join("/") }
}
