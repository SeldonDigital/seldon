"use client"

import { RefObject, useLayoutEffect, useState } from "react"
import { MenuAlign } from "./types"

export interface MenuPosition {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

interface UseMenuPositionOptions {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  align?: MenuAlign
  gap?: number
}

/**
 * Computes a fixed-position style anchored to a trigger element. The menu opens
 * below the trigger, flipping above when the trigger sits in the bottom 40% of
 * the viewport. Recomputes on open, scroll, and resize.
 */
export function useMenuPosition({
  open,
  anchorRef,
  align = "start",
  gap = 4,
}: UseMenuPositionOptions): MenuPosition {
  const [position, setPosition] = useState<MenuPosition>({})

  useLayoutEffect(() => {
    if (!open) return

    const update = () => {
      const element = anchorRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const positionAbove = rect.bottom >= viewportHeight * 0.6

      const next: MenuPosition = {}

      if (align === "end") {
        next.right = Math.max(0, window.innerWidth - rect.right)
      } else {
        next.left = rect.left
      }

      if (positionAbove) {
        next.bottom = Math.max(0, viewportHeight - rect.top + gap)
      } else {
        next.top = rect.bottom + gap
      }

      setPosition(next)
    }

    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [open, anchorRef, align, gap])

  return position
}
