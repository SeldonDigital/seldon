"use client"

import {
  REF_CARD_DEFAULT_SIZE,
  getRefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useCallback, useEffect, useRef, useState } from "react"

import type {
  ChipBox,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefObject } from "react"

interface RefCardState {
  chipRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  /** The rect the card opens at, and `null` while it is closed. */
  position: RefCardPosition | null
  toggle: () => void
  close: () => void
}

interface RefCardSize {
  width: number
  height: number
}

/**
 * The size the next card opens at.
 *
 * Shared across chips rather than kept per card, because resizing one card says how
 * much room these cards need, not how much that one ref needs. Read only when a card
 * opens, so it stays a module value rather than a store and a live drag re-renders
 * nothing. Not persisted, since the bindings behind the cards load per session.
 */
let refCardSize: RefCardSize = REF_CARD_DEFAULT_SIZE

export function setRefCardSize(size: RefCardSize): void {
  refCardSize = size
}

/**
 * Opens and closes one chip's card, and works out the rect it opens at.
 *
 * The card sticks until it is dismissed, because reading it means looking away from
 * the chip and a hover card would close on the way. Pressing anywhere outside the
 * pair closes it, which also means opening one chip's card closes another's.
 *
 * It opens at the size the last card was dragged to, then owns its own rect, so a
 * reader sizes these cards once rather than per ref.
 *
 * @param chip - The box the chip occupies, so an open card follows it as it moves.
 */
export function useRefCard(chip: ChipBox): RefCardState {
  const chipRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<RefCardPosition | null>(null)

  const close = useCallback(() => setPosition(null), [])

  const toggle = useCallback(() => {
    const chipEl = chipRef.current

    if (!chipEl) return

    setPosition((current) => {
      if (current) return null

      const rect = chipEl.getBoundingClientRect()

      return getRefCardPosition(rect, getWindowInnerSize(), refCardSize)
    })
  }, [])

  // Scrolling the canvas moves the chip, and the open card follows it so the pair stays
  // readable together. The rect is re-measured from the chip rather than offset by the
  // scroll, because a chip held at the edge of the gutter stops tracking its node.
  useEffect(() => {
    const chipEl = chipRef.current

    if (!chipEl) return

    setPosition((current) => {
      if (!current) return current

      return getRefCardPosition(chipEl.getBoundingClientRect(), getWindowInnerSize(), refCardSize)
    })
  }, [chip.top, chip.left])

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The chip is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it.
  useEffect(() => {
    if (!position) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null

      if (target && (chipRef.current?.contains(target) || cardRef.current?.contains(target))) return

      close()
    }

    document.addEventListener("pointerdown", closeOnOutsidePress)

    return () => document.removeEventListener("pointerdown", closeOnOutsidePress)
  }, [position, close])

  return { chipRef, cardRef, position, toggle, close }
}
