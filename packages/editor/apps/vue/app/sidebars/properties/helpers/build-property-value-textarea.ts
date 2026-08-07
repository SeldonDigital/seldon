import { EDITING_OUTLINE } from "@app/sidebars/state-props"

import type { PropertyControl } from "../hooks/use-property-control"

/**
 * The generated `sdn-textarea` value variant is styled like a single-line input
 * (`white-space: nowrap`, ellipsis, `overflow: hidden`). Override it inline so
 * the value wraps and the box auto-grows to its content height (`field-sizing`,
 * Chromium), never showing a scrollbar or resize handle.
 */
const TEXTAREA_LAYOUT: Record<string, string> = {
  whiteSpace: "normal",
  textOverflow: "clip",
  overflow: "hidden",
  resize: "none",
  fieldSizing: "content",
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

  if (!isEditing || kind !== "field") {
    return {
      value: displayValue,
      readonly: true,
      style: { ...TEXTAREA_LAYOUT, pointerEvents: "none" },
    }
  }

  return {
    value: control.fieldValue.value,
    readonly: false,
    style: { ...TEXTAREA_LAYOUT, outline: EDITING_OUTLINE },
    onInput: (event: Event) =>
      (control.fieldDraft.value = (event.target as HTMLTextAreaElement).value),
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
