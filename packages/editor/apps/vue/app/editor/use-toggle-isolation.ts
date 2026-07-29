import { useActiveBoard } from "@app/canvas/use-active-board"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useSelection } from "@app/workspace/use-selection"
import { resolveIsolationRootId } from "@seldon/editor/lib/isolation/resolve-isolation-root-id"
import { computed } from "vue"

import type { ComputedRef } from "vue"

/**
 * Toggles isolation mode. Enabling isolates the variant the selection sits in,
 * from the variant root itself or from anything nested inside it, and captures
 * its board as the frozen anchor; disabling clears it. `canToggleIsolation`
 * stays true while isolation is on so it can always be turned off. Shared by
 * the Edit menu and the keyboard shortcut. Mirrors the React
 * `useToggleIsolation`.
 */
export function useToggleIsolation(): {
  toggleIsolation: () => void
  canToggleIsolation: ComputedRef<boolean>
} {
  const config = useEditorConfigStore()
  const { activeBoard, activeBoardKey } = useActiveBoard()
  const { selectedNodeId, selectedNodeRootId } = useSelection()

  const isolationRootId = computed<string | null>(() =>
    resolveIsolationRootId(selectedNodeId.value, selectedNodeRootId.value, activeBoard.value),
  )
  const canToggleIsolation = computed(() => config.isolatedView || isolationRootId.value != null)

  function toggleIsolation(): void {
    if (config.isolatedView) {
      config.disableIsolation()

      return
    }

    const variantRootId = isolationRootId.value
    const key = activeBoardKey.value

    if (!variantRootId || !key) return
    config.enableIsolation(key, variantRootId)
  }

  return { toggleIsolation, canToggleIsolation }
}
