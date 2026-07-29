import { computed } from "vue"
import { useRoute } from "vue-router"

import type { ComputedRef } from "vue"

/**
 * The open workspace's id, taken from the route. Null outside an editor route,
 * such as the home list. Mirrors the React `useWorkspaceId`.
 */
export function useWorkspaceId(): ComputedRef<string | null> {
  const route = useRoute()

  return computed(() => {
    const id = route.params.id

    return typeof id === "string" && id.length > 0 ? id : null
  })
}
