/**
 * Hook for calculating combobox options position
 */
import { RefObject, useEffect, useState } from "react"

interface Position {
  x: number
  y: number
  w: number
  positionAbove?: boolean // Flag to indicate menu should render above the control
}

interface UseComboboxPositionOptions {
  open: boolean
  frameRef?: RefObject<HTMLDivElement | null>
}

/**
 * Calculates and updates the position of combobox options dropdown
 */
export function useComboboxPosition({
  open,
  frameRef,
}: UseComboboxPositionOptions): Position {
  const [optionsPosition, setOptionsPosition] = useState<Position>({
    x: 0,
    y: 0,
    w: 0,
  })

  useEffect(() => {
    if (!open) return

    const frameElement = frameRef?.current

    if (frameElement) {
      const rect = frameElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const bottomThreshold = viewportHeight * 0.6 // Bottom 40% threshold

      // Check if control is in the bottom 40% of the viewport
      const isInBottomThird = rect.top >= bottomThreshold

      // Position menu above the control if in bottom 40%, otherwise below
      // Note: When positioning above, we subtract a small gap (2px) from the top
      // The menu max height (24rem) handles overflow when needed
      const yPosition = isInBottomThird
        ? rect.top - 2 // Position above with 2px gap
        : rect.top + rect.height + 2 // Position below with 2px gap

      setOptionsPosition({
        x: rect.left,
        y: yPosition,
        w: rect.width, // Use Frame width
        positionAbove: isInBottomThird, // Flag to indicate positioning above
      })
    }
  }, [open, frameRef])

  return optionsPosition
}
