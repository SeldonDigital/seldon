import { useMemo, useState } from "react"
import { SIDEBAR_SELECTED_BORDER } from "./sidebar-rows.bespoke"

/**
 * Local hover state and style for non-selectable header rows (sections and
 * property categories). Selectable rows use the shared hover bridge instead.
 */
export function useRowHover(isSelected: boolean, hoverOpacity: number = 10) {
  const [isHovered, setIsHovered] = useState(false)

  const style = useMemo(
    () => ({
      ...(isSelected
        ? { borderColor: SIDEBAR_SELECTED_BORDER }
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
