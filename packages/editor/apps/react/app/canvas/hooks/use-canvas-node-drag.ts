import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useTool } from "@app/editor/hooks/use-tool"
import { useMovePreviewSession } from "@app/workspace/hooks/use-move-preview-session"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getSelectionTarget } from "@app/workspace/selection-target"
import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import {
  getEditableControl,
  isEditableControlFocused,
} from "@seldon/editor/lib/canvas/dom/editable-control"
import {
  isPointOverNode,
  resolveCanvasPlacement,
} from "@seldon/editor/lib/canvas/drag/canvas-placement"
import { resolveCanvasNodeSelection } from "@seldon/editor/lib/canvas/resolve-node-selection"
import { canDragToReorder } from "@seldon/editor/lib/commands/move-decisions"
import { isNoOpDrop, isValidDropTarget } from "@seldon/editor/lib/workspace/drop-validity"
import { useDragControls } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { isHotkeyPressed } from "react-hotkeys-hook"

import type { MoveRequest } from "@app/workspace/hooks/use-move-preview-session"
import type { Instance, InstanceId, Variant, VariantId, Workspace } from "@seldon/core"
import type { CanvasDropTarget } from "@seldon/editor/lib/canvas/drag/canvas-placement"

interface DragSubject {
  node: Variant | Instance
  rootId: string | null
}

/**
 * Drag-to-reorder for canvas nodes, on the same rules and the same preview as the
 * objects sidebar.
 *
 * Framer owns the gesture. The press lands on a canvas node, which is not a
 * motion element, so it starts the drag through `dragControls` on an invisible
 * agent instead. Framer's own pan threshold decides when a press becomes a drag,
 * so a press that stays still falls through to the click that selects.
 *
 * The pointer is listened for on the canvas element rather than taken as a prop,
 * so the gesture lives here in full instead of being threaded through the canvas
 * tree. The click that follows a real drag is swallowed for the same reason: the
 * drag already chose what happens, and the selection was made when it started.
 */
export function useCanvasNodeDrag() {
  const { workspace } = useWorkspace({ usePreview: false })
  const { selectNode, selectedNodeRootId } = useSelection()
  const { activeTool } = useTool()
  const { directSelect } = useEditorConfig()
  const { begin, target, finish } = useMovePreviewSession()

  const dragControls = useDragControls()
  const [dropTarget, setDropTarget] = useState<CanvasDropTarget | null>(null)

  const subject = useRef<DragSubject | null>(null)
  const request = useRef<MoveRequest | null>(null)
  const dragged = useRef(false)

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      dragged.current = false

      if (activeTool !== "select") return
      if (event.button !== 0 || !event.isPrimary) return
      // Space is the pan key, and a pan starts on the same press.
      if (isHotkeyPressed("space")) return

      const element = event.target as Element | null

      if (!element) return

      const control = getEditableControl(element)

      if (control && isEditableControlFocused(control)) return

      const selectionTarget = getSelectionTarget(element)

      if (!selectionTarget || selectionTarget.kind !== "node") return

      // Grab what a click would select: the top-most node of the pressed tree, or
      // the exact node under the cursor while cmd or ctrl is held.
      const pressedRootId = selectionTarget.rootId ?? selectionTarget.id
      const exact = event.metaKey || event.ctrlKey || directSelect
      const resolved = resolveCanvasNodeSelection(
        pressedRootId,
        selectedNodeRootId,
        exact ? "exact" : "root",
      )
      const node = workspace.nodes[resolved.id] as Variant | Instance | undefined

      if (!node || !canDragToReorder(workspace, node)) return

      subject.current = { node, rootId: resolved.rootId }
      dragControls.start(event)
    },
    [activeTool, directSelect, selectedNodeRootId, workspace, dragControls],
  )

  const handleDragStart = useCallback(() => {
    const dragging = subject.current

    if (!dragging) return

    dragged.current = true
    // Dragging a node makes it the selection, so what moves is what is selected
    // once the drag ends. The suppressed click would have done this.
    selectNode(dragging.node.id as VariantId | InstanceId, dragging.rootId)
    document.body.style.userSelect = "none"
    begin()
  }, [selectNode, begin])

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      const dragging = subject.current

      if (!dragging) return

      const point = getClientPoint(event)

      if (!point) return

      // The node the cursor is over is the node it just moved, so the slot it
      // points at is the slot already chosen. Hold it, rather than reading the
      // node's own box as no slot and rolling the preview back under the cursor.
      if (isPointOverNode(point, dragging.node.id)) return

      const resolved = resolveCanvasPlacement(point, dragging.node, workspace)
      const duplicate = "altKey" in event && event.altKey

      if (!resolved || !isDroppable(resolved, dragging.node, duplicate, workspace)) {
        setDropTarget(null)
        request.current = null
        target(null)

        return
      }

      setDropTarget((current) => (isSameTarget(current, resolved) ? current : resolved))
      request.current = {
        targetNode: resolved.target,
        subjectNode: dragging.node,
        placement: resolved.placement,
        duplicate,
      }
      target(request.current)
    },
    [workspace, target],
  )

  const handleDragEnd = useCallback(() => {
    finish(request.current)
    request.current = null
    subject.current = null
    document.body.style.userSelect = ""
    setDropTarget(null)
  }, [finish])

  useEffect(() => {
    const canvas = getCanvasElement()

    if (!canvas) return

    canvas.addEventListener("pointerdown", handlePointerDown)

    return () => canvas.removeEventListener("pointerdown", handlePointerDown)
  }, [handlePointerDown])

  useEffect(() => {
    const canvas = getCanvasElement()

    if (!canvas) return

    // Capture, so the click never reaches the canvas handlers that would select
    // whatever the drag happened to end over.
    const swallowClick = (event: MouseEvent) => {
      if (!dragged.current) return

      dragged.current = false
      event.stopPropagation()
      event.preventDefault()
    }

    canvas.addEventListener("click", swallowClick, true)

    return () => canvas.removeEventListener("click", swallowClick, true)
  }, [])

  return {
    dragControls,
    dropTarget,
    onDragStart: handleDragStart,
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  }
}

/**
 * A drop is offered when it is structurally valid and would change the order.
 * Alt-drag duplicates instead of moving, and a copy placed next to the original
 * is a real edit, so the no-op rule does not apply to it. Same pair of rules the
 * sidebar dropzones use.
 */
function isDroppable(
  resolved: CanvasDropTarget,
  subject: Variant | Instance,
  duplicate: boolean,
  workspace: Workspace,
): boolean {
  if (!isValidDropTarget(resolved.target, subject, resolved.placement, workspace)) return false

  return duplicate || !isNoOpDrop(resolved.target, subject, resolved.placement, workspace)
}

function isSameTarget(left: CanvasDropTarget | null, right: CanvasDropTarget): boolean {
  if (!left) return false

  return (
    left.target.id === right.target.id &&
    left.placement === right.placement &&
    left.element === right.element
  )
}

function getClientPoint(
  event: MouseEvent | TouchEvent | PointerEvent,
): { x: number; y: number } | null {
  if ("clientX" in event) {
    return { x: event.clientX, y: event.clientY }
  }

  const touch = event.touches[0] ?? event.changedTouches[0]

  return touch ? { x: touch.clientX, y: touch.clientY } : null
}
