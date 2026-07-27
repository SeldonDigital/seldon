import { useActiveBoard } from "@app/canvas/use-active-board"
import { useToolStore } from "@app/editor/tool-store"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { OutlineColors } from "@seldon/editor/lib/canvas/overlay/outline-colors"
import { overlayStore } from "@seldon/editor/lib/canvas/overlay/overlay-store"
import {
  type OverlayTracker,
  createOverlayTracker,
} from "@seldon/editor/lib/canvas/overlay/overlay-tracker"
import {
  bumpRemeasure,
  remeasureStore,
  setTransforming,
} from "@seldon/editor/lib/canvas/remeasure/remeasure-store"
import { type Ref, onScopeDispose, watch } from "vue"

import { useSharedStore } from "./use-shared-store"

/** Trailing delay after a pan/zoom stops before re-measuring (ms). */
const SETTLE_MS = 60

export interface CanvasOverlaysBinding {
  selectionRect: Ref<NodeRect | null>
  hoverRect: Ref<NodeRect | null>
  selectionColors: Ref<OutlineColors | null>
  hoverColors: Ref<OutlineColors | null>
}

/**
 * Vue binding for the shared canvas overlay tracker. Wires the current hover,
 * selection, workspace, tool, and pan/zoom transform into `createOverlayTracker`
 * and exposes the measured rects and resolved colors as reactive refs. Mirrors
 * the React `CanvasOverlayTracker` plus `CanvasTransformRemeasure`.
 */
export function useCanvasOverlays(
  subscribeTransform: (listener: () => void) => () => void,
): CanvasOverlaysBinding {
  const hover = useObjectHoverStore()
  const selection = useSelectionStore()
  const tool = useToolStore()
  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()

  const tracker: OverlayTracker = createOverlayTracker({
    getHovered: () => ({
      id: hover.hoveredId,
      kind: hover.hoveredKind,
      rootId: hover.hoveredRootId,
    }),
    getSelected: () => ({
      id:
        selection.selectedResourceItemKey ??
        selection.selectedNodeId ??
        selection.selectedResourceEntry?.id ??
        null,
      nodeId: selection.selectedNodeId,
      rootId: selection.selectedNodeRootId,
    }),
    getWorkspace: () => workspace.value,
    getActiveBoard: () => activeBoard.value,
    getActiveTool: () => tool.activeTool,
    subscribeTransform,
  })

  watch(
    () => [
      hover.hoveredId,
      hover.hoveredKind,
      selection.selectedNodeId,
      selection.selectedResourceEntry?.id ?? null,
      tool.activeTool,
      workspace.value,
      activeBoard.value,
    ],
    () => tracker.updateColors(),
  )

  watch(
    () => [
      hover.hoveredId,
      hover.hoveredKind,
      hover.hoveredRootId,
      selection.selectedNodeId,
      selection.selectedNodeRootId,
    ],
    () => tracker.refresh(),
  )

  // Re-measure once a reorder glide settles or a pan/zoom settle bumps.
  const remeasureVersion = useSharedStore(remeasureStore, (s) => s.version)
  const isTransforming = useSharedStore(remeasureStore, (s) => s.isTransforming)
  watch([remeasureVersion, isTransforming], () => tracker.refresh())

  // Hide the outlines while the canvas pans or zooms, then bump a re-measure at
  // the settled position, mirroring React `CanvasTransformRemeasure`.
  let timer: ReturnType<typeof setTimeout> | null = null
  let raf = 0
  const unsubscribeSettle = subscribeTransform(() => {
    setTransforming(true)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      bumpRemeasure()
      raf = requestAnimationFrame(() => setTransforming(false))
    }, SETTLE_MS)
  })

  onScopeDispose(() => {
    tracker.destroy()
    unsubscribeSettle()
    if (timer) clearTimeout(timer)
    cancelAnimationFrame(raf)
    setTransforming(false)
  })

  return {
    selectionRect: useSharedStore(overlayStore, (s) => s.selectionRect),
    hoverRect: useSharedStore(overlayStore, (s) => s.hoverRect),
    selectionColors: useSharedStore(
      overlayStore,
      (s) => s.selectionOutlineColors,
    ),
    hoverColors: useSharedStore(overlayStore, (s) => s.hoverOutlineColors),
  }
}
