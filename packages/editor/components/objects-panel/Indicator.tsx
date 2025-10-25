import { Placement } from "@lib/types"
import { cn } from "@lib/utils/cn"
import { FC } from "react"
import { IndicatorLine } from "../seldon/custom/IndicatorLine"
import { useIndentation } from "./contexts/indentation-context"
import { calculateIndicatorPosition } from "./helpers/calculate-indicator-position"

type IndicatorProps = {
  placement: Placement
  color: "blue" | "magenta" | "yellow"
}

export const Indicator: FC<IndicatorProps> = ({ placement, color }) => {
  const indentation = useIndentation()
  if (placement === "inside") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 outline outline-1 rounded-lg",
          color === "blue" && "outline-blue",
          color === "magenta" && "outline-magenta",
          color === "yellow" && "outline-yellow",
        )}
      />
    )
  }

  const position = calculateIndicatorPosition(placement, indentation)

  return (
    <IndicatorLine color={color} dimensions={position} orientation="vertical" />
  )
}
