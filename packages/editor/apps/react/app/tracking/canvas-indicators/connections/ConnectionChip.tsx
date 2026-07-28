import { Frame } from "@seldon/components/frames/Frame"
import { getHoverCardPosition } from "@seldon/editor/lib/canvas/connections/connection-layout"
import { useCallback, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { ConnectionHoverCard } from "./ConnectionHoverCard"
import { connectionChipStyle } from "./connection-style"

import type {
  ConnectionPlacement,
  HoverCardPosition,
} from "@seldon/editor/lib/canvas/connections/connection-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"

interface ConnectionChipProps {
  placement: ConnectionPlacement
  binding: RefBinding
}

/**
 * The ref name at the end of a connector, opening the detail card on hover.
 *
 * The card is portaled to the body rather than drawn in place, because the canvas
 * is its own stacking context and a board with hidden overflow would clip it.
 */
export function ConnectionChip({ placement, binding }: ConnectionChipProps) {
  const chipRef = useRef<HTMLElement>(null)
  const [cardPosition, setCardPosition] = useState<HoverCardPosition | null>(null)

  const chipStyle = useMemo(
    () => connectionChipStyle(placement.chip, placement.muted),
    [placement.chip, placement.muted],
  )

  const showCard = useCallback(() => {
    const chipEl = chipRef.current

    if (!chipEl) return

    const rect = chipEl.getBoundingClientRect()

    setCardPosition(
      getHoverCardPosition(rect, { width: window.innerWidth, height: window.innerHeight }),
    )
  }, [])

  const hideCard = useCallback(() => {
    setCardPosition(null)
  }, [])

  const card = useMemo(() => {
    if (!cardPosition) return null

    return createPortal(
      <ConnectionHoverCard binding={binding} position={cardPosition} />,
      document.body,
    )
  }, [binding, cardPosition])

  return (
    <>
      <Frame ref={chipRef} style={chipStyle} onMouseEnter={showCard} onMouseLeave={hideCard}>
        {placement.label}
      </Frame>
      {card}
    </>
  )
}
