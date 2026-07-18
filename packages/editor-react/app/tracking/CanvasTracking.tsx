"use client"

import { isThemeBoard } from "@seldon/core/workspace/model/components"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@lib/workspace/hooks/use-selection"
import {
  useCanvasHoverState,
  useHasHoverState,
} from "@lib/hooks/use-canvas-hover-state"
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
  const { hoverState } = useCanvasHoverState()
  const nodeIds = visibleNodes.map((node) => node.id)
  const { showSelection, wireframeMode } = useEditorConfig()
  const nodeBelongsToActiveBoard = useNodeBelongsToActiveBoard()
  const { activeBoard } = useActiveBoard()
  const isDragging = useDragStateStore((state) => state.isDragging)
  const isTransforming = useCanvasRemeasureStore(
    (state) => state.isTransforming,
  )

  // The insert component tool suppresses auto wireframes so the accent hover
  // box reads cleanly. Explicit wireframe mode still wins, and leaving the tool
  // restores normal auto behavior without touching persisted state.
  const showWireframes = wireframeMode === "on"

  // Theme boards are previews, not an editable node tree, so they show no
  // selection or hover outline on the canvas.
  const activeBoardIsTheme = activeBoard ? isThemeBoard(activeBoard) : false

  // A between-siblings gap is highlighted by the paired sibling outlines
  // (InsertGapSiblings), so the single full-node hover box is suppressed to
  // avoid a redundant box over one of the siblings. Insert-into-node hovers
  // (no boundary child) keep the full-node accent box.
  const isSiblingGap =
    activeTool === "component" &&
    hoverState?.objectType === "node" &&
    hoverState?.lastChildNodeBeforeCursor != null

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
      {showSelection &&
        activeTool === "select" &&
        !isDragging &&
        !activeBoardIsTheme && (
          <CanvasSelectionOutline wireframe={showWireframes} />
        )}
      {showSelection && activeTool === "select" && !activeBoardIsTheme && (
        <CanvasHoverOutline wireframe={showWireframes} />
      )}
      {activeTool === "component" && !isSiblingGap && <CanvasHoverOutline />}
      {activeTool === "component" && hasHoverState && <InsertTracking />}
    </>
  )
}
