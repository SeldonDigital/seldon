"use client"

import { MIN_WINDOW_SIZE } from "@app/windows/hooks/use-draggable-window"
import {
  REF_CARD_TOKENS,
  getRefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { isInsideMenuSurface } from "@seldon/editor/lib/menus/floating-menu"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { useCallback, useEffect, useRef, useState } from "react"

import type {
  BadgeBox,
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

  const close = useCallback(() => setPosition(null), [])

  const toggle = useCallback(() => {
    const badgeEl = badgeRef.current

    if (!badgeEl) return

    setPosition((current) => {
      if (current) return null

      const rect = badgeEl.getBoundingClientRect()

      return getRefCardPosition(rect, getWindowInnerSize(), refCardSize, getRefCardMetrics(badgeEl))
    })
  }, [])

  // Scrolling the canvas moves the badge, and the open card follows it so the pair stays
  // readable together. The rect is re-measured from the badge rather than offset by the
  // scroll, because a badge held at the edge of the gutter stops tracking its node.
  useEffect(() => {
    const badgeEl = badgeRef.current

    if (!badgeEl) return

    setPosition((current) => {
      if (!current) return current

      return getRefCardPosition(
        badgeEl.getBoundingClientRect(),
        getWindowInnerSize(),
        refCardSize,
        getRefCardMetrics(badgeEl),
      )
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
