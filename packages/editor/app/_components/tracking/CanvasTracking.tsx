"use client"

import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useBelongsToActiveBoard } from "./hooks/use-belongs-to-active-board"
import { useTrackNodeRects } from "./hooks/use-track-node-rects"
import { useVisibleNodes } from "./hooks/use-visible-nodes"
import { useSelection } from "@lib/workspace/use-selection"
import { InsertTracking } from "./canvas-indicators/insert/Tracking"
import { IndicatorSelect } from "./canvas-indicators/select/IndicatorSelect"
import { SelectTracking } from "./canvas-indicators/select/Tracking"

export function CanvasTracking() {
  const { selectedNodeId } = useSelection()
  const { activeTool } = useTool()
  const { isInPreviewMode } = usePreview()
  const { visibleNodes } = useVisibleNodes()
  const { hoverState } = useCanvasHoverState()
  const nodeIds = visibleNodes.map((node) => node.id)
  const { wireframeMode } = useEditorConfig()
  const { nodeBelongsToActiveBoard } = useBelongsToActiveBoard()

  const showWireframes =
    wireframeMode === "on" ||
    (wireframeMode === "auto" && activeTool === "component")

  useTrackNodeRects(nodeIds)

  if (isInPreviewMode) return null

  return (
    <>
      {activeTool === "select" &&
        visibleNodes.map((node) => {
          if (!nodeBelongsToActiveBoard(node.id)) return null

          return (
            <SelectTracking
              key={node.id}
              nodeId={node.id}
              isSelected={selectedNodeId === node.id}
              isHovered={hoverState?.objectId === node.id}
              showWireframe={showWireframes}
            />
          )
        })}
      {activeTool === "select" && selectedNodeId && (
        <IndicatorSelect nodeId={selectedNodeId} variant="selection" />
      )}
      {activeTool === "component" && hoverState && <InsertTracking />}
    </>
  )
}
