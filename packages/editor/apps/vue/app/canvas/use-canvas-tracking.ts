import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useToastStore } from "@app/toaster/toast-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { canNodeAcceptChildren } from "@seldon/editor/lib/workspace/can-node-accept-children"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@seldon/editor/lib/workspace/selection-dom"

import type { InstanceId, VariantId } from "@seldon/core/workspace/types"

/**
 * Canvas pointer tracking: resolves the selection target from the DOM through
 * the shared `getSelectionTarget`, so clicking or hovering a canvas element
 * selects/highlights the same object a sidebar row would. Mirrors the React
 * `CanvasTracking` selection and hover behavior. When the component tool is
 * active, clicking a node that accepts children opens the insert panel targeted
 * at the end of that node's child list; clicking anywhere else cancels the tool.
 */
export function useCanvasTracking() {
  const selection = useSelectionStore()
  const hover = useObjectHoverStore()
  const tool = useToolStore()
  const panel = usePanelStore()
  const toast = useToastStore()

  function insertIntoNode(nodeId: string): void {
    const workspace = getCurrentWorkspace()
    const node = workspace.nodes[nodeId as InstanceId | VariantId]
    if (!node) {
      tool.setActiveTool("select")
      return
    }
    if (!canNodeAcceptChildren(node, workspace)) {
      toast.addToast("This component can't accept children")
      tool.setActiveTool("select")
      return
    }
    const index = getNodeChildIds(node, workspace).length
    panel.openPanel("component", {
      nodeId: node.id as VariantId | InstanceId,
      index,
    })
  }

  function onCanvasClick(event: MouseEvent): void {
    const target = getSelectionTarget(event.target as Element | null)

    if (tool.activeTool === "component") {
      // Component tool: only nodes are valid insertion parents. Any other hit
      // (a board surface or empty canvas) cancels the tool, matching React.
      if (target && target.kind === "node") {
        insertIntoNode(target.id)
      } else {
        tool.setActiveTool("select")
      }
      return
    }

    // Clicking empty canvas keeps the current selection, matching the React
    // canvas, so only act when a selectable element was hit.
    if (!target) return
    selectFromTarget(target, {
      selectNode: selection.selectNode,
      selectBoard: selection.selectBoard,
      selectResourceEntry: selection.selectResourceEntry,
      selectResourceItem: selection.selectResourceItem,
    })
  }

  function onCanvasPointerMove(event: PointerEvent): void {
    const target = getSelectionTarget(event.target as Element | null)
    if (!target || target.kind !== "node") {
      hover.setHoveredId(null)
      return
    }
    hover.setHoveredId(target.id, "node", target.rootId ?? null)
  }

  function onCanvasPointerLeave(): void {
    hover.setHoveredId(null)
  }

  return { onCanvasClick, onCanvasPointerMove, onCanvasPointerLeave }
}
