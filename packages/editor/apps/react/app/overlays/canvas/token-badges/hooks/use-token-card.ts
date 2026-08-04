"use client"

import { usePropertiesFloating } from "@app/editor/hooks/use-editor-config"
import { MIN_WINDOW_SIZE } from "@app/windows/hooks/use-draggable-window"
import { getRefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { toCanvasLocalPoint } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { isInsideMenuSurface } from "@seldon/editor/lib/menus/floating-menu"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { getRefCardMetrics } from "../../ref-badges/hooks/use-ref-card"

import type {
  BadgeBox,
  CardAnchor,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefObject } from "react"

type CardSides = Pick<RefCardPosition, "opens" | "grows">

interface TokenCardState {
  badgeRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  /** The rect the card opens at, and `null` while it is closed. */
  position: RefCardPosition | null
  toggle: () => void
  close: () => void
}

/**
 * The width the next token card opens at, or `null` to hug its control.
 *
 * A token card hugs its control until the reader drags it wider to read a compound's
 * values, then that width carries to the next card, the way the reference card remembers
 * its dragged size. Only the width is remembered: the height always follows the control,
 * so a compound still grows the card as it expands. Kept as a module value rather than a
 * store, since it is read only when a card opens and a live drag re-renders nothing.
 */
let tokenCardWidth: number | null = null

export function setTokenCardWidth(width: number): void {
  tokenCardWidth = width
}

export function getTokenCardWidth(): number | null {
  return tokenCardWidth
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
  // The badge box in the canvas layer's own space, read without a dep on it so a full place
  // does not rebuild each pan frame. The card is placed and moved in that same space.
  const badgeBoxRef = useRef({ left: badge.left, top: badge.top })
  badgeBoxRef.current = { left: badge.left, top: badge.top }
  // The badge box and card point captured on the last full place, so a pan re-places the card
  // by the badge's delta alone. The sides are decided once and kept, so a pan never flips the
  // card across its badge as the room trades sides.
  const anchorRef = useRef<CardAnchor | null>(null)
  const sidesRef = useRef<CardSides | null>(null)
  // A floating palette lets a badge scroll off with its board, so its card follows past the
  // window edge and the canvas layer clips it, rather than being held to the window.
  const propertiesFloating = usePropertiesFloating()

  // A full place measures the card and the theme spacing and asks the window which side to
  // clear the badge on, so it reads layout and style. It runs when the card opens and when its
  // own content resizes, not on a pan; the pan follow below moves it with no reads at all.
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

    const viewport = getRefCardPosition(
      badgeEl.getBoundingClientRect(),
      getWindowInnerSize(),
      measured,
      metrics,
      propertiesFloating,
      sidesRef.current,
    )
    const point = toCanvasLocalPoint(viewport)
    const next = { ...viewport, x: point.x, y: point.y }
    const box = badgeBoxRef.current

    anchorRef.current = { left: box.left, top: box.top, x: next.x, y: next.y }
    sidesRef.current = { opens: next.opens, grows: next.grows }

    setPosition((current) => (current && samePosition(current, next) ? current : next))
  }, [propertiesFloating])

  const isOpen = position !== null

  const close = useCallback(() => {
    openRef.current = false
    anchorRef.current = null
    sidesRef.current = null
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

  // Scrolling the canvas moves the badge, and the card is locked to it, so it moves by the
  // badge's own delta. This runs every pan frame, so it reads no layout or style and does the
  // arithmetic alone; the card's size and sides were fixed by the last full place.
  useLayoutEffect(() => {
    const anchor = anchorRef.current

    if (!anchor) return

    setPosition((current) => {
      if (!current) return current

      const x = anchor.x + (badge.left - anchor.left)
      const y = anchor.y + (badge.top - anchor.top)

      return x === current.x && y === current.y ? current : { ...current, x, y }
    })
  }, [badge.top, badge.left])

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from starting
  // a drag under an open card. The badge is excluded so its own click is the toggle, and
  // the card so reading or scrolling it does not close it. A floating menu or list the card
  // opened portals out of the card, so a press on it is treated as the card's own; otherwise
  // picking an option would close the card and unmount the option before its press lands.
  useEffect(() => {
    if (!position) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null

      const pressedOwnParts =
        badgeRef.current?.contains(target) ||
        cardRef.current?.contains(target) ||
        isInsideMenuSurface(target)

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
