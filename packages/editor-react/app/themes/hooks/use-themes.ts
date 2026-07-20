import {
  getCurrentWorkspace,
  useHistoryStore,
} from "@app/workspace/hooks/use-history"
import { usePreviewStore } from "@app/workspace/hooks/use-preview-store"
import { useMemo } from "react"

import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

/**
 * Computed themes for the active workspace. Subscribes only to the `themes`
 * slice (committed and preview), so property and structural edits that leave
 * themes untouched do not re-render theme consumers. `getThemes` is memoized by
 * the themes reference, so recomputation only happens when themes change.
 */
export function useThemes() {
  const committedThemes = useHistoryStore(
    (state) => state.history[state.currentIndex].themes,
  )
  const previewThemes = usePreviewStore((state) => state.preview?.themes)

  return useMemo(() => {
    const workspace =
      usePreviewStore.getState().preview ?? getCurrentWorkspace()
    return workspaceThemeService.getThemes(workspace)
  }, [committedThemes, previewThemes])
}
