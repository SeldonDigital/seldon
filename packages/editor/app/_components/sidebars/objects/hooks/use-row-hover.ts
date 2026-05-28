import { useMemo, useState } from "react"

/**
 * Shared hook for managing hover state and styles in row components.
 * Provides consistent hover behavior across RowBoard, RowNode, and RowSection.
 */
export function useRowHover(isSelected: boolean, hoverOpacity: number = 10) {
  const [isHovered, setIsHovered] = useState(false)

  const style = useMemo(
    () => ({
      ...(isSelected
        ? { borderColor: "var(--sdn-seldon-swatch-primary)" }
        : {}),
      ...(isHovered && !isSelected
        ? {
            backgroundColor: `hsl(0 0% 100% / ${hoverOpacity / 100})`,
          }
        : {}),
    }),
    [isSelected, isHovered, hoverOpacity],
  )

  return {
    isHovered,
    setIsHovered,
    style,
  }
}
