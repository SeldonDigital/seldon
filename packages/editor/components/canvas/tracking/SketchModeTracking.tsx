"use client"

import { getSketchTaskForObject } from "@lib/sketch/get-sketch-variables-for-target"
import { InstanceId, VariantId, invariant } from "@seldon/core/index"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { InsertionIndicator } from "./insertion-indicator/InsertionIndicator"
import { Pointer } from "./insertion-indicator/Pointer"

export function SketchModeTracking() {
  const { activeTool } = useTool()
  const { hoverState } = useCanvasHoverState()
  const { workspace } = useWorkspace()

  invariant(activeTool === "sketch", "Must be used in sketch mode")
  invariant(hoverState, "This component requires a hover state")

  const { objectId, objectType, placement, lastChildNodeBeforeCursor } =
    hoverState

  const task = getSketchTaskForObject(objectId, workspace)

  if (hoverState.objectType === "board") {
    return (
      <InsertionIndicator
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
        tool="sketch"
        label="Sketch variant"
      />
    )
  }

  const position = task === "sketch_image" ? "center" : "right"

  const node = workspaceService.getNode(
    objectId as InstanceId | VariantId,
    workspace,
  )
  const properties = getNodeProperties(node, workspace)
  const componentName = workspaceService.getComponentName(objectId, workspace)

  const label =
    task === "replace_node"
      ? `Sketch ${componentName}`
      : properties.source
        ? `Sketch image`
        : `Sketch background image`

  return (
    <Pointer
      nodeId={node.id}
      variant="sketch"
      position={position}
      label={label}
    />
  )
}
