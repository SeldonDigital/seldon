import { useActiveBoard } from "@app/canvas/use-active-board"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useSelection } from "@app/workspace/use-selection"
import { type ComputedRef, computed } from "vue"

import { isEntryNodeInstance } from "@seldon/core/workspace/model"

/**
 * Toggles isolation mode. Enabling requires a default or custom variant to be
 * selected and captures its board as the frozen anchor; disabling clears it.
 * `canToggleIsolation` stays true while isolation is on so it can always be
 * turned off. Shared by the Edit menu and the keyboard shortcut. Mirrors the
 * React `useToggleIsolation`.
 */
export function useToggleIsolation(): {
  toggleIsolation: () => void
  canToggleIsolation: ComputedRef<boolean>
} {
  const config = useEditorConfigStore()
  const { activeBoardKey } = useActiveBoard()
  const { selectedNode } = useSelection()

  const selectedVariantRootId = computed<string | null>(() =>
    selectedNode.value != null && !isEntryNodeInstance(selectedNode.value)
      ? selectedNode.value.id
      : null,
  )
  const canToggleIsolation = computed(
    () => config.isolatedView || selectedVariantRootId.value != null,
  )

  function toggleIsolation(): void {
    if (config.isolatedView) {
      config.disableIsolation()
      return
    }
    const variantRootId = selectedVariantRootId.value
    const key = activeBoardKey.value
    if (!variantRootId || !key) return
    config.enableIsolation(key, variantRootId)
  }

  return { toggleIsolation, canToggleIsolation }
}
