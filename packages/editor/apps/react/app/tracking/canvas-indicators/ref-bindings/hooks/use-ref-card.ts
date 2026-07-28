"use client"

import { getRefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { useCallback, useEffect, useRef, useState } from "react"

import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefObject } from "react"

interface RefCardState {
  chipRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLElement | null>
  /** Where the card draws, and `null` while it is closed. */
  position: RefCardPosition | null
  toggle: () => void
}

/**
 * Opens and closes one chip's card, and works out where it draws.
 *
 * The card sticks until it is dismissed, because reading it means looking away from
 * the chip and a hover card would close on the way. Pressing anywhere outside the
 * pair closes it, which also means opening one chip's card closes another's.
 */
export function useRefCard(): RefCardState {
  const chipRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<RefCardPosition | null>(null)

  const toggle = useCallback(() => {
    const chipEl = chipRef.current

    if (!chipEl) return

    setPosition((current) => {
      if (current) return null

      const rect = chipEl.getBoundingClientRect()

      return getRefCardPosition(rect, {
        width: window.innerWidth,
        height: window.innerHeight,
      })
    })
  }, [])

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The chip is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it.
  useEffect(() => {
    if (!position) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null

      if (target && (chipRef.current?.contains(target) || cardRef.current?.contains(target))) return

      setPosition(null)
    }

    document.addEventListener("pointerdown", closeOnOutsidePress)

    return () => document.removeEventListener("pointerdown", closeOnOutsidePress)
  }, [position])

  return { chipRef, cardRef, position, toggle }
}
