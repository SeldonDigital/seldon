/**
 * Hook for calculating a floating list's position from an anchor element.
 * Shared by the properties combobox and the objects-sidebar display picker.
 */
import { RefObject, useEffect, useState } from "react"

export interface ComboboxPosition {
  x: number
  y: number
  w: number
  /** True when the list should render above the anchor (anchor near viewport bottom). */
  positionAbove?: boolean
}

interface UseComboboxPositionOptions {
  open: boolean
  frameRef?: RefObject<HTMLElement | null>
}

/**
 * Calculates and updates the position of a floating option list anchored to
 * `frameRef`. Returns the anchor's left/width and a y below it, flipping to
 * render above when the anchor sits in the bottom 40% of the viewport.
 */
export function useComboboxPosition({
  open,
  frameRef,
}: UseComboboxPositionOptions): ComboboxPosition {
  const [optionsPosition, setOptionsPosition] = useState<ComboboxPosition>({
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
