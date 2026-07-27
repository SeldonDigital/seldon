import { computed } from "vue"
import { useRoute } from "vue-router"

import type { ComputedRef } from "vue"

/** Which top-level screen the app shows. Drives `visibleIn` menu filtering. */
export type AppState = "project" | "edit"

/**
 * The current app screen, derived from the route. The project page is
 * `project`, and any other workspace route is `edit`. Mirrors the React
 * `useAppState`.
 */
export function useAppState(): { appState: ComputedRef<AppState> } {
  const route = useRoute()

  const appState = computed<AppState>(() => (route.path === "/" ? "project" : "edit"))

  return { appState }
}
