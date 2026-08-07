import { EDITING_OUTLINE } from "@app/sidebars/state-props"

import type { PropertyControl } from "../hooks/use-property-control"

/**
 * Grows a textarea to fit its content: reset to `auto`, then take the scroll
 * height. `overflow: hidden` (below) keeps the transient scrollbar from
 * flashing. Called on mount, on value change, and on each keystroke so the box
 * always matches its rows.
 */
export function autosizeTextarea(element: HTMLTextAreaElement | null): void {
  if (!element) return
  element.style.height = "auto"
  element.style.height = `${element.scrollHeight}px`
}

/**
 * The generated `sdn-textarea` variant already wraps. Suppress the scrollbar;
 * height is driven by {@link autosizeTextarea}. Only an editable row shows the
 * resize handle; a read-only (dimmed) row keeps `resize: none`.
 */
const TEXTAREA_LAYOUT: Record<string, string> = {
  overflow: "hidden",
}

interface BuildPropertyValueTextareaArgs {
  control: PropertyControl
  isEditing: boolean
  displayValue: string
  endEdit: () => void
  onTabNext: () => boolean
  onTabPrev: () => boolean
}

/**
 * Builds the props for a multi-line property row's value `textarea` slot, the
 * textarea counterpart to `buildPropertyValueInput`. The same generated
 * `<textarea>` shows the read-only display value and, in edit mode, becomes the
 * live text control. A plain Enter inserts a newline; Cmd/Ctrl+Enter commits,
 * blur commits, and Escape restores the original value first. Vue port of the
 * React `buildPropertyValueTextarea`.
 */
export function buildPropertyValueTextarea({
  control,
  isEditing,
  displayValue,
  endEdit,
  onTabNext,
  onTabPrev,
}: BuildPropertyValueTextareaArgs): Record<string, unknown> {
  const kind = control.kind.value

  // An editable row (`field`) shows the resize handle even at rest; a read-only
  // row (dimmed Description, `none`) never does.
  const editable = kind === "field"

  if (!isEditing || kind !== "field") {
    return {
      value: displayValue,
      readonly: true,
      style: { ...TEXTAREA_LAYOUT, resize: editable ? "vertical" : "none", pointerEvents: "none" },
    }
  }

  return {
    value: control.fieldValue.value,
    readonly: false,
    style: { ...TEXTAREA_LAYOUT, resize: "vertical", outline: EDITING_OUTLINE },
    onInput: (event: Event) => {
      const target = event.target as HTMLTextAreaElement
      control.fieldDraft.value = target.value
      autosizeTextarea(target)
    },
    onFocus: (event: FocusEvent) => (event.currentTarget as HTMLTextAreaElement).select(),
    onKeydown: (event: KeyboardEvent) => {
      const target = event.currentTarget as HTMLTextAreaElement

      // Cmd/Ctrl+Enter commits; a plain Enter falls through to insert a newline.
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        target.blur()

        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        control.cancelField()
        target.blur()

        return
      }

      if (event.key === "Tab") {
        const moved = event.shiftKey ? onTabPrev() : onTabNext()

        if (moved) event.preventDefault()
      }
    },
    onBlur: (event: FocusEvent) => {
      const value = (event.currentTarget as HTMLTextAreaElement).value.trim()

      control.submitField(value)
      endEdit()
    },
  }
}
