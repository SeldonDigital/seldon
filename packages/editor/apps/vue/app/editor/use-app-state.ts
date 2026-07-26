import { usePreviewModeStore } from "@app/editor/preview-mode-store"
import { storeToRefs } from "pinia"
import { type ComputedRef, computed } from "vue"
import { useRoute } from "vue-router"

/** Which top-level screen the app shows. Drives `visibleIn` menu filtering. */
export type AppState = "project" | "edit" | "preview"

/**
 * The current app screen, derived from the route and device-preview state.
 * The project page is `project`, an active device preview is `preview`, and any
 * other workspace route is `edit`. Mirrors the React `useAppState`.
 */
export function useAppState(): { appState: ComputedRef<AppState> } {
  const route = useRoute()
  const { isInPreviewMode } = storeToRefs(usePreviewModeStore())

  const appState = computed<AppState>(() => {
    if (route.path === "/") return "project"
    if (isInPreviewMode.value) return "preview"
    return "edit"
  })

  return { appState }
}
