"use client"

import { useCanvasNodeDrag } from "@app/canvas/hooks/use-canvas-node-drag"

import { CanvasDragAgent } from "./CanvasDragAgent.bespoke"
import { CanvasDropIndicator } from "./CanvasDropIndicator"

/**
 * Canvas drag-to-reorder: the drag agent that hosts the gesture, plus the
 * indicator for where the drop would land.
 */
export function CanvasDragLayer() {
  const { dragControls, dropTarget, onDragStart, onDrag, onDragEnd } = useCanvasNodeDrag()

  const indicator = dropTarget ? <CanvasDropIndicator dropTarget={dropTarget} /> : null

  return (
    <>
      <CanvasDragAgent
        controls={dragControls}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />
      {indicator}
    </>
  )
}
