import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useToastStore } from "@app/toaster/toast-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import {
  getEditableControl,
  isEditableControlFocused,
  isEditableControlNodeSelected,
} from "@seldon/editor/lib/canvas/dom/editable-control"
import { resolveCanvasNodeSelection } from "@seldon/editor/lib/canvas/resolve-node-selection"
import { canNodeAcceptChildren } from "@seldon/editor/lib/workspace/can-node-accept-children"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { getSelectionTarget, selectFromTarget } from "@seldon/editor/lib/workspace/selection-dom"

import type { InstanceId, VariantId } from "@seldon/core/workspace/types"

/**
 * Delay before a single click commits its selection. A double click cancels the
 * pending single click within this window, so the two gestures stay distinct and
 * repeated double clicks can drill without a single click resetting to the root.
 */
const SINGLE_CLICK_DELAY_MS = 200

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
  const config = useEditorConfigStore()

  // Pending deferred single-click selection. A double click clears it so the
  // single click never fires, letting the two gestures drive different behavior.
  let pendingSelect: ReturnType<typeof setTimeout> | null = null

  function clearPendingSelect(): void {
    if (pendingSelect !== null) {
      clearTimeout(pendingSelect)
      pendingSelect = null
    }
  }

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

    // While an input is being edited, clicks inside it stay native (caret
    // placement, text selection) and must not change the canvas selection.
    const editing = getEditableControl(event.target as Element | null)

    if (editing && isEditableControlFocused(editing)) {
      return
    }

    clearPendingSelect()

    // Clicking empty canvas keeps the current selection, matching the React
    // canvas, so only act when a selectable element was hit.
    if (!target) return

    // Boards and resource entries carry no node tree, so they select directly
    // through the shared typed setters.
    if (target.kind !== "node") {
      selectFromTarget(target, {
        selectNode: selection.selectNode,
        selectBoard: selection.selectBoard,
        selectResourceEntry: selection.selectResourceEntry,
        selectResourceItem: selection.selectResourceItem,
      })

      return
    }

    const clickedRootId = target.rootId ?? target.id

    // Direct select mode selects the exact node on a plain click, as if cmd/ctrl
    // were held, restoring the pre-drill selection behavior.
    if (event.metaKey || event.ctrlKey || config.directSelect) {
      const exact = resolveCanvasNodeSelection(clickedRootId, selection.selectedNodeRootId, "exact")

      selection.selectNode(exact.id as VariantId | InstanceId, exact.rootId)
      // Sync hover to the selection so the coincident hover outline is
      // suppressed instead of leaving a stale second dashed border.
      hover.setHoveredId(exact.id, "node", exact.rootId)

      return
    }

    // Defer the top-most selection so a double click can cancel it and drill
    // instead. The current selection is captured now for the drill baseline.
    const currentRootId = selection.selectedNodeRootId

    pendingSelect = setTimeout(() => {
      pendingSelect = null
      const root = resolveCanvasNodeSelection(clickedRootId, currentRootId, "root")

      selection.selectNode(root.id as VariantId | InstanceId, root.rootId)
      hover.setHoveredId(root.id, "node", root.rootId)
    }, SINGLE_CLICK_DELAY_MS)
  }

  function onCanvasMouseDown(event: MouseEvent): void {
    const control = getEditableControl(event.target as Element | null)

    if (!control) return

    if (isEditableControlFocused(control)) return

    const enteringEdit =
      tool.activeTool === "select" &&
      event.detail >= 2 &&
      isEditableControlNodeSelected(control, selection.selectedNodeId, selection.selectedNodeRootId)

    if (enteringEdit) return

    // Block native focus, caret, and the text cursor so the click selects the
    // node instead. Editing is granted only by the guards above.
    event.preventDefault()
  }

  function onCanvasDblClick(event: MouseEvent): void {
    if (tool.activeTool !== "select") return
    if (event.metaKey || event.ctrlKey) return

    // Double clicking a selected input enters edit instead of drilling. The
    // focus was granted on mousedown; here we only cancel the pending single
    // click so the selection stays on the input being edited.
    const control = getEditableControl(event.target as Element | null)

    if (
      control &&
      (isEditableControlFocused(control) ||
        isEditableControlNodeSelected(
          control,
          selection.selectedNodeId,
          selection.selectedNodeRootId,
        ))
    ) {
      clearPendingSelect()

      return
    }

    // Direct select mode selects the exact node on every click, so a double
    // click has nothing deeper to drill into.
    if (config.directSelect) return

    const target = getSelectionTarget(event.target as Element | null)

    if (!target || target.kind !== "node") return

    clearPendingSelect()
    const clickedRootId = target.rootId ?? target.id
    const drilled = resolveCanvasNodeSelection(clickedRootId, selection.selectedNodeRootId, "drill")

    selection.selectNode(drilled.id as VariantId | InstanceId, drilled.rootId)
    // Sync hover to the drilled node. The mouse is stationary during a double
    // click, so without this the hover outline stays on the previous node and
    // draws a second dashed border next to the new selection.
    hover.setHoveredId(drilled.id, "node", drilled.rootId)
  }

  function onCanvasPointerMove(event: PointerEvent): void {
    const target = getSelectionTarget(event.target as Element | null)

    if (!target || target.kind !== "node") {
      hover.setHoveredId(null)

      return
    }

    // Component tool keeps the exact node for insertion. The select tool previews
    // what a click will select: the top-most node on a plain hover, or the exact
    // node under the cursor while cmd/ctrl is held.
    if (tool.activeTool !== "select") {
      hover.setHoveredId(target.id, "node", target.rootId ?? null)

      return
    }

    const mode = event.metaKey || event.ctrlKey || config.directSelect ? "exact" : "root"
    const preview = resolveCanvasNodeSelection(
      target.rootId ?? target.id,
      selection.selectedNodeRootId,
      mode,
    )

    hover.setHoveredId(preview.id, "node", preview.rootId)
  }

  function onCanvasPointerLeave(): void {
    hover.setHoveredId(null)
  }

  return {
    onCanvasClick,
    onCanvasDblClick,
    onCanvasMouseDown,
    onCanvasPointerMove,
    onCanvasPointerLeave,
  }
}
