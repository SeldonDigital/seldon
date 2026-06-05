"use client"

import { useHasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useSelectedNodeId } from "@lib/workspace/hooks/use-selection"
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

  const showWireframes =
    wireframeMode === "on" ||
    (wireframeMode === "auto" && activeTool === "component")

  useTrackNodeRects(nodeIds)

  if (isInPreviewMode) return null

  return (
    <>
      {showSelection &&
        activeTool === "select" &&
        showWireframes &&
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
      {showSelection && activeTool === "select" && <CanvasSelectionOutline />}
      {showSelection && activeTool === "select" && <CanvasHoverOutline />}
      {activeTool === "component" && hasHoverState && <InsertTracking />}
    </>
  )
}
