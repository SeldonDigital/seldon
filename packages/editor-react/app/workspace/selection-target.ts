import { useStore as useSelectionStore } from "@app/workspace/hooks/use-selection"

export type {
  ResourceEntryKind,
  SelectionKind,
} from "@lib/workspace/selection-kind"
export {
  SELECTION_ID_ATTR,
  SELECTION_KIND_ATTR,
  SELECTION_ROOT_ID_ATTR,
  getSelectionTarget,
  selectFromTarget,
  type SelectionTarget,
} from "@lib/workspace/selection-dom"

/**
 * The id of the object whose canvas representation should be highlighted and
 * scrolled to. Boards are excluded because a board fills the canvas. Subscribes
 * only to the selection store so it stays cheap.
 */
export function useSelectedId(): string | null {
  return useSelectionStore(
    (state) =>
      state.selectedResourceItemKey ??
      state.selectedNodeId ??
      state.selectedResourceEntry?.id ??
      null,
  )
}
