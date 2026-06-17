import { InstanceId, VariantId } from "@seldon/core"
import type { BoardKey } from "@seldon/core/workspace/types"
import {
  type ResourceEntryKind,
  useStore as useSelectionStore,
} from "./hooks/use-selection"

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
  | "iconSet"
  | "media"
  | "resourceItem"

/** Maps a resource-entry selection kind to the unified resource entry kind. */
const RESOURCE_ENTRY_KIND_BY_SELECTION_KIND: Partial<
  Record<SelectionKind, ResourceEntryKind>
> = {
  theme: "theme",
  fontCollection: "fontCollection",
  iconSet: "iconSet",
  media: "media",
}

export const SELECTION_ID_ATTR = "data-selection-id"
export const SELECTION_KIND_ATTR = "data-selection-kind"
export const SELECTION_ROOT_ID_ATTR = "data-selection-root-id"

/**
 * A resolved selection. For nodes, `rootId` is the ordered node-id path of the
 * copy, from the variant-root down to the node itself, joined by "/". A child
 * node id is shared both across variant columns and across sibling copies
 * inside one column, so the full path is what uniquely identifies the clicked
 * or hovered copy. Both the canvas and the objects sidebar stamp this path on
 * their selectable elements, so one code path resolves selection for both.
 */
export type SelectionTarget = {
  id: string
  kind: SelectionKind
  rootId?: string
}

/**
 * Resolves the selection target from an event target by walking up to the
 * nearest element tagged with `data-selection-id` / `data-selection-kind`. For
 * nodes, the copy's path is read from the `data-selection-root-id` attribute
 * that the canvas and sidebar both stamp, so neither surface needs its own
 * selection logic.
 */
export function getSelectionTarget(
  element: Element | null,
): SelectionTarget | null {
  const match = element?.closest<HTMLElement>(`[${SELECTION_ID_ATTR}]`)
  if (!match) return null
  const id = match.getAttribute(SELECTION_ID_ATTR)
  const kind = match.getAttribute(SELECTION_KIND_ATTR) as SelectionKind | null
  if (!id || !kind) return null
  if (kind === "node") {
    const rootId = match.getAttribute(SELECTION_ROOT_ID_ATTR) ?? undefined
    return {
      id,
      kind,
      rootId: rootId ?? id,
    }
  }
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
      state.selectedResourceEntry?.id ??
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
    selectNode: (
      id: VariantId | InstanceId | null,
      rootId?: string | null,
    ) => void
    selectBoard: (id: BoardKey | null) => void
    selectResourceEntry: (kind: ResourceEntryKind, id: string | null) => void
    selectResourceItem: (key: string | null) => void
  },
): void {
  switch (target.kind) {
    case "node":
      setters.selectNode(target.id as VariantId | InstanceId, target.rootId)
      return
    case "board":
      setters.selectBoard(target.id as BoardKey)
      return
    case "theme":
    case "fontCollection":
    case "iconSet":
    case "media":
      setters.selectResourceEntry(
        RESOURCE_ENTRY_KIND_BY_SELECTION_KIND[target.kind] as ResourceEntryKind,
        target.id,
      )
      return
    case "resourceItem":
      setters.selectResourceItem(target.id)
      return
  }
}
