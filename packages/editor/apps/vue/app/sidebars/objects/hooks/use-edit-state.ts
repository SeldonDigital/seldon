import {
  type MaybeRefOrGetter,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
} from "vue"

/**
 * Inline-rename edit state for an objects-sidebar row. Mirrors the React
 * `useEditState`: a `mod+r` shortcut enters edit mode, gated so only the
 * selected, not-already-editing row listens. The window listener is attached
 * only while the row is selected, so the tree never mounts one listener per row.
 */
export function useEditState(isSelected: MaybeRefOrGetter<boolean>) {
  const isEditingName = ref(false)

  function setEditingName(value: boolean): void {
    isEditingName.value = value
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!(event.metaKey || event.ctrlKey)) return
    if (event.key.toLowerCase() !== "r") return
    if (!toValue(isSelected) || isEditingName.value) return
    event.preventDefault()
    isEditingName.value = true
  }

  watch(
    () => toValue(isSelected),
    (selected) => {
      if (selected) window.addEventListener("keydown", onKeydown)
      else window.removeEventListener("keydown", onKeydown)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown))

  return { isEditingName, setEditingName }
}
