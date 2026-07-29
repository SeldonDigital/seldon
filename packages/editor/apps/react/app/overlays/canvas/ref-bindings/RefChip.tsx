import { Frame } from "@seldon/components/frames/Frame"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import { useMemo } from "react"

import { RefCardController } from "./RefCardController"
import { useRefCard } from "./hooks/use-ref-card"
import {
  refChipHiddenCardStyle,
  refChipMutedStyle,
  refChipPanelStyle,
  refChipStyle,
  refOmittedStyle,
} from "./ref-chip-style"

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

/**
 * The ref name at the end of a connector, opening its card when clicked.
 *
 * The chip and the card are the same `PanelRefs` component, drawn twice. This instance
 * hides the card half and the card's instance leaves the chip out, so both surfaces
 * take their look from one schema.
 *
 * The wrapper carries the placement and the click, because a module takes no `ref`.
 */
export function RefChip({ placement, binding }: RefChipProps) {
  const { chipRef, cardRef, position, toggle, close } = useRefCard()

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return refChipMutedStyle(placement.chip)

    return refChipStyle(placement.chip)
  }, [placement.chip, placement.muted])

  const chipRefs = {
    refChipName: { children: placement.label },
    refCard: { style: refChipHiddenCardStyle },
  }

  const card = useMemo(() => {
    if (!position) return null

    return (
      <RefCardController binding={binding} position={position} onClose={close} cardRef={cardRef} />
    )
  }, [binding, cardRef, close, position])

  return (
    <>
      <Frame ref={chipRef} style={wrapperStyle} onClick={toggle}>
        <PanelRefs
          role="presentation"
          style={refChipPanelStyle}
          seldonRefs={chipRefs}
          chipAssist={{}}
          textLabel={{}}
        />
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
  const wrapperStyle = useMemo(() => refOmittedStyle(chip), [chip])

  const omittedRefs = {
    refChipName: { children: `+${count} more` },
    refCard: { style: refChipHiddenCardStyle },
  }

  return (
    <Frame style={wrapperStyle}>
      <PanelRefs
        role="presentation"
        style={refChipPanelStyle}
        seldonRefs={omittedRefs}
        chipAssist={{}}
        textLabel={{}}
      />
    </Frame>
  )
}
