import { Frame } from "@seldon/components/frames/Frame"
import { getDetailCardPosition } from "@seldon/editor/lib/canvas/connections/connection-layout"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { ConnectionDetailCard } from "./ConnectionDetailCard"
import { connectionChipStyle } from "./connection-style"

import type {
  ConnectionPlacement,
  DetailCardPosition,
} from "@seldon/editor/lib/canvas/connections/connection-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"

interface ConnectionChipProps {
  placement: ConnectionPlacement
  binding: RefBinding
}

/**
 * The ref name at the end of a connector, opening the detail card when clicked.
 *
 * The card sticks until it is dismissed, because reading it means looking away
 * from the chip and a hover card would close on the way. Clicking anywhere outside
 * the pair closes it, which also means opening one chip's card closes another's.
 *
 * The card is portaled to the body rather than drawn in place, because the canvas
 * is its own stacking context and a board with hidden overflow would clip it.
 */
export function ConnectionChip({ placement, binding }: ConnectionChipProps) {
  const chipRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const [cardPosition, setCardPosition] = useState<DetailCardPosition | null>(null)

  const chipStyle = useMemo(
    () => connectionChipStyle(placement.chip, placement.muted),
    [placement.chip, placement.muted],
  )

  const toggleCard = useCallback(() => {
    const chipEl = chipRef.current

    if (!chipEl) return

    setCardPosition((current) => {
      if (current) return null

      const rect = chipEl.getBoundingClientRect()

      return getDetailCardPosition(rect, {
        width: window.innerWidth,
        height: window.innerHeight,
      })
    })
  }, [])

  // Closing on `pointerdown` rather than `click` keeps a press on the canvas from
  // starting a drag under an open card. The chip is excluded so its own click is
  // the toggle, and the card so reading or scrolling it does not close it.
  useEffect(() => {
    if (!cardPosition) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null

      if (target && (chipRef.current?.contains(target) || cardRef.current?.contains(target))) return

      setCardPosition(null)
    }

    document.addEventListener("pointerdown", closeOnOutsidePress)

    return () => document.removeEventListener("pointerdown", closeOnOutsidePress)
  }, [cardPosition])

  const card = useMemo(() => {
    if (!cardPosition) return null

    return createPortal(
      <ConnectionDetailCard binding={binding} position={cardPosition} cardRef={cardRef} />,
      document.body,
    )
  }, [binding, cardPosition])

  return (
    <>
      <Frame ref={chipRef} style={chipStyle} onClick={toggleCard}>
        {placement.label}
      </Frame>
      {card}
    </>
  )
}
