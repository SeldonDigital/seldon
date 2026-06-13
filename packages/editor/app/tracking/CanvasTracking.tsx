"use client"

import { useSelectedNodeId } from "@lib/workspace/hooks/use-selection"
import { useHasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useDragStateStore } from "@lib/hooks/use-drag-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useCanvasRemeasureStore } from "../canvas/hooks/use-canvas-remeasure-store"
import { useNodeBelongsToActiveBoard } from "./hooks/use-belongs-to-active-board"
import { useTrackNodeRects } from "./hooks/use-track-node-rects"
import { useVisibleNodes } from "./hooks/use-visible-nodes"
import { InsertTracking } from "./canvas-indicators/insert/Tracking"
import {
  CanvasHoverOutline,
  CanvasSelectionOutline,
} from "./canvas-indicators/select/SelectionOverlays"
import { SelectTracking } from "./canvas-indicators/select/Tracking"

export function CanvasTracking() {
  const selectedNodeId = useSelectedNodeId()
  const { activeTool } = useTool()
  const { isInPreviewMode } = usePreview()
  const { visibleNodes } = useVisibleNodes()
  const hasHoverState = useHasHoverState()
  const nodeIds = visibleNodes.map((node) => node.id)
  const { showSelection, wireframeMode } = useEditorConfig()
  const nodeBelongsToActiveBoard = useNodeBelongsToActiveBoard()
  const isDragging = useDragStateStore((state) => state.isDragging)
  const isTransforming = useCanvasRemeasureStore(
    (state) => state.isTransforming,
  )

  // The insert component tool suppresses auto wireframes so the accent hover
  // box reads cleanly. Explicit wireframe mode still wins, and leaving the tool
  // restores normal auto behavior without touching persisted state.
  const showWireframes = wireframeMode === "on"

  useTrackNodeRects(nodeIds)

  if (isInPreviewMode) return null

  return (
    <>
      {activeTool === "select" &&
        showWireframes &&
        !isTransforming &&
        visibleNodes.map((node) => {
          if (!nodeBelongsToActiveBoard(node.id)) return null

          return (
            <SelectTracking
              key={node.id}
              nodeId={node.id}
              isSelected={selectedNodeId === node.id}
            />
          )
        })}
      {showSelection && activeTool === "select" && !isDragging && (
        <CanvasSelectionOutline wireframe={showWireframes} />
      )}
      {showSelection && activeTool === "select" && (
        <CanvasHoverOutline wireframe={showWireframes} />
      )}
      {activeTool === "component" && <CanvasHoverOutline />}
      {activeTool === "component" && hasHoverState && <InsertTracking />}
    </>
  )
}
