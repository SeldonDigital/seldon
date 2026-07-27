import { useActiveBoard } from "@app/canvas/use-active-board"
import { remeasureStore } from "@seldon/editor/lib/canvas/remeasure/remeasure-store"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { createNodeRectsTracker } from "@seldon/editor/lib/canvas/tracking/node-rects-tracker"
import { getVisibleNodeIds } from "@seldon/editor/lib/canvas/tracking/visible-nodes"
import { computed, onScopeDispose, watch } from "vue"

import { useSharedStore } from "./use-shared-store"

import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { Ref } from "vue"

/** The tracked rect of a single node, relative to the canvas, or null. */
export function useNodeRect(nodeId: string): Ref<NodeRect | null> {
  return useSharedStore(nodeRectsStore, (state) => state.rects[nodeId] ?? null)
}

/**
 * Tracks the position and size of every node in the active board, mirroring the
 * React `useTrackNodeRects`. Re-tracks when the visible node set changes and
 * when a reorder glide settles.
 */
export function useTrackedVisibleNodes(): { visibleNodeIds: Ref<string[]> } {
  const { activeBoard } = useActiveBoard()
  const remeasureVersion = useSharedStore(remeasureStore, (s) => s.version)

  const visibleNodeIds = computed<string[]>(() =>
    activeBoard.value ? getVisibleNodeIds(activeBoard.value) : [],
  )

  let cleanup: (() => void) | null = null

  watch(
    [visibleNodeIds, remeasureVersion],
    ([ids]) => {
      cleanup?.()
      cleanup = createNodeRectsTracker(ids)
    },
    { immediate: true },
  )

  onScopeDispose(() => cleanup?.())

  return { visibleNodeIds }
}
