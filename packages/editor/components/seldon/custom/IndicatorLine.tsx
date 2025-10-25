import { cn } from "@lib/utils/cn"

type Dimensions = {
  top?: number
  left?: number
  right?: number
  bottom?: number
  width?: number
  height?: number
}

type IndicatorLineProps = {
  color: "blue" | "magenta" | "yellow"
  style?: React.CSSProperties
  dimensions: Dimensions
  orientation?: "horizontal" | "vertical"
}

export function IndicatorLine({
  color,
  style,
  dimensions,
  orientation = "vertical",
}: IndicatorLineProps) {
  return (
    <div
      // Line
      className={cn(
        "pointer-events-none absolute z-10",
        color === "blue" && "bg-blue",
        color === "magenta" && "bg-magenta",
        color === "yellow" && "bg-yellow",
      )}
      style={{ ...dimensions, ...style }}
    >
      <div
        // Circle
        className={cn(
          "absolute h-2 w-2 rounded-full border",
          orientation === "vertical"
            ? "-left-2 top-[0.5px] -translate-y-1/2"
            : "left-[0.5px] -top-2 -translate-x-1/2",
          color === "blue" && "border-blue",
          color === "magenta" && "border-magenta",
          color === "yellow" && "border-yellow",
        )}
      />
    </div>
  )
}
