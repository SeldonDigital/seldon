import { COLORS } from "@lib/ui/colors"
import { InstanceId, VariantId } from "@seldon/core/index"
import { useNodeRect } from "../hooks/use-node-rect"
import { Label } from "./Label"

const LINE_LENGTH = 40
const LINE_THICKNESS = 2
const CIRCLE_SIZE = 6
type PointerProps = {
  nodeId: InstanceId | VariantId
  variant: "component" | "sketch"
  position: "left" | "right" | "center"
  label: string
}

/**
 * This component is used to point to the node that the user is targeting.
 * It's a label connected to a small circle by a thin line.
 */
export function Pointer({ nodeId, variant, position, label }: PointerProps) {
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
        variant={variant}
      />
    )
  }

  return (
    <div
      // Position the pointer at the right edge, vertically centered relative to the target node
      style={{
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width,
        position: "absolute",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 2,
      }}
    >
      {/* Circle */}
      <div
        style={{
          position: "absolute",
          top: -CIRCLE_SIZE / 2,
          left: -CIRCLE_SIZE / 2,
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: "50%",
          backgroundColor:
            variant === "component" ? COLORS.magenta[600] : COLORS.yellow[600],
          opacity: 0.5,
        }}
      />
      {/* Line */}
      <div
        style={{
          position: "absolute",
          left: CIRCLE_SIZE / 2,
          height: 2,
          top: -LINE_THICKNESS / 2,
          width: LINE_LENGTH,
          backgroundColor:
            variant === "component" ? COLORS.magenta[600] : COLORS.yellow[600],
          opacity: 0.5,
        }}
      />
      {/* Label */}
      <Label
        style={{
          position: "absolute",
          left: LINE_LENGTH + CIRCLE_SIZE / 2,
          top: -15,
        }}
        label={label}
        variant={variant}
      />
    </div>
  )
}
