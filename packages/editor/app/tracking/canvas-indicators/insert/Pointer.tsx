import { COLORS } from "@lib/helpers/colors"
import { InstanceId, VariantId } from "@seldon/core/index"
import { useNodeRect } from "../../hooks/use-node-rect"
import {
  InsertIndicatorLine,
  Pointer as PointerMarker,
  PositionedPanel,
} from "@seldon/components/custom-components"
import { Label } from "./Label"

const LINE_LENGTH = 40
const LINE_THICKNESS = 2
const CIRCLE_SIZE = 6
type PointerProps = {
  nodeId: InstanceId | VariantId
  position: "left" | "right" | "center"
  label: string
}

/**
 * This component is used to point to the node that the user is targeting.
 * It's a label connected to a small circle by a thin line.
 */
export function Pointer({ nodeId, position, label }: PointerProps) {
  const rect = useNodeRect(nodeId)

  if (!rect) return null

  if (position === "center") {
    return (
      <Label
        style={{
          position: "absolute",
          top: rect.top + 0.5 * rect.height,
          left: rect.left + 0.5 * rect.width,
          transform: `translate(-50%, -50%)`,
          zIndex: 2,
        }}
        label={label}
      />
    )
  }

  // Position the pointer at the right edge, vertically centered relative to the target node
  const wrapperStyle = {
    top: rect.top + rect.height / 2,
    left: rect.left + rect.width,
    position: "absolute" as const,
    pointerEvents: "none" as const,
    overflow: "visible" as const,
    zIndex: 2,
  }

  const circleStyle = {
    position: "absolute" as const,
    top: -CIRCLE_SIZE / 2,
    left: -CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: "50%",
    backgroundColor: COLORS.accent[600],
    opacity: 0.5,
  }

  const lineStyle = {
    position: "absolute" as const,
    left: CIRCLE_SIZE / 2,
    height: 2,
    top: -LINE_THICKNESS / 2,
    width: LINE_LENGTH,
    backgroundColor: COLORS.accent[600],
    opacity: 0.5,
  }

  const labelStyle = {
    position: "absolute" as const,
    left: LINE_LENGTH + CIRCLE_SIZE / 2,
    top: -15,
  }

  return (
    <PositionedPanel style={wrapperStyle}>
      <PointerMarker style={circleStyle} />
      <InsertIndicatorLine style={lineStyle} />
      <Label style={labelStyle} label={label} />
    </PositionedPanel>
  )
}
