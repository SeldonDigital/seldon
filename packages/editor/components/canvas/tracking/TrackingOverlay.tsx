"use client"

import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useTrackNodeRects } from "./hooks/use-track-node-rects"
import { useVisibleNodes } from "./hooks/use-visible-nodes"
import { useSelection } from "@lib/workspace/use-selection"
import { HoverTracking } from "./HoverTracking"
import { Wireframes } from "./Wireframes"
import { SelectionIndicator } from "./selection-indicator/SelectionIndicator"

export function TrackingOverlay() {
  const { selectedNodeId } = useSelection()
  const { activeTool } = useTool()
  const { isInPreviewMode } = usePreview()
  const { visibleNodes } = useVisibleNodes()
  const nodeIds = visibleNodes.map((node) => node.id)
  const { wireframeMode } = useEditorConfig()

  // Show wireframes when:
  // - Wireframe mode is on
  // - Wireframe mode is contextual and the active tool is sketch or insert-component
  const showWireframes =
    wireframeMode === "on" ||
    (wireframeMode === "auto" &&
      (activeTool === "sketch" || activeTool === "component"))

  useTrackNodeRects(nodeIds)

  if (isInPreviewMode) {
    return null
  }

  return (
    <>
      {showWireframes && <Wireframes nodes={visibleNodes} />}
      <HoverTracking />
      {activeTool === "select" && selectedNodeId && (
        <SelectionIndicator nodeId={selectedNodeId} variant="selection" />
      )}
    </>
  )
}
