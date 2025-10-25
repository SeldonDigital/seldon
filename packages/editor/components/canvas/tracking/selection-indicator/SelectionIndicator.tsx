import { COLORS } from "@lib/ui/colors"
import { useNodeRect } from "../hooks/use-node-rect"

type SelectionIndicatorProps = {
  nodeId: string
  variant: "selection" | "hover"
}

export function SelectionIndicator({
  nodeId,
  variant,
}: SelectionIndicatorProps) {
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
        borderColor: variant === "hover" ? COLORS.blue[400] : COLORS.blue[500],
        borderWidth: 1,
        zIndex: 1,
      }}
    />
  )
}
