"use client"

import { getSuggestTaskForObject } from "@lib/suggest/get-suggest-variables-for-target"
import { InstanceId, VariantId, invariant } from "@seldon/core/index"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { InsertionIndicator } from "./insertion-indicator/InsertionIndicator"
import { Pointer } from "./insertion-indicator/Pointer"

export function ComponentModeTracking() {
  const { activeTool } = useTool()
  const { hoverState } = useCanvasHoverState()
  const { workspace } = useWorkspace()

  invariant(activeTool === "component", "Must be used in component mode")
  invariant(hoverState, "This component requires a hover state")

  const { objectId, objectType, placement, lastChildNodeBeforeCursor } =
    hoverState

  if (hoverState.objectType === "board") {
    // Show insertion indicator for inserting variants when in insert-component mode
    return (
      <InsertionIndicator
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
        tool={activeTool}
        label="Suggest a variant"
      />
    )
  }
  const task = getSuggestTaskForObject(objectId, workspace)

  if (!task)
    // When hovering over a node, show "Insert component" indicator for inserting components
    return (
      <InsertionIndicator
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
        tool="component"
        label="Insert component"
      />
    )

  const position = task === "suggest_image" ? "center" : "right"

  const node = workspaceService.getNode(
    objectId as InstanceId | VariantId,
    workspace,
  )
  const properties = getNodeProperties(node, workspace)
  const componentName = workspaceService.getComponentName(objectId, workspace)

  let label = ""
  if (task === "suggest_variation") {
    label = `Suggest a new ${componentName}`
  } else if (task === "suggest_image") {
    label = properties.source ? `Suggest image` : `Suggest background image`
  } else if (task === "suggest_text") {
    label = `Suggest text`
  }

  return (
    <Pointer
      nodeId={node.id}
      variant="component"
      position={position}
      label={label}
    />
  )
}
