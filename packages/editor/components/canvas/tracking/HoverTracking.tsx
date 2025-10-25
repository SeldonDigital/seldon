"use client"

import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { ComponentModeTracking } from "./ComponentModeTracking"
import { SketchModeTracking } from "./SketchModeTracking"
import { SelectionIndicator } from "./selection-indicator/SelectionIndicator"

export function HoverTracking() {
  const { hoverState } = useCanvasHoverState()
  const { activeTool } = useTool()

  if (!hoverState) return null

  // Show square around the hoverednode when in select mode
  if (activeTool === "select") {
    return <SelectionIndicator nodeId={hoverState.objectId} variant="hover" />
  }

  if (activeTool === "component") {
    return <ComponentModeTracking />
  }

  if (activeTool === "sketch") {
    return <SketchModeTracking />
  }
}
