import { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, Ref } from "react"
import { PropertyControlView } from "../hooks/use-property-control"
import { InputProps } from "@seldon/components/primitives/Input"

export type ValueInputProps = InputProps & { ref?: Ref<HTMLInputElement> }

interface BuildPropertyValueInputArgs {
  control: PropertyControlView
  isEditing: boolean
  /** Read-only string shown when the row is not being edited. */
  displayValue: string
  /** Ref attached to the slot input, used for focus and menu anchoring. */
  valueRef: Ref<HTMLInputElement>
  /** Leave edit mode without committing. */
  endEdit: () => void
  onTabNext: () => boolean
  onTabPrev: () => boolean
}

/**
 * Builds the props for a property row's value `input` slot, mirroring how the
 * objects sidebar drives its name slot with `useRenameInput`. The same generated
 * `<input>` shows the read-only display value and, in edit mode, becomes the live
 * combobox/text control. The floating option list is rendered separately by the
 * shell; this only wires the field.
 */
export function buildPropertyValueInput({
  control,
  isEditing,
  displayValue,
  valueRef,
  endEdit,
  onTabNext,
  onTabPrev,
}: BuildPropertyValueInputArgs): ValueInputProps {
  // Display mode: read-only and inert, mirroring the objects-sidebar name slot.
  // `pointerEvents: none` keeps hover and selection on the combobox field, and
  // the field's own click (wired by the shell) is what flips the row into edit
  // mode. The field becomes interactive again in the edit branches below.
  if (!isEditing || control.kind === "none") {
    return {
      ref: valueRef,
      value: displayValue,
      readOnly: true,
      style: { pointerEvents: "none" },
    }
  }

  // Text/number field: a plain inline editor. All commits route through blur;
  // Enter and Tab blur (Tab moves edit focus to the adjacent row), Escape
  // restores the original value first.
  if (control.kind === "field") {
    const field = control.combobox
    return {
      ref: valueRef,
      value: field.value,
      readOnly: false,
      autoFocus: field.autoFocus,
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        field.onValueChange(event.currentTarget.value),
      onFocus: (event: FocusEvent<HTMLInputElement>) =>
        event.currentTarget.select(),
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
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
      onBlur: (event: FocusEvent<HTMLInputElement>) => {
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

  // Menu/combo: type-to-filter input paired with the floating option list.
  const field = control.field
  return {
    ref: valueRef,
    value: field.value,
    readOnly: false,
    autoFocus: field.autoFocus,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      field.onValueChange(event.currentTarget.value),
    onClick: (event: MouseEvent<HTMLInputElement>) => {
      event.stopPropagation()
      if (!field.open) field.setOpen(true)
    },
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      field.setOpen(true)
      event.currentTarget.select()
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        field.onHighlightNext()
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        field.onHighlightPrev()
        return
      }
      if (event.key === "Enter") {
        event.preventDefault()
        field.handleSubmit()
        return
      }
      if (event.key === "Tab") {
        field.handleSubmit({ keepFocus: true })
        const moved = event.shiftKey ? onTabPrev() : onTabNext()
        if (moved) event.preventDefault()
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        field.onCancel()
        field.setOpen(false)
        endEdit()
        event.currentTarget.blur()
      }
    },
  }
}
