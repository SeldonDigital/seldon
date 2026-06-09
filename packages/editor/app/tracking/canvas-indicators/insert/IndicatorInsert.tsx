import { Placement } from "@lib/types"
import { COLORS } from "@lib/helpers/colors"
import { CSSProperties } from "react"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"
import { getNodeOrientation } from "@lib/workspace/get-node-orientation"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import {
  InsertIndicatorLine,
  PositionedPanel,
} from "@seldon/components/custom-components"
import { getHtmlElementByBoardId } from "../../../canvas/helpers/get-html-element-by-board-id"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"
import { Label } from "./Label"

type IndicatorInsertProps = {
  label: string
  placement: Placement
  objectId: InstanceId | VariantId | ComponentId
  objectType: "node" | "board"
  lastChildNodeBeforeCursor: InstanceId | VariantId | null
}

export function IndicatorInsert({
  label,
  placement,
  objectId,
  objectType,
  lastChildNodeBeforeCursor,
}: IndicatorInsertProps) {
  const { workspace } = useWorkspace()

  const object = isComponentId(objectId)
    ? workspaceService.getBoard(objectId, workspace)
    : workspaceService.getNode(objectId, workspace)

  const canHaveChildren = workspaceService.canNodeHaveChildren(object)

  if (!canHaveChildren && !workspaceService.isBoard(object)) return null

  const containerElement =
    objectType === "node"
      ? getHtmlElementByNodeId(objectId)
      : getHtmlElementByBoardId(objectId as ComponentId)

  const childElement = lastChildNodeBeforeCursor
    ? getHtmlElementByNodeId(lastChildNodeBeforeCursor)
    : null

  if (!containerElement) return null

  // This is the orientation of the container, not the orientation of the indicator
  // We show a vertical indicator if the container is oriented horizontally and vice versa
  const orientation = getNodeOrientation(objectId, workspace)

  const position = calculateIndicatorPosition({
    orientation,
    placement,
    containerElement,
    childElement,
    canvasElement: document.getElementById("canvas") as HTMLElement,
  })

  const containerStyle: CSSProperties = {
    ...position,
    pointerEvents: "none",
    zIndex: 10,
    position: "absolute",
  }

  const lineStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    zIndex: 10,
    position: "absolute",
    backgroundColor: COLORS.accent[600],
    opacity: 0.5,
    ...(orientation === "horizontal" && {
      borderRadius: "1.5px 1.5px 0 0",
    }),
    ...(orientation === "vertical" && {
      borderRadius: "1.5px 0 0 1.5px",
    }),
  }

  const buttonStyle: CSSProperties = {
    position: "absolute",
    zIndex: 1,
    ...(orientation === "horizontal" && {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(orientation === "vertical" && {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
    }),
  }

  return (
    <PositionedPanel style={containerStyle}>
      <InsertIndicatorLine style={lineStyle} />
      <Label style={buttonStyle} label={label} />
    </PositionedPanel>
  )
}
