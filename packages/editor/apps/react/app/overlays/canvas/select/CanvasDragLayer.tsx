"use client"

import { useCanvasNodeDrag } from "@app/canvas/hooks/use-canvas-node-drag"

import { CanvasDropFeedback } from "../drop/CanvasDropFeedback"
import { CanvasDragAgent } from "./CanvasDragAgent.bespoke"

/**
 * Canvas drag-to-reorder: the agent that hosts the gesture, plus the drop
 * feedback for where it would land, drawn the same way the insert tool draws it.
 * The node picked up by the drag follows the cursor as a clone in the board, so it
 * is not drawn here.
 */
export function CanvasDragLayer() {
  const { dragControls, dropSlot, onDragStart, onDrag, onDragEnd } = useCanvasNodeDrag()

  const feedback = dropSlot ? <CanvasDropFeedback slot={dropSlot} /> : null

  return (
    <>
      <CanvasDragAgent
        controls={dragControls}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
      {feedback}
    </>
  )
}
