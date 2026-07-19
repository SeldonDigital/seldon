import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue"
import {
  buildDisplayInputProps,
  buildEditingRefProps,
} from "@app/sidebars/state-props"

interface UseRenameInputOptions {
  label: MaybeRefOrGetter<string>
  /** Seed value for edit mode. Defaults to `label` (e.g. edit the raw name while a code name shows). */
  editLabel?: MaybeRefOrGetter<string>
  isEditing: MaybeRefOrGetter<boolean>
  setEditing: (editing: boolean) => void
  onSubmit: (value: string) => void
}

/**
 * Drives a sidebar row name as the generated `input` slot. In display mode it
 * shows the label read-only and inert so row selection and drag pass through. In
 * edit mode it becomes a controlled input: Enter commits, Escape cancels, blur
 * commits. Mirrors the React `useRenameInput`; focus/select on entering edit
 * mode is handled by the row via a DOM query, since the input is nested inside
 * generated chrome.
 */
export function useRenameInput(options: UseRenameInputOptions) {
  const value = ref(toValue(options.label))

  watch(
    () => toValue(options.isEditing),
    (editing) => {
      if (editing) {
        value.value = toValue(options.editLabel) ?? toValue(options.label)
      }
    },
  )

  function commit(): void {
    options.onSubmit(value.value.trim())
  }

  function cancel(): void {
    value.value = toValue(options.editLabel) ?? toValue(options.label)
    options.setEditing(false)
  }

  const inputProps = computed<Record<string, unknown>>(() => {
    if (!toValue(options.isEditing)) {
      return buildDisplayInputProps(toValue(options.label))
    }
    return {
      value: value.value,
      readonly: false,
      ...buildEditingRefProps(true),
      onInput: (event: Event) => {
        value.value = (event.target as HTMLInputElement).value
      },
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit()
        } else if (event.key === "Escape") {
          event.preventDefault()
          cancel()
        }
      },
      onBlur: commit,
    }
  })

  return { inputProps, value, cancel }
}
