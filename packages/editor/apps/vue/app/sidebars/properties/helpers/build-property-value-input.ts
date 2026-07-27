import {
  buildDisplayInputProps,
  buildEditingRefProps,
} from "@app/sidebars/state-props"

import type { PropertyControl } from "../hooks/use-property-control"

interface BuildPropertyValueInputArgs {
  control: PropertyControl
  isEditing: boolean
  displayValue: string
  endEdit: () => void
  onTabNext: () => boolean
  onTabPrev: () => boolean
}

/**
 * Builds the props for a property row's value `input` slot. The same generated
 * `<input>` shows the read-only display value and, in edit mode, becomes the
 * live text/combobox control. The floating option list is rendered separately.
 * Vue port of the React `buildPropertyValueInput`.
 */
export function buildPropertyValueInput({
  control,
  isEditing,
  displayValue,
  endEdit,
  onTabNext,
  onTabPrev,
}: BuildPropertyValueInputArgs): Record<string, unknown> {
  const kind = control.kind.value

  if (!isEditing || kind === "none" || kind === "switch") {
    return buildDisplayInputProps(displayValue)
  }

  if (kind === "field") {
    return {
      value: control.fieldValue.value,
      readonly: false,
      ...buildEditingRefProps(true),
      onInput: (event: Event) =>
        (control.fieldDraft.value = (event.target as HTMLInputElement).value),
      onFocus: (event: FocusEvent) =>
        (event.currentTarget as HTMLInputElement).select(),
      onKeydown: (event: KeyboardEvent) => {
        const target = event.currentTarget as HTMLInputElement
        if (event.key === "Enter") {
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
        const value = (event.currentTarget as HTMLInputElement).value.trim()
        control.submitField(value)
        endEdit()
      },
    }
  }

  // Menu/combo: type-to-filter input paired with the floating option list.
  const combo = control.combobox
  return {
    value: combo.inputValue.value,
    readonly: false,
    ...buildEditingRefProps(true),
    onInput: (event: Event) =>
      combo.handleInputChange((event.target as HTMLInputElement).value),
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      if (!combo.open.value) combo.setOpen(true)
    },
    onFocus: (event: FocusEvent) => {
      combo.setOpen(true)
      ;(event.currentTarget as HTMLInputElement).select()
    },
    onKeydown: (event: KeyboardEvent) => {
      const target = event.currentTarget as HTMLInputElement
      if (event.key === "ArrowDown") {
        event.preventDefault()
        combo.highlightNext()
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        combo.highlightPrev()
        return
      }
      if (event.key === "Enter") {
        event.preventDefault()
        combo.handleSubmit()
        return
      }
      if (event.key === "Tab") {
        combo.handleSubmit({ keepFocus: true })
        const moved = event.shiftKey ? onTabPrev() : onTabNext()
        if (moved) event.preventDefault()
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        combo.handleCancel()
        endEdit()
        target.blur()
      }
    },
  }
}
