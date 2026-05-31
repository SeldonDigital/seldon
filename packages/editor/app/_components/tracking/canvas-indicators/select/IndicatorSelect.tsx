import { COLORS } from "@lib/utils/colors"
import { useNodeRect } from "../../hooks/use-node-rect"
import {
  getSelectionMode,
  getWireframeMode,
} from "../../utils/canvas-outline-modes"
import { calculateClippingBox } from "../../utils/calculate-clipping-box"

type IndicatorSelectProps = {
  nodeId: string
  variant: "selection" | "hover"
  showWireframe?: boolean
}

/**
 * Shows a dashed outside border around the selected node on the canvas.
 * Used in select mode to indicate which node is currently selected.
 */
export function IndicatorSelect({
  nodeId,
  variant,
  showWireframe = false,
}: IndicatorSelectProps) {
  const rect = useNodeRect(nodeId)

  if (!rect) return null

  let box
  if (showWireframe && variant === "selection") {
    const clippedRect = calculateClippingBox({ nodeId, rect })
    if (!clippedRect) return null
    box = getWireframeMode(clippedRect)
  } else {
    box = getSelectionMode(rect)
  }

  return (
    <div
      style={{
        top: `${box.top}px`,
        left: `${box.left}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        position: "absolute",
        pointerEvents: "none",
        boxSizing: box.boxSizing,
        borderStyle: "dashed",
        borderColor:
          variant === "hover" ? COLORS.charcoal[400] : COLORS.charcoal[700],
        borderWidth: box.borderWidth,
        zIndex: 1,
      }}
    />
  )
}
