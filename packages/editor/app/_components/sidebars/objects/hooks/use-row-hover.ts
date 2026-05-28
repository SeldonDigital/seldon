import { COLORS } from "@lib/ui/colors"
import { lcha } from "@lib/ui/colors"
import { useMemo, useState } from "react"

/**
 * Shared hook for managing hover state and styles in row components.
 * Provides consistent hover behavior across RowBoard, RowNode, and RowSection.
 */
export function useRowHover(isSelected: boolean, hoverOpacity: number = 10) {
  const [isHovered, setIsHovered] = useState(false)

  const style = useMemo(
    () => ({
      ...(isSelected ? { borderColor: COLORS.primary[500] } : {}),
      ...(isHovered && !isSelected
        ? {
            backgroundColor: lcha(COLORS.pearl[500], hoverOpacity / 100),
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
