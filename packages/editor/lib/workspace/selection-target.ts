import { InstanceId, VariantId } from "@seldon/core"
import type { ComponentKey } from "@seldon/core/workspace/types"
import { useStore as useSelectionStore } from "./hooks/use-selection"

/**
 * The kinds of object a single click or hover can target. Every selectable
 * canvas element and sidebar row tags itself with one of these plus its id, so
 * one code path resolves selection and highlight for all of them.
 */
export type SelectionKind =
  | "node"
  | "board"
  | "theme"
  | "fontCollection"
  | "resourceItem"

export const SELECTION_ID_ATTR = "data-selection-id"
export const SELECTION_KIND_ATTR = "data-selection-kind"

export type SelectionTarget = { id: string; kind: SelectionKind }

/**
 * Resolves the selection target from an event target by walking up to the
 * nearest element tagged with `data-selection-id` / `data-selection-kind`.
 */
export function getSelectionTarget(
  element: Element | null,
): SelectionTarget | null {
  const match = element?.closest<HTMLElement>(`[${SELECTION_ID_ATTR}]`)
  if (!match) return null
  const id = match.getAttribute(SELECTION_ID_ATTR)
  const kind = match.getAttribute(SELECTION_KIND_ATTR) as SelectionKind | null
  if (!id || !kind) return null
  return { id, kind }
}

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
      state.selectedThemeEntryId ??
      state.selectedFontCollectionEntryId ??
      null,
  )
}
/**
 * Dispatches a selection target to the matching typed setter. The setters carry
 * their existing side effects (tree expansion, sidebar scroll), so clicking on
 * the canvas behaves the same as clicking the row.
 */
export function selectFromTarget(
  target: SelectionTarget,
  setters: {
    selectNode: (id: VariantId | InstanceId | null) => void
    selectBoard: (id: ComponentKey | null) => void
    selectThemeEntry: (id: string | null) => void
    selectFontCollectionEntry: (id: string | null) => void
    selectResourceItem: (key: string | null) => void
  },
): void {
  switch (target.kind) {
    case "node":
      setters.selectNode(target.id as VariantId | InstanceId)
      return
    case "board":
      setters.selectBoard(target.id as ComponentKey)
      return
    case "theme":
      setters.selectThemeEntry(target.id)
      return
    case "fontCollection":
      setters.selectFontCollectionEntry(target.id)
      return
    case "resourceItem":
      setters.selectResourceItem(target.id)
      return
  }
}
