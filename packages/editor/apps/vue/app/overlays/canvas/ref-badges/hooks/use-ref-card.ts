import { MIN_WINDOW_SIZE } from "@app/windows/use-draggable-window"
import {
  REF_CARD_TOKENS,
  getRefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { onScopeDispose, ref, watch } from "vue"

import type {
  BadgeBox,
  RefCardMetrics,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { Ref } from "vue"

interface RefCardState {
  /** The badge element, taken from the wrapper the overlay places it with. */
  badgeRef: Ref<{ $el?: HTMLElement } | null>
  /** The card surface, set once the card is drawn, for the outside-press check. */
  setCardEl: (el: HTMLElement | null) => void
  /** The rect the card opens at, and `null` while it is closed. */
  position: Ref<RefCardPosition | null>
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
function getRefCardMetrics(badgeEl: HTMLElement): RefCardMetrics {
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
 * Mirrors the React `useRefCard`.
 *
 * @param badge - The box the badge occupies, so an open card follows it as it moves.
 */
export function useRefCard(badge: Ref<BadgeBox>): RefCardState {
  const badgeRef = ref<{ $el?: HTMLElement } | null>(null)
  const position = ref<RefCardPosition | null>(null)
  let cardEl: HTMLElement | null = null

  function setCardEl(el: HTMLElement | null): void {
    cardEl = el
  }

  function measurePosition(badgeEl: HTMLElement): RefCardPosition {
    return getRefCardPosition(
      badgeEl.getBoundingClientRect(),
      getWindowInnerSize(),
      refCardSize,
      getRefCardMetrics(badgeEl),
    )
  }

  function close(): void {
    position.value = null
  }

  function toggle(): void {
    const badgeEl = badgeRef.value?.$el

    if (!badgeEl) return

    position.value = position.value ? null : measurePosition(badgeEl)
  }

  // Scrolling the canvas moves the badge, and the open card follows it so the pair stays
  // readable together. The rect is re-measured from the badge rather than offset by the
  // scroll, because a badge held at the edge of the gutter stops tracking its node.
  watch(
    () => [badge.value.top, badge.value.left],
    () => {
      const badgeEl = badgeRef.value?.$el

      if (!badgeEl || !position.value) return

      position.value = measurePosition(badgeEl)
    },
  )

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The badge is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it.
  function closeOnOutsidePress(event: PointerEvent): void {
    if (!position.value) return

    const target = event.target as Node | null
    const pressedOwnParts =
      badgeRef.value?.$el?.contains(target as Node) || cardEl?.contains(target as Node)

    if (target && pressedOwnParts) return

    close()
  }

  document.addEventListener("pointerdown", closeOnOutsidePress)
  onScopeDispose(() => document.removeEventListener("pointerdown", closeOnOutsidePress))

  return { badgeRef, setCardEl, position, toggle, close }
}
