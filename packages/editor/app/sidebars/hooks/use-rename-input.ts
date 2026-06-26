import {
  type ChangeEvent,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react"
import { InputProps } from "@seldon/components/primitives/Input"

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
  const [value, setValue] = useState(label)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) return
    setValue(label)
    const input = ref.current
    if (input) {
      input.focus()
      input.select()
    }
    // Focus once when entering edit mode; label changes mid-edit must not refocus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  if (!isEditing) {
    return {
      ref,
      value: label,
      readOnly: true,
      style: { pointerEvents: "none" },
    }
  }

  return {
    ref,
    value,
    readOnly: false,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.currentTarget.value),
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        onSubmit(value.trim())
      } else if (event.key === "Escape") {
        event.preventDefault()
        setEditing(false)
      }
    },
    onBlur: () => onSubmit(value.trim()),
  }
}
