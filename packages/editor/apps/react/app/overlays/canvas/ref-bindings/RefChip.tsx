import { Frame } from "@seldon/components/frames/Frame"
import { useMemo } from "react"

import { RefCardController } from "./RefCardController"
import { useRefCard } from "./hooks/use-ref-card"
import { refChipStyle } from "./ref-chip-style"

import type {
  ChipBox,
  ConnectorPlacement,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

interface RefChipProps {
  placement: ConnectorPlacement
  binding: RefBinding
}

interface RefOmittedProps {
  chip: ChipBox
  count: number
}

/** The ref name at the end of a connector, opening its card when clicked. */
export function RefChip({ placement, binding }: RefChipProps) {
  const { chipRef, cardRef, position, toggle } = useRefCard()

  const chipStyle = useMemo(
    () => refChipStyle(placement.chip, placement.muted),
    [placement.chip, placement.muted],
  )

  const card = useMemo(() => {
    if (!position) return null

    return <RefCardController binding={binding} position={position} cardRef={cardRef} />
  }, [binding, cardRef, position])

  return (
    <>
      <Frame ref={chipRef} style={chipStyle} onClick={toggle}>
        {placement.label}
      </Frame>
      {card}
    </>
  )
}

/**
 * Reports the refs that did not fit the gutter.
 *
 * Drawn rather than dropped silently, so a selection with more refs than the column
 * holds says so instead of appearing to have fewer. Carries no connector and opens
 * no card, so it is drawn muted.
 */
export function RefOmitted({ chip, count }: RefOmittedProps) {
  const chipStyle = useMemo(() => refChipStyle(chip, true), [chip])
  const label = `+${count} more`

  return <Frame style={chipStyle}>{label}</Frame>
}
