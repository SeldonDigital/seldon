/**
 * Hook for calculating a floating list's position from an anchor element.
 * Shared by the properties combobox and the objects-sidebar display picker.
 */
import {
  type ListPosition,
  computeListPosition,
} from "@seldon/editor/lib/menus/anchor-position"
import { RefObject, useEffect, useState } from "react"

export type ComboboxPosition = ListPosition

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
      setOptionsPosition(
        computeListPosition(frameElement.getBoundingClientRect(), {
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      )
    }
  }, [open, frameRef])

  return optionsPosition
}
