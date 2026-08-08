import { EDITING_OUTLINE } from "@app/views/state-props"

import type { PropertyControlView } from "../hooks/use-property-control"
import type { TextareaProps } from "@seldon/components/primitives/Textarea"
import type { CSSProperties, ChangeEvent, FocusEvent, KeyboardEvent, Ref } from "react"

export type ValueTextareaProps = TextareaProps & { ref?: Ref<HTMLTextAreaElement> }

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
const TEXTAREA_LAYOUT: CSSProperties = {
  overflow: "hidden",
}

interface BuildPropertyValueTextareaArgs {
  control: PropertyControlView
  isEditing: boolean
  /** Read-only string shown when the row is not being edited. */
  displayValue: string
  /** Ref attached to the slot textarea, used for focus and menu anchoring. */
  valueRef: Ref<HTMLTextAreaElement>
  /** Leave edit mode without committing. */
  endEdit: () => void
  onTabNext: () => boolean
  onTabPrev: () => boolean
}

/**
 * Builds the props for a multi-line property row's value `textarea` slot, the
 * textarea counterpart to `buildPropertyValueInput`. The same generated
 * `<textarea>` shows the read-only display value and, in edit mode, becomes the
 * live text control. A plain Enter inserts a newline; Cmd/Ctrl+Enter commits,
 * blur commits, and Escape restores the original value first.
 */
export function buildPropertyValueTextarea({
  control,
  isEditing,
  displayValue,
  valueRef,
  endEdit,
  onTabNext,
  onTabPrev,
}: BuildPropertyValueTextareaArgs): ValueTextareaProps {
  // An editable row (`field`) shows the resize handle even at rest; a read-only
  // row (dimmed Description, `none`) never does.
  const editable = control.kind === "field"

  // Display mode: read-only and inert, so row selection, hover, and the
  // field's click-into-edit pass through to the combobox field.
  if (!isEditing || control.kind !== "field") {
    return {
      ref: valueRef,
      value: displayValue,
      readOnly: true,
      style: { ...TEXTAREA_LAYOUT, resize: editable ? "vertical" : "none", pointerEvents: "none" },
    }
  }

  const field = control.combobox

  return {
    ref: valueRef,
    value: field.value,
    readOnly: false,
    style: { ...TEXTAREA_LAYOUT, resize: "vertical", outline: EDITING_OUTLINE },
    autoFocus: field.autoFocus,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
      field.onValueChange(event.currentTarget.value)
      autosizeTextarea(event.currentTarget)
    },
    onFocus: (event: FocusEvent<HTMLTextAreaElement>) => event.currentTarget.select(),
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl+Enter commits; a plain Enter falls through to insert a newline.
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        event.currentTarget.blur()

        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        field.onCancel()
        event.currentTarget.blur()

        return
      }

      if (event.key === "Tab") {
        const moved = event.shiftKey ? onTabPrev() : onTabNext()

        if (moved) event.preventDefault()
      }
    },
    onBlur: (event: FocusEvent<HTMLTextAreaElement>) => {
      const value = event.currentTarget.value.trim()

      if (field.validate && !field.validate(value)) {
        field.onCancel()
      } else {
        field.onSubmit(value)
      }

      endEdit()
    },
  }
}
