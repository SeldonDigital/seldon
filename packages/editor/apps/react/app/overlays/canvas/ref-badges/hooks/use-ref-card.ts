"use client"

import { usePropertiesFloating } from "@app/editor/hooks/use-editor-config"
import { MIN_WINDOW_SIZE } from "@app/windows/hooks/use-draggable-window"
import {
  REF_CARD_TOKENS,
  getRefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { toCanvasLocalPoint } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { isInsideMenuSurface } from "@seldon/editor/lib/menus/floating-menu"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import type {
  BadgeBox,
  CardAnchor,
  RefCardMetrics,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefObject } from "react"

interface RefCardState {
  badgeRef: RefObject<HTMLElement | null>
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
 * Shared across badges rather than kept per card, because resizing one card says how
 * much room these cards need, not how much that one ref needs. Read only when a card
 * opens, so it stays a module value rather than a store and a live drag re-renders
 * nothing. Not persisted, since the bindings behind the cards load per session.
 *
 * It starts at the size every floating window opens at, because a card is one of those
 * and there is nothing about a ref that asks for a different size.
 */
let refCardSize: RefCardSize = MIN_WINDOW_SIZE

export function setRefCardSize(size: RefCardSize): void {
  refCardSize = size
}

/**
 * What the card keeps clear and how small it may be drawn, in pixels.
 *
 * Read off the badge, which is themed and already drawn, so the spacing is the theme's
 * current value rather than one captured earlier. The smallest it may be drawn is the
 * window minimum, since a card is a floating window like any other.
 */
export function getRefCardMetrics(badgeEl: HTMLElement): RefCardMetrics {
  const { gap, margin } = getTokenPixels(REF_CARD_TOKENS, badgeEl)

  return {
    gap,
    margin,
    minWidth: MIN_WINDOW_SIZE.width,
    minHeight: MIN_WINDOW_SIZE.height,
  }
}

/**
 * Opens and closes one badge's card, and works out the rect it opens at.
 *
 * The card sticks until it is dismissed, because reading it means looking away from
 * the badge and a hover card would close on the way. Pressing anywhere outside the
 * pair closes it, which also means opening one badge's card closes another's.
 *
 * It opens at the size the last card was dragged to, then owns its own rect, so a
 * reader sizes these cards once rather than per ref.
 *
 * @param badge - The box the badge occupies, so an open card follows it as it moves.
 */
export function useRefCard(badge: BadgeBox): RefCardState {
  const badgeRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<RefCardPosition | null>(null)
  // The badge box in the canvas layer's own space, read by the opener without a dep on it so
  // opening does not rebuild each pan frame. The card is placed and moved in that same space.
  const badgeBoxRef = useRef({ left: badge.left, top: badge.top })

  badgeBoxRef.current = { left: badge.left, top: badge.top }
  // The badge box and card point captured when the card opened, so a pan re-places it by the
  // badge's delta alone.
  const anchorRef = useRef<CardAnchor | null>(null)
  // A floating palette lets a badge scroll off with its board, so its card follows past the
  // window edge and the canvas layer clips it, rather than being held to the window.
  const propertiesFloating = usePropertiesFloating()

  const close = useCallback(() => {
    anchorRef.current = null
    setPosition(null)
  }, [])

  const toggle = useCallback(() => {
    const badgeEl = badgeRef.current

    if (!badgeEl) return

    setPosition((current) => {
      if (current) {
        anchorRef.current = null

        return null
      }

      // Deciding the side and clamp needs the window, so place against it once, then carry the
      // point into the canvas layer's space, where the card is drawn and the badge box already is.
      const viewport = getRefCardPosition(
        badgeEl.getBoundingClientRect(),
        getWindowInnerSize(),
        refCardSize,
        getRefCardMetrics(badgeEl),
        propertiesFloating,
      )
      const point = toCanvasLocalPoint(viewport)
      const box = badgeBoxRef.current

      anchorRef.current = { left: box.left, top: box.top, x: point.x, y: point.y }

      return { ...viewport, x: point.x, y: point.y }
    })
  }, [propertiesFloating])

  // Scrolling the canvas moves the badge, and the card is locked to it, so it moves by the
  // badge's own delta. This runs every pan frame, so it reads no layout or style and does the
  // arithmetic alone; the card's size and sides were fixed when it opened.
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

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The badge is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it. A floating
  // menu the card opened portals out of the card, so a press on it is treated as the
  // card's own; otherwise picking an option would close the card and drop the action.
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
