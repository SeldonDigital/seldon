import { EDITING_OUTLINE } from "@app/views/state-props"

import type { PropertyControlView } from "../hooks/use-property-control"
import type { TextareaProps } from "@seldon/components/primitives/Textarea"
import type { ChangeEvent, CSSProperties, FocusEvent, KeyboardEvent, Ref } from "react"

/** `field-sizing` is not yet in the React CSS typings. */
type TextareaStyle = CSSProperties & { fieldSizing?: "content" | "fixed" }

export type ValueTextareaProps = TextareaProps & { ref?: Ref<HTMLTextAreaElement> }

/**
 * The generated `sdn-textarea` value variant is styled like a single-line input
 * (`white-space: nowrap`, ellipsis, `overflow: hidden`). Override it inline so
 * the value wraps and the box auto-grows to its content height (`field-sizing`,
 * Chromium), never showing a scrollbar or resize handle.
 */
const TEXTAREA_LAYOUT: TextareaStyle = {
  whiteSpace: "normal",
  textOverflow: "clip",
  overflow: "hidden",
  resize: "none",
  fieldSizing: "content",
}

/** Inert read-only display style, mirroring `buildDisplayInputProps`. */
const DISPLAY_STYLE: TextareaStyle = { ...TEXTAREA_LAYOUT, pointerEvents: "none" }

/** Editable style: the same wrap/auto-grow layout plus the edit-mode outline. */
const EDIT_STYLE: TextareaStyle = { ...TEXTAREA_LAYOUT, outline: EDITING_OUTLINE }

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
  // Display mode: read-only and inert, so row selection, hover, and the
  // field's click-into-edit pass through to the combobox field.
  if (!isEditing || control.kind !== "field") {
    return { ref: valueRef, value: displayValue, readOnly: true, style: DISPLAY_STYLE }
  }

  const field = control.combobox

  return {
    ref: valueRef,
    value: field.value,
    readOnly: false,
    style: EDIT_STYLE,
    autoFocus: field.autoFocus,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
      field.onValueChange(event.currentTarget.value),
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
