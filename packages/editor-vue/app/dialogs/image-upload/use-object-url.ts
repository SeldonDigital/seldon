import { type Ref, onUnmounted, ref, watch } from "vue"

/**
 * Reactive object URL for a file, revoked when the file changes or the owner
 * unmounts. Vue port of the React `useObjectURL`.
 */
export function useObjectURL(file: Ref<File | null>): Ref<string | null> {
  const objectURL = ref<string | null>(null)
  let current: string | null = null

  function revoke(): void {
    if (current) {
      URL.revokeObjectURL(current)
      current = null
    }
  }

  watch(
    file,
    (next) => {
      revoke()
      if (!next) {
        objectURL.value = null
        return
      }
      current = URL.createObjectURL(next)
      objectURL.value = current
    },
    { immediate: true },
  )

  onUnmounted(revoke)

  return objectURL
}
