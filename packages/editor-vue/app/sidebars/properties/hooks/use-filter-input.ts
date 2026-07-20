import {
  buildDisplayInputProps,
  buildEditingRefProps,
} from "@app/sidebars/state-props"
import { computed, nextTick, ref } from "vue"

const PLACEHOLDER = "Filter..."

/**
 * Drives the properties-sidebar filter field. Mirrors the property-value row:
 * the resting input is an inert read-only display so a single click lands on the
 * combobox field and flips it into edit mode, where the input becomes a live
 * text box. Typing updates `query` for live filtering; clearing the text,
 * pressing Escape, or clicking the X resets. Vue port of the React
 * `useFilterInput`.
 */
export function useFilterInput() {
  const query = ref("")
  const isEditing = ref(false)
  const inputEl = ref<HTMLInputElement | null>(null)

  function enterEdit(): void {
    isEditing.value = true
    void nextTick(() => inputEl.value?.focus())
  }

  function reset(): void {
    query.value = ""
    isEditing.value = false
  }

  const comboboxField = computed(() => ({ onClick: enterEdit }))

  const buttonIconic = computed(() =>
    query.value
      ? {
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            reset()
          },
        }
      : null,
  )

  const input = computed<Record<string, unknown>>(() => {
    if (!isEditing.value) {
      return {
        ...buildDisplayInputProps(query.value),
        placeholder: PLACEHOLDER,
      }
    }
    return {
      ref: (el: unknown) => (inputEl.value = el as HTMLInputElement | null),
      value: query.value,
      placeholder: PLACEHOLDER,
      readonly: false,
      ...buildEditingRefProps(true),
      onInput: (event: Event) =>
        (query.value = (event.target as HTMLInputElement).value),
      onBlur: () => (isEditing.value = false),
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault()
          reset()
        }
      },
    }
  })

  return { query, comboboxField, input, buttonIconic }
}
