import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { MIN_WINDOW_SIZE } from "@app/windows/use-draggable-window"
import {
  REF_CARD_TOKENS,
  getRefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { toCanvasLocalPoint } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { isInsideMenuSurface } from "@seldon/editor/lib/menus/floating-menu"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { storeToRefs } from "pinia"
import { onScopeDispose, ref, watch } from "vue"

import type {
  BadgeBox,
  CardAnchor,
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
 * The card is placed and moved in the canvas layer's own space, so it clips with the
 * badges rather than floating over the chrome. It is placed once against the window to
 * decide its side, then a pan re-places it by the badge's own delta with no reads.
 *
 * Mirrors the React `useRefCard`.
 *
 * @param badge - The box the badge occupies, so an open card follows it as it moves.
 */
export function useRefCard(badge: Ref<BadgeBox>): RefCardState {
  const badgeRef = ref<{ $el?: HTMLElement } | null>(null)
  const position = ref<RefCardPosition | null>(null)
  let cardEl: HTMLElement | null = null

  // The badge box and card point captured when the card opened, so a pan re-places it by the
  // badge's delta alone.
  let anchor: CardAnchor | null = null

  // A floating palette lets a badge scroll off with its board, so its card follows past the
  // window edge and the canvas layer clips it, rather than being held to the window.
  const { propertiesFloating } = storeToRefs(useEditorConfigStore())

  function setCardEl(el: HTMLElement | null): void {
    cardEl = el
  }

  function close(): void {
    anchor = null
    position.value = null
  }

  function toggle(): void {
    const badgeEl = badgeRef.value?.$el

    if (!badgeEl) return

    if (position.value) {
      close()

      return
    }

    // Deciding the side and clamp needs the window, so place against it once, then carry the
    // point into the canvas layer's space, where the card is drawn and the badge box already is.
    const viewport = getRefCardPosition(
      badgeEl.getBoundingClientRect(),
      getWindowInnerSize(),
      refCardSize,
      getRefCardMetrics(badgeEl),
      propertiesFloating.value,
    )
    const point = toCanvasLocalPoint(viewport)

    anchor = { left: badge.value.left, top: badge.value.top, x: point.x, y: point.y }
    position.value = { ...viewport, x: point.x, y: point.y }
  }

  // Scrolling the canvas moves the badge, and the card is locked to it, so it moves by the
  // badge's own delta. This reads no layout or style and does the arithmetic alone; the
  // card's size and sides were fixed when it opened.
  watch(
    () => [badge.value.top, badge.value.left],
    () => {
      if (!anchor || !position.value) return

      const x = anchor.x + (badge.value.left - anchor.left)
      const y = anchor.y + (badge.value.top - anchor.top)

      if (x === position.value.x && y === position.value.y) return

      position.value = { ...position.value, x, y }
    },
  )

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The badge is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it. A floating
  // menu the card opened portals out of the card, so a press on it is treated as the
  // card's own; otherwise picking an option would close the card and drop the action.
  function closeOnOutsidePress(event: PointerEvent): void {
    if (!position.value) return

    const target = event.target as Node | null
    const pressedOwnParts =
      badgeRef.value?.$el?.contains(target as Node) ||
      cardEl?.contains(target as Node) ||
      isInsideMenuSurface(target)

    if (target && pressedOwnParts) return

    close()
  }

  document.addEventListener("pointerdown", closeOnOutsidePress)
  onScopeDispose(() => document.removeEventListener("pointerdown", closeOnOutsidePress))

  return { badgeRef, setCardEl, position, toggle, close }
}
