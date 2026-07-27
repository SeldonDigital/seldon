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
 * - `root`: the plain single-click and hover target. With nothing selected it is
 *   the top-most node of the clicked tree. With a node selected it stays inside
 *   that node's active container (its parent), so it can move to a sibling at the
 *   selected level but never climbs above it. Hovering above the container keeps
 *   the current selection. Going up the tree is reserved for `exact`.
 * - `exact`: the deepest node under the cursor, for a cmd/ctrl click. This is
 *   the plain selection the sidebar arrow produces and the only way up the tree.
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
    // Nothing selected: highlight the top-most node of the clicked tree.
    if (!currentRootId) {
      return { id: path[0], rootId: path[0] }
    }

    // A node is selected: clamp to its depth so a plain gesture stays within the
    // active container instead of climbing to an ancestor. The container is the
    // selected node's parent, i.e. the path prefix above the selected segment.
    const selectionPath = currentRootId.split("/")
    const selectedIndex = selectionPath.length - 1
    const withinContainer =
      deepestIndex >= selectedIndex &&
      selectionPath
        .slice(0, selectedIndex)
        .every((segment, index) => path[index] === segment)

    // Above or outside the active container: keep the selection so hover and a
    // plain click never go up the tree.
    if (!withinContainer) {
      return { id: selectionPath[selectedIndex], rootId: currentRootId }
    }

    return {
      id: path[selectedIndex],
      rootId: path.slice(0, selectedIndex + 1).join("/"),
    }
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
