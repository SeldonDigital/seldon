import { useSelection } from "@app/workspace/hooks/use-selection"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import { useCallback, useMemo } from "react"

import { RefCardController } from "./RefCardController"
import { useRefCard } from "./hooks/use-ref-card"
import {
  refBadgeBoxStyle,
  refBadgeHiddenCardStyle,
  refBadgeMeasureStyle,
  refBadgeMutedStyle,
  refBadgePanelStyle,
  refBadgeStyle,
  refOmittedStyle,
} from "./ref-badge-style"

import type { InstanceId, VariantId } from "@seldon/core/workspace/types"
import type {
  BadgeBox,
  ConnectorPlacement,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { Ref } from "react"

interface RefBadgeProps {
  placement: ConnectorPlacement
  binding: RefBinding
}

interface RefSummaryBadgeProps {
  placement: ConnectorPlacement
  nodeId: string
}

interface RefOmittedProps {
  badge: BadgeBox
  count: number
}

interface RefBadgeMeasureProps {
  labels: string[]
  measureRef: Ref<HTMLElement>
}

/**
 * The ref name at the end of a connector, opening its card when clicked.
 *
 * The badge and the card are the same `PanelRefs` component, drawn twice. This instance
 * hides the card half and the card's instance leaves the badge out, so both surfaces
 * take their look from one schema.
 *
 * The wrapper carries the placement and the click, because a module takes no `ref`.
 *
 * `chipAssist` and `refChipName` are the schema's own names for the badge slot and its
 * label, so they read as chip here until the workspace renames them.
 */
export function RefBadge({ placement, binding }: RefBadgeProps) {
  const { badgeRef, cardRef, position, toggle, close } = useRefCard(placement.badge)

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return refBadgeMutedStyle(placement.badge)

    return refBadgeStyle(placement.badge)
  }, [placement.badge, placement.muted])

  const badgeBox = useMemo(
    () => ({ style: refBadgeBoxStyle(placement.badge.width) }),
    [placement.badge.width],
  )

  const badgeRefs = {
    refChipName: { children: placement.label },
    refCard: { style: refBadgeHiddenCardStyle },
  }

  const card = useMemo(() => {
    if (!position) return null

    return (
      <RefCardController binding={binding} position={position} onClose={close} cardRef={cardRef} />
    )
  }, [binding, cardRef, close, position])

  return (
    <>
      <Frame ref={badgeRef} style={wrapperStyle} onClick={toggle}>
        <PanelRefs
          role="presentation"
          style={refBadgePanelStyle}
          seldonRefs={badgeRefs}
          chipAssist={badgeBox}
          textLabel={{}}
        />
      </Frame>
      {card}
    </>
  )
}

/**
 * Stands in for the refs one node holds, counting them rather than naming them.
 *
 * Clicking it selects that node, which is all it does. The overlay draws the selected
 * node and its descendants, so selecting it redraws these refs one level in, and the
 * count is a way into them rather than a thing to read.
 */
export function RefSummaryBadge({ placement, nodeId }: RefSummaryBadgeProps) {
  const { selectNode } = useSelection()

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return refBadgeMutedStyle(placement.badge)

    return refBadgeStyle(placement.badge)
  }, [placement.badge, placement.muted])

  const select = useCallback(
    () => selectNode(nodeId as VariantId | InstanceId),
    [nodeId, selectNode],
  )

  const badgeBox = useMemo(
    () => ({ style: refBadgeBoxStyle(placement.badge.width) }),
    [placement.badge.width],
  )

  const summaryRefs = {
    refChipName: { children: placement.label },
    refCard: { style: refBadgeHiddenCardStyle },
  }

  return (
    <Frame style={wrapperStyle} onClick={select}>
      <PanelRefs
        role="presentation"
        style={refBadgePanelStyle}
        seldonRefs={summaryRefs}
        chipAssist={badgeBox}
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
export function RefOmitted({ badge, count }: RefOmittedProps) {
  const wrapperStyle = useMemo(() => refOmittedStyle(badge), [badge])
  const badgeBox = useMemo(() => ({ style: refBadgeBoxStyle(badge.width) }), [badge.width])

  const omittedRefs = {
    refChipName: { children: `+${count} more` },
    refCard: { style: refBadgeHiddenCardStyle },
  }

  return (
    <Frame style={wrapperStyle}>
      <PanelRefs
        role="presentation"
        style={refBadgePanelStyle}
        seldonRefs={omittedRefs}
        chipAssist={badgeBox}
        textLabel={{}}
      />
    </Frame>
  )
}

/**
 * Every badge drawn once more, hidden, and measured to place the drawn ones.
 *
 * A badge in the gutter is placed absolutely, so it can neither size itself to its
 * neighbors nor report a height and spacing the column could read before it is placed.
 * These are the same badges at their natural size, which is what the widest width, the
 * height, and the badge's own gap are taken from.
 */
export function RefBadgeMeasure({ labels, measureRef }: RefBadgeMeasureProps) {
  const badges = labels.map((label, index) => {
    const measureRefs = {
      refChipName: { children: label },
      refCard: { style: refBadgeHiddenCardStyle },
    }

    return (
      <PanelRefs
        key={`${label}#${index}`}
        role="presentation"
        style={refBadgePanelStyle}
        seldonRefs={measureRefs}
        chipAssist={{}}
        textLabel={{}}
      />
    )
  })

  return (
    <Frame ref={measureRef} style={refBadgeMeasureStyle}>
      {badges}
    </Frame>
  )
}
