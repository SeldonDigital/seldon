import { useSelection } from "@app/workspace/hooks/use-selection"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import { useCallback, useMemo } from "react"

import { RefCardController } from "./RefCardController"
import { useRefCard } from "./hooks/use-ref-card"
import {
  refChipBoxStyle,
  refChipHiddenCardStyle,
  refChipMeasureStyle,
  refChipMutedStyle,
  refChipPanelStyle,
  refChipStyle,
  refOmittedStyle,
} from "./ref-chip-style"

import type { InstanceId, VariantId } from "@seldon/core/workspace/types"
import type {
  ChipBox,
  ConnectorPlacement,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { Ref } from "react"

interface RefChipProps {
  placement: ConnectorPlacement
  binding: RefBinding
}

interface RefSummaryChipProps {
  placement: ConnectorPlacement
  nodeId: string
}

interface RefOmittedProps {
  chip: ChipBox
  count: number
}

interface RefChipMeasureProps {
  labels: string[]
  measureRef: Ref<HTMLElement>
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
  const { chipRef, cardRef, position, toggle, close } = useRefCard(placement.chip)

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return refChipMutedStyle(placement.chip)

    return refChipStyle(placement.chip)
  }, [placement.chip, placement.muted])

  const chipBox = useMemo(
    () => ({ style: refChipBoxStyle(placement.chip.width) }),
    [placement.chip.width],
  )

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
          chipAssist={chipBox}
          textLabel={{}}
        />
      </Frame>
      {card}
    </>
  )
}

/**
 * Stands in for the refs inside a frame, counting them rather than naming them.
 *
 * Clicking it selects the frame, which is all it does. The overlay draws the selected
 * node and its descendants, so selecting the frame redraws these refs one level in,
 * and the count is a way into them rather than a thing to read.
 */
export function RefSummaryChip({ placement, nodeId }: RefSummaryChipProps) {
  const { selectNode } = useSelection()

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return refChipMutedStyle(placement.chip)

    return refChipStyle(placement.chip)
  }, [placement.chip, placement.muted])

  const select = useCallback(
    () => selectNode(nodeId as VariantId | InstanceId),
    [nodeId, selectNode],
  )

  const chipBox = useMemo(
    () => ({ style: refChipBoxStyle(placement.chip.width) }),
    [placement.chip.width],
  )

  const summaryRefs = {
    refChipName: { children: placement.label },
    refCard: { style: refChipHiddenCardStyle },
  }

  return (
    <Frame style={wrapperStyle} onClick={select}>
      <PanelRefs
        role="presentation"
        style={refChipPanelStyle}
        seldonRefs={summaryRefs}
        chipAssist={chipBox}
        textLabel={{}}
      />
    </Frame>
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
  const chipBox = useMemo(() => ({ style: refChipBoxStyle(chip.width) }), [chip.width])

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
        chipAssist={chipBox}
        textLabel={{}}
      />
    </Frame>
  )
}

/**
 * Every chip drawn once more, hidden, and measured to place the drawn ones.
 *
 * A chip in the gutter is placed absolutely, so it can neither size itself to its
 * neighbors nor report a height and spacing the column could read before it is placed.
 * These are the same chips at their natural size, which is what the widest width, the
 * height, and the chip's own gap are taken from.
 */
export function RefChipMeasure({ labels, measureRef }: RefChipMeasureProps) {
  const chips = labels.map((label, index) => {
    const measureRefs = {
      refChipName: { children: label },
      refCard: { style: refChipHiddenCardStyle },
    }

    return (
      <PanelRefs
        key={`${label}#${index}`}
        role="presentation"
        style={refChipPanelStyle}
        seldonRefs={measureRefs}
        chipAssist={{}}
        textLabel={{}}
      />
    )
  })

  return (
    <Frame ref={measureRef} style={refChipMeasureStyle}>
      {chips}
    </Frame>
  )
}
