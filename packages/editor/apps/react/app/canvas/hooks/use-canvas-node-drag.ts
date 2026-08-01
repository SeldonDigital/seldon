import { useDragStateStore } from "@app/canvas/hooks/use-drag-state"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useTool } from "@app/editor/hooks/use-tool"
import { useApplyMove } from "@app/workspace/hooks/use-apply-move"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getSelectionTarget } from "@app/workspace/selection-target"
import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import {
  getEditableControl,
  isEditableControlFocused,
} from "@seldon/editor/lib/canvas/dom/editable-control"
import { resolveCanvasPlacement } from "@seldon/editor/lib/canvas/drag/canvas-placement"
import { getSlotMoveTarget } from "@seldon/editor/lib/canvas/drag/drop-slot"
import { liftCanvasNode } from "@seldon/editor/lib/canvas/drag/node-lift"
import { resolveCanvasNodeSelection } from "@seldon/editor/lib/canvas/resolve-node-selection"
import { canDragToReorder } from "@seldon/editor/lib/commands/move-decisions"
import { isNoOpDrop, isValidDropTarget } from "@seldon/editor/lib/workspace/drop-validity"
import { useDragControls } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { isHotkeyPressed } from "react-hotkeys-hook"

import type { MoveRequest } from "@app/workspace/hooks/use-apply-move"
import type { Instance, InstanceId, Variant, VariantId, Workspace } from "@seldon/core"
import type { CanvasDropSlot } from "@seldon/editor/lib/canvas/drag/drop-slot"
import type { CanvasNodeLift } from "@seldon/editor/lib/canvas/drag/node-lift"

interface DragSubject {
  node: Variant | Instance
  rootId: string | null
  element: HTMLElement
  grabPoint: { x: number; y: number }
}

/**
 * Drag-to-reorder for canvas nodes, on the same rules as the objects sidebar.
 *
 * Framer owns the gesture. The press lands on a canvas node, which is not a
 * motion element, so it starts the drag through `dragControls` on an invisible
 * agent instead. Framer's own pan threshold decides when a press becomes a drag,
 * so a press that stays still falls through to the click that selects.
 *
 * The node is picked up and a copy of it follows the cursor, while the board keeps
 * the order it has. Nothing is laid out again until the drop, so the marks drawn
 * at the boundary are what says where the node will land, and the target does not
 * move while it is being aimed at.
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
  const applyMove = useApplyMove()
  const setIsDragging = useDragStateStore((state) => state.setIsDragging)

  const dragControls = useDragControls()
  const [dropSlot, setDropSlot] = useState<CanvasDropSlot | null>(null)

  const subject = useRef<DragSubject | null>(null)
  const lift = useRef<CanvasNodeLift | null>(null)
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

      // Found from the pressed element, so a node drawn on more than one board
      // picks up the copy under the cursor rather than the first one in the page.
      const nodeElement = element.closest<HTMLElement>(`[data-canvas-node-id="${resolved.id}"]`)

      if (!nodeElement) return

      subject.current = {
        node,
        rootId: resolved.rootId,
        element: nodeElement,
        grabPoint: { x: event.clientX, y: event.clientY },
      }
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
    lift.current = liftCanvasNode(dragging.element, dragging.grabPoint)
    setIsDragging(true)
  }, [selectNode, setIsDragging])

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      const dragging = subject.current

      if (!dragging) return

      const point = getClientPoint(event)

      if (!point) return

      lift.current?.move(point)

      const resolution = resolveCanvasPlacement(point, dragging.node, workspace)

      // The cursor left the canvas content, so there is nothing to aim at and
      // nothing to draw.
      if (resolution.kind === "away") {
        setDropSlot(null)
        request.current = null

        return
      }

      // Between the bands, so the drag keeps the slot it last found.
      if (resolution.kind === "hold") return

      const { slot } = resolution
      const duplicate = "altKey" in event && event.altKey
      const move = buildMoveRequest(slot, dragging.node, duplicate, workspace)

      // A slot that would not move anything keeps the last one, the same way a
      // dead zone does.
      if (!move) return

      setDropSlot((current) => (isSameSlot(current, slot) ? current : slot))
      request.current = move
    },
    [workspace],
  )

  /**
   * Drops the node. The copy is put away before the move is applied, so the board
   * is laid out again once, with the node already back to full strength and the
   * reorder animating from where it was.
   */
  const handleDragEnd = useCallback(() => {
    const move = request.current

    lift.current?.release()
    lift.current = null
    request.current = null
    subject.current = null
    document.body.style.userSelect = ""
    setDropSlot(null)
    setIsDragging(false)

    if (move) {
      applyMove(move, false)
    }
  }, [applyMove, setIsDragging])

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
    dropSlot,
    onDragStart: handleDragStart,
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  }
}

/**
 * The move a slot asks for, or nothing when it asks for no move at all.
 *
 * A slot is turned into the node it lands beside, which the same pair of rules the
 * sidebar dropzones use then judges: the move must be structurally valid and must
 * change the order. Alt-drag duplicates rather than moves, and a copy placed next
 * to the original is a real edit, so the no-op rule does not apply to it.
 */
function buildMoveRequest(
  slot: CanvasDropSlot,
  subject: Variant | Instance,
  duplicate: boolean,
  workspace: Workspace,
): MoveRequest | null {
  const moveTarget = getSlotMoveTarget(slot, workspace)

  if (!moveTarget) return null

  const targetNode = workspace.nodes[moveTarget.targetId] as Variant | Instance | undefined

  if (!targetNode) return null
  if (!isValidDropTarget(targetNode, subject, moveTarget.placement, workspace)) return null
  if (!duplicate && isNoOpDrop(targetNode, subject, moveTarget.placement, workspace)) return null

  return {
    targetNode,
    subjectNode: subject,
    placement: moveTarget.placement,
    duplicate,
  }
}

function isSameSlot(left: CanvasDropSlot | null, right: CanvasDropSlot): boolean {
  if (!left) return false

  return (
    left.containerId === right.containerId &&
    left.containerType === right.containerType &&
    left.boundaryChildId === right.boundaryChildId &&
    left.placement === right.placement
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
