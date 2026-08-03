"use client"

import { MIN_WINDOW_SIZE } from "@app/windows/hooks/use-draggable-window"
import { getRefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { getRefCardMetrics } from "../../ref-badges/hooks/use-ref-card"

import type {
  BadgeBox,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefObject } from "react"

interface TokenCardState {
  badgeRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  /** The rect the card opens at, and `null` while it is closed. */
  position: RefCardPosition | null
  toggle: () => void
  close: () => void
}

/**
 * Opens and closes one token badge's card, placed from the card's own measured size.
 *
 * The reference card opens at a fixed window size, so it can be placed the moment its
 * badge is clicked. A token card instead hugs the control it wraps, and a control is
 * shorter and narrower than a window, so placing it against a fixed size drops it far from
 * the badge on the edge it grows toward or the side it opens on. This measures the card
 * once it is drawn and re-places it from that, and re-measures when the card's own size
 * changes, so a disclosure opening inside the control keeps the card seated on its badge.
 *
 * @param badge - The box the badge occupies, so an open card follows it as it moves.
 */
export function useTokenCard(badge: BadgeBox): TokenCardState {
  const badgeRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<RefCardPosition | null>(null)
  const openRef = useRef(false)

  // Place off the live badge rect and the card's real size, falling back to the window
  // minimum before the card has been drawn to measure.
  const place = useCallback(() => {
    const badgeEl = badgeRef.current

    if (!openRef.current || !badgeEl) return

    const cardEl = cardRef.current
    const measured =
      cardEl && cardEl.offsetWidth > 0 && cardEl.offsetHeight > 0
        ? { width: cardEl.offsetWidth, height: cardEl.offsetHeight }
        : MIN_WINDOW_SIZE

    // A content-sized card is exactly its measured size, so that is both the size it opens
    // at and its smallest allowed size. Passing it as the metrics minimum keeps the window
    // envelope from inflating a short control back to a full window and displacing it, so
    // the edge next to the badge stays pinned and only the far edge moves as the card's own
    // disclosure grows or collapses it.
    const base = getRefCardMetrics(badgeEl)
    const metrics = {
      gap: base.gap,
      margin: base.margin,
      minWidth: measured.width,
      minHeight: measured.height,
    }

    const next = getRefCardPosition(
      badgeEl.getBoundingClientRect(),
      getWindowInnerSize(),
      measured,
      metrics,
    )

    setPosition((current) => (current && samePosition(current, next) ? current : next))
  }, [])

  const isOpen = position !== null

  const close = useCallback(() => {
    openRef.current = false
    setPosition(null)
  }, [])

  const toggle = useCallback(() => {
    if (openRef.current) {
      close()
      return
    }

    openRef.current = true
    place()
  }, [close, place])

  // The card is only drawn once a position is set, so this runs after it mounts: it
  // re-places from the real size, and follows the card's own resizing.
  useLayoutEffect(() => {
    if (!isOpen) return

    const cardEl = cardRef.current

    if (!cardEl) return

    place()

    const observer = new ResizeObserver(() => place())
    observer.observe(cardEl)

    return () => observer.disconnect()
    // Set up once per open, keyed on whether a card is drawn rather than its moving rect.
  }, [isOpen, place])

  // Scrolling the canvas moves the badge, and the open card follows it. The rect is
  // re-measured from the badge rather than offset by the scroll, because a badge held at
  // the edge of the gutter stops tracking its node.
  useLayoutEffect(() => {
    place()
  }, [badge.top, badge.left, place])

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from starting
  // a drag under an open card. The badge is excluded so its own click is the toggle, and
  // the card so reading or scrolling it does not close it.
  useEffect(() => {
    if (!position) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null

      const pressedOwnParts =
        badgeRef.current?.contains(target) || cardRef.current?.contains(target)

      if (target && pressedOwnParts) return

      close()
    }

    document.addEventListener("pointerdown", closeOnOutsidePress)

    return () => document.removeEventListener("pointerdown", closeOnOutsidePress)
  }, [position, close])

  return { badgeRef, cardRef, position, toggle, close }
}

/** True when two placements are the same, so a re-measure that moves nothing is dropped. */
function samePosition(a: RefCardPosition, b: RefCardPosition): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height &&
    a.opens === b.opens &&
    a.grows === b.grows
  )
}
