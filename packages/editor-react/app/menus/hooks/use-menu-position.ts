"use client"

import {
  type MenuPosition,
  computeMenuPosition,
} from "@seldon/editor/lib/menus/anchor-position"
import { RefObject, useLayoutEffect, useState } from "react"

import { MenuAlign } from "../types"

export type { MenuPosition }

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
      setPosition(
        computeMenuPosition(
          element.getBoundingClientRect(),
          { width: window.innerWidth, height: window.innerHeight },
          { align, gap },
        ),
      )
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
