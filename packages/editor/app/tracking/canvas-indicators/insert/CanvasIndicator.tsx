import { Placement } from "@lib/types"
import { CSSProperties } from "react"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { Instance, InstanceId, Variant, VariantId } from "@seldon/core/index"
import {
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { canNodeAcceptChildren } from "@lib/workspace/can-node-accept-children"
import { getNodeOrientation } from "@lib/workspace/get-node-orientation"
import { InsertIndicatorLine } from "@app/overlays"
import { getHtmlElementByBoardId } from "../../../canvas/helpers/get-html-element-by-board-id"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"
import { CANVAS_INSERT_ACCENT } from "./insert-indicators.bespoke"

type CanvasIndicatorProps = {
  placement: Placement
  objectId: InstanceId | VariantId | ComponentId
  objectType: "node" | "board"
  lastChildNodeBeforeCursor: InstanceId | VariantId | null
}

export function CanvasIndicator({
  placement,
  objectId,
  objectType,
  lastChildNodeBeforeCursor,
}: CanvasIndicatorProps) {
  const { workspace } = useWorkspace()

  const isBoardObject = isComponentId(objectId)
  const object = isBoardObject
    ? nodeRetrievalService.getBoard(objectId, workspace)
    : nodeRetrievalService.getNode(objectId, workspace)

  const canHaveChildren =
    !isBoardObject &&
    canNodeAcceptChildren(object as Variant | Instance, workspace)

  if (!canHaveChildren && !typeCheckingService.isBoard(object)) return null

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
    backgroundColor: CANVAS_INSERT_ACCENT,
    opacity: 0.5,
    ...(orientation === "horizontal" && {
      borderRadius: "1.5px 1.5px 0 0",
    }),
    ...(orientation === "vertical" && {
      borderRadius: "1.5px 0 0 1.5px",
    }),
  }

  return (
    <div style={containerStyle}>
      <InsertIndicatorLine style={lineStyle} />
    </div>
  )
}
