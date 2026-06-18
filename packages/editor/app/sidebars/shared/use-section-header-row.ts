import { MouseEvent, useCallback } from "react"
import { useRowHover } from "../hooks/use-row-hover"

interface UseSectionHeaderRowInput {
  onToggle: (event?: MouseEvent<HTMLElement>) => void
  hoverOpacity?: number
}

/**
 * Shared hover and click handling for section header rows in the objects and
 * properties sidebars.
 */
export function useSectionHeaderRow({
  onToggle,
  hoverOpacity = 25,
}: UseSectionHeaderRowInput) {
  const { setIsHovered, style: hoverStyle } = useRowHover(false, hoverOpacity)

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest("button")) {
        return
      }
      onToggle(event)
    },
    [onToggle],
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [setIsHovered])
  const handleMouseLeave = useCallback(
    () => setIsHovered(false),
    [setIsHovered],
  )

  return {
    hoverStyle,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
  }
}
