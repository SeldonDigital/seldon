import {
  buildDisplayInputProps,
  buildEditingRefProps,
} from "@lib/views/state-props"
import {
  type ChangeEvent,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useRef,
} from "react"
import { InputProps } from "@seldon/components/primitives/Input"
import { useRenameValue } from "./use-rename-value"

interface UseRenameInputOptions {
  label: string
  isEditing: boolean
  setEditing: (editing: boolean) => void
  onSubmit: (value: string) => void
}

/**
 * Drives the sidebar row name as the combobox `input` slot. In display mode the
 * input shows the label read-only and stays inert (`pointerEvents: none`) so row
 * selection and drag still work through it. Double-clicking the row flips the row
 * into edit mode; the effect focuses and selects the input. Enter commits, Escape
 * cancels, and blur commits.
 *
 * The returned `ref` rides the typed `InputProps` to the underlying input via
 * React 19 ref-as-prop, the same way `useRowActionsMenu` threads its button ref.
 */
export function useRenameInput({
  label,
  isEditing,
  setEditing,
  onSubmit,
}: UseRenameInputOptions): InputProps & { ref?: Ref<HTMLInputElement> } {
  const { value, setValue, cancel } = useRenameValue({
    label,
    isEditing,
    setEditing,
  })
  const ref = useRef<HTMLInputElement>(null)

  // Collapse the input's own selection and drop any document selection. The
  // double-click that opens edit mode leaves a stray document range over the row
  // text, which a plain `setSelectionRange` cannot clear.
  const clearSelection = () => {
    const input = ref.current
    if (input) input.setSelectionRange(0, 0)
    if (typeof window !== "undefined") {
      window.getSelection()?.removeAllRanges()
    }
  }

  useEffect(() => {
    const input = ref.current
    if (isEditing) {
      // Drop the double-click's document selection, then select the contents so
      // typing replaces the name.
      if (typeof window !== "undefined") {
        window.getSelection()?.removeAllRanges()
      }
      if (input) {
        input.focus()
        input.select()
      }
      return
    }
    // Leaving edit mode: clear both selections so the readOnly display input does
    // not stay highlighted after the field blurs.
    clearSelection()
    // Focus once when entering edit mode; label changes mid-edit must not refocus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  if (!isEditing) {
    return buildDisplayInputProps(ref, label)
  }

  return {
    ref,
    value,
    readOnly: false,
    ...buildEditingRefProps(true),
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.currentTarget.value),
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        onSubmit(value.trim())
      } else if (event.key === "Escape") {
        event.preventDefault()
        cancel()
      }
    },
    onBlur: () => {
      onSubmit(value.trim())
      clearSelection()
    },
  }
}
