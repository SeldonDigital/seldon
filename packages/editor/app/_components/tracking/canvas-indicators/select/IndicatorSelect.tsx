import { COLORS } from "@lib/ui/colors"
import { useNodeRect } from "../../hooks/use-node-rect"

type IndicatorSelectProps = {
  nodeId: string
  variant: "selection" | "hover"
}

/**
 * Shows a solid border around the selected node on the canvas.
 * Used in select mode to indicate which node is currently selected.
 */
export function IndicatorSelect({ nodeId, variant }: IndicatorSelectProps) {
  const rect = useNodeRect(nodeId)

  if (!rect) return null

  return (
    <div
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        position: "absolute",
        pointerEvents: "none",
        borderStyle: "solid",
        borderColor:
          variant === "hover" ? COLORS.primary[400] : COLORS.primary[500],
        borderWidth: 1,
        zIndex: 1,
      }}
    />
  )
}
