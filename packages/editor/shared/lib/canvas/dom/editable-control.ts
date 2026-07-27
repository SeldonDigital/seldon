import { getSelectionTarget } from "../../workspace/selection-dom"

/**
 * Form controls that capture focus, a caret, or a text (I-beam) cursor when
 * rendered on the canvas. The canvas blocks their native interaction so a click
 * selects the node instead, except when the user enters edit on a selected node.
 */
const EDITABLE_CONTROL_SELECTOR =
  "input, textarea, select, [contenteditable]:not([contenteditable='false'])"

/** The nearest editable form control at or above the element, if any. */
export function getEditableControl(
  element: Element | null,
): HTMLElement | null {
  return element?.closest<HTMLElement>(EDITABLE_CONTROL_SELECTOR) ?? null
}

/** Whether the control is the focused element, i.e. it is being edited. */
export function isEditableControlFocused(control: Element): boolean {
  return typeof document !== "undefined" && document.activeElement === control
}

/**
 * Whether the editable control's node is the current selection, column-aware.
 * The control element is itself the node, so its own selection id and root path
 * identify it. A null selected root matches any column.
 */
export function isEditableControlNodeSelected(
  control: Element,
  selectedNodeId: string | null,
  selectedNodeRootId: string | null,
): boolean {
  if (!selectedNodeId) return false
  const target = getSelectionTarget(control)
  if (!target || target.kind !== "node") return false
  if (target.id !== selectedNodeId) return false
  return (
    selectedNodeRootId == null ||
    (target.rootId ?? target.id) === selectedNodeRootId
  )
}
