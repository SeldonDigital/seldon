import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { ButtonIconicProps } from "@seldon/components/elements/ButtonIconic"
import { ComboboxFieldFilterFieldProps } from "@seldon/components/elements/ComboboxFieldFilterField"
import { InputProps } from "@seldon/components/primitives/Input"
import {
  buildDisplayInputProps,
  buildEditingRefProps,
} from "../../shared/build-field-state-props"

const PLACEHOLDER = "Filter..."

export interface FilterInput {
  /** Active filter text, trimmed by the caller when matching. */
  query: string
  /** Field props: a single click enters edit and focuses the input. */
  comboboxField: ComboboxFieldFilterFieldProps
  /** Input slot props: inert display when resting, live text input when editing. */
  input: InputProps & { ref?: Ref<HTMLInputElement> }
  /**
   * Trailing actions (the X): resets the filter without re-entering edit. Null
   * while the filter is empty so the View hides the button until there is text.
   */
  buttonIconic: ButtonIconicProps | null
}

/**
 * Drives the properties-sidebar filter field. Mirrors the property-value row:
 * the resting input is an inert read-only display (`pointerEvents: none`) so a
 * single click lands on the combobox field and flips it into edit mode, where
 * the input becomes a live text box. Hover and selected styling come from the
 * `ComboboxFieldFilterField` CSS. Typing updates `query` for live filtering;
 * clearing the text, pressing Escape, or clicking the X resets.
 */
export function useFilterInput(): FilterInput {
  const [query, setQuery] = useState("")
  const [isEditing, setEditing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) ref.current?.focus()
  }, [isEditing])

  const enterEdit = useCallback(() => setEditing(true), [])

  const reset = useCallback(() => {
    setQuery("")
    setEditing(false)
  }, [])

  const comboboxField: ComboboxFieldFilterFieldProps = { onClick: enterEdit }

  // Hide the reset button until there is text to clear. Passing `null` makes the
  // View drop the button entirely rather than render an inert one.
  const buttonIconic: ButtonIconicProps | null = query
    ? {
        onClick: (event: MouseEvent<HTMLElement>) => {
          event.stopPropagation()
          reset()
        },
      }
    : null

  if (!isEditing) {
    return {
      query,
      comboboxField,
      input: { ...buildDisplayInputProps(ref, query), placeholder: PLACEHOLDER },
      buttonIconic,
    }
  }

  return {
    query,
    comboboxField,
    input: {
      ref,
      value: query,
      placeholder: PLACEHOLDER,
      readOnly: false,
      ...buildEditingRefProps(true),
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setQuery(event.currentTarget.value),
      onBlur: () => setEditing(false),
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
          event.preventDefault()
          reset()
        }
      },
    },
    buttonIconic,
  }
}
