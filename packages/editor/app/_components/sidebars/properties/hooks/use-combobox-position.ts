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
  comboboxRef: RefObject<HTMLDivElement | null>
}

/**
 * Calculates and updates the position of combobox options dropdown
 */
export function useComboboxPosition({
  open,
  frameRef,
  comboboxRef,
}: UseComboboxPositionOptions): Position {
  const [optionsPosition, setOptionsPosition] = useState<Position>({
    x: 0,
    y: 0,
    w: 0,
  })

  useEffect(() => {
    if (!open) return

    let frameElement: HTMLElement | null = null

    // First try to use frameRef if available
    if (frameRef?.current) {
      frameElement = frameRef.current
    } else if (comboboxRef.current) {
      // Find the Frame element by looking for the data attribute
      // The Frame should be an ancestor of the combobox
      let current: HTMLElement | null = comboboxRef.current
      while (current) {
        if (current.getAttribute("data-frame-ref") === "true") {
          frameElement = current
          break
        }
        current = current.parentElement
      }

      // Fallback: use comboboxRef if Frame not found
      if (!frameElement) {
        frameElement = comboboxRef.current
      }
    }

    if (frameElement) {
      const rect = frameElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const bottomThreshold = viewportHeight * 0.6 // Bottom 40% threshold

      // Check if control is in the bottom 40% of the viewport
      const isInBottomThird = rect.top >= bottomThreshold

      // Position menu above the control if in bottom 40%, otherwise below
      // Note: When positioning above, we subtract a small gap (2px) from the top
      // The menu's max-height (max-h-96 = 384px) will handle overflow if needed
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
  }, [open, frameRef, comboboxRef])

  return optionsPosition
}
