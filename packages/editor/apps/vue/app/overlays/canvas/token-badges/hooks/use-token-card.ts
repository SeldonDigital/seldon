import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { MIN_WINDOW_SIZE } from "@app/windows/use-draggable-window"
import { getRefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { toCanvasLocalPoint } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { isInsideMenuSurface } from "@seldon/editor/lib/menus/floating-menu"
import { storeToRefs } from "pinia"
import { computed, nextTick, onScopeDispose, ref, watch } from "vue"

import { getRefCardMetrics } from "../../ref-badges/hooks/use-ref-card"

import type {
  BadgeBox,
  CardAnchor,
  RefCardPosition,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { Ref } from "vue"

type CardSides = Pick<RefCardPosition, "opens" | "grows">

interface TokenCardState {
  badgeRef: Ref<{ $el?: HTMLElement } | null>
  /** The card surface, set once the card is drawn, for placing and the outside-press check. */
  setCardEl: (el: HTMLElement | null) => void
  /** The rect the card opens at, and `null` while it is closed. */
  position: Ref<RefCardPosition | null>
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
 * the badge. This measures the card once it is drawn and re-places it from that, and
 * re-measures when the card's own size changes, so a disclosure opening inside the control
 * keeps the card seated on its badge. Vue port of the React `useTokenCard`.
 *
 * @param badge - The box the badge occupies, so an open card follows it as it moves.
 */
export function useTokenCard(badge: Ref<BadgeBox>): TokenCardState {
  const badgeRef = ref<{ $el?: HTMLElement } | null>(null)
  const position = ref<RefCardPosition | null>(null)
  let cardEl: HTMLElement | null = null
  let open = false

  // The badge box and card point captured on the last full place, so a pan re-places the card
  // by the badge's delta alone. The sides are decided once and kept, so a pan never flips the
  // card across its badge as the room trades sides.
  let anchor: CardAnchor | null = null
  let sides: CardSides | null = null

  // A floating palette lets a badge scroll off with its board, so its card follows past the
  // window edge and the canvas layer clips it, rather than being held to the window.
  const { propertiesFloating } = storeToRefs(useEditorConfigStore())

  function setCardEl(el: HTMLElement | null): void {
    cardEl = el
  }

  // A full place measures the card and the theme spacing and asks the window which side to
  // clear the badge on, so it reads layout and style. It runs when the card opens and when
  // its own content resizes, not on a pan; the pan follow below moves it with no reads.
  function place(): void {
    const badgeEl = badgeRef.value?.$el

    if (!open || !badgeEl) return

    const measured =
      cardEl && cardEl.offsetWidth > 0 && cardEl.offsetHeight > 0
        ? { width: cardEl.offsetWidth, height: cardEl.offsetHeight }
        : MIN_WINDOW_SIZE

    // A content-sized card is exactly its measured size, so that is both the size it opens at
    // and its smallest allowed size. Passing it as the metrics minimum keeps the window
    // envelope from inflating a short control back to a full window and displacing it.
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
      propertiesFloating.value,
      sides,
    )
    const point = toCanvasLocalPoint(viewport)
    const next = { ...viewport, x: point.x, y: point.y }

    anchor = { left: badge.value.left, top: badge.value.top, x: next.x, y: next.y }
    sides = { opens: next.opens, grows: next.grows }

    if (!position.value || !samePosition(position.value, next)) position.value = next
  }

  function close(): void {
    open = false
    anchor = null
    sides = null
    position.value = null
  }

  function toggle(): void {
    if (open) {
      close()

      return
    }

    open = true
    place()
  }

  // The card is only drawn once a position is set, so this runs after it mounts: it re-places
  // from the real size, and follows the card's own resizing.
  let observer: ResizeObserver | null = null
  const isOpen = computed(() => position.value !== null)

  watch(isOpen, (drawn) => {
    observer?.disconnect()
    observer = null

    if (!drawn) return

    void nextTick(() => {
      if (!cardEl) return

      place()
      observer = new ResizeObserver(() => place())
      observer.observe(cardEl)
    })
  })

  onScopeDispose(() => observer?.disconnect())

  // Scrolling the canvas moves the badge, and the card is locked to it, so it moves by the
  // badge's own delta. This reads no layout or style and does the arithmetic alone; the
  // card's size and sides were fixed by the last full place.
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

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from starting a
  // drag under an open card. The badge is excluded so its own click is the toggle, and the
  // card so reading or scrolling it does not close it. A floating menu or list the card opened
  // portals out of the card, so a press on it is treated as the card's own.
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
