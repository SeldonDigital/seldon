import { onBeforeUnmount, onMounted, watch } from "vue"
import { useDirtyStore } from "@lib/stores/dirty-store"
import { useHistoryStore } from "@lib/stores/history-store"
import { useWorkspaceSaveStore } from "@lib/stores/workspace-save-store"

/** Debounce window before a committed edit is persisted, matching React. */
const AUTOSAVE_DELAY_MS = 1000

/**
 * Debounced and unload-time persistence for the local workspace. Watches the
 * committed workspace and, while dirty, routes writes through the save store's
 * single `saveNow` writer after a short debounce. Flushes any pending edit on
 * unload. Mirrors the React `useWorkspaceAutosave`.
 */
export function useWorkspaceAutosave(): void {
  const save = useWorkspaceSaveStore()
  const history = useHistoryStore()
  const dirty = useDirtyStore()

  let timer: ReturnType<typeof setTimeout> | undefined

  const stop = watch(
    () => history.current,
    (workspace) => {
      if (!dirty.isDirty || !workspace) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void save.saveNow(workspace)
      }, AUTOSAVE_DELAY_MS)
    },
  )

  function flush(): void {
    if (dirty.isDirty && history.current) {
      void save.saveNow(history.current)
    }
  }

  onMounted(() => window.addEventListener("beforeunload", flush))
  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", flush)
    if (timer) clearTimeout(timer)
    stop()
  })
}
