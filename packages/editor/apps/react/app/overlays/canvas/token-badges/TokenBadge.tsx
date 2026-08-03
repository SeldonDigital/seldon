import { Frame } from "@seldon/components/frames/Frame"
import { PanelToken } from "@seldon/components/modules/PanelToken"
import { useMemo } from "react"

import { TokenCardController } from "./TokenCardController"
import { useTokenCard } from "./hooks/use-token-card"
import {
  tokenBadgeBoxStyle,
  tokenBadgeHiddenCardStyle,
  tokenBadgeMeasureLabelStyle,
  tokenBadgeMeasureStyle,
  tokenBadgeMutedStyle,
  tokenBadgePanelStyle,
  tokenBadgeStyle,
} from "./token-badge-style"

import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"
import type { TokenBadgePlacement } from "@seldon/editor/lib/canvas/connectors/token-connectors"
import type { Ref } from "react"

interface TokenBadgeProps {
  placement: TokenBadgePlacement
  source: TokenSource
}

interface TokenBadgeMeasureProps {
  sources: TokenSource[]
  measureRef: Ref<HTMLElement>
}

/**
 * One property token at the end of a connector, opening its control card when clicked.
 *
 * The badge and the card are the same `PanelToken` component, drawn twice. This
 * instance hides the card half, and the card's instance fills it with the live
 * property control, so both surfaces take their look from one schema.
 *
 * The wrapper carries the placement and the click, because a module takes no `ref`.
 */
export function TokenBadge({ placement, source }: TokenBadgeProps) {
  const { badgeRef, cardRef, position, toggle, close } = useTokenCard(placement.badge)

  const wrapperStyle = useMemo(() => {
    if (placement.muted) return tokenBadgeMutedStyle(placement.badge)

    return tokenBadgeStyle(placement.badge)
  }, [placement.badge, placement.muted])

  const badgeRefs = {
    tokenChip: { style: tokenBadgeBoxStyle(placement.badge.width) },
    tokenChipName: { children: source.name },
    tokenChipValue: { children: source.value },
    tokenChipIcon: { icon: source.icon },
    tokenCard: { style: tokenBadgeHiddenCardStyle },
  }

  const card = useMemo(() => {
    if (!position) return null

    return (
      <TokenCardController
        propertyKey={source.propertyKey}
        position={position}
        onClose={close}
        cardRef={cardRef}
      />
    )
  }, [source.propertyKey, cardRef, close, position])

  return (
    <>
      <Frame ref={badgeRef} style={wrapperStyle} onClick={toggle}>
        <PanelToken
          role="presentation"
          style={tokenBadgePanelStyle}
          seldonRefs={badgeRefs}
          chipAssist={{}}
          textLabel={{}}
          textLabel2={{}}
        />
      </Frame>
      {card}
    </>
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
export function TokenBadgeMeasure({ sources, measureRef }: TokenBadgeMeasureProps) {
  const badges = sources.map((source) => {
    const measureRefs = {
      tokenChipName: { children: source.name, style: tokenBadgeMeasureLabelStyle },
      tokenChipValue: { children: source.value },
      tokenChipIcon: { icon: source.icon },
      tokenCard: { style: tokenBadgeHiddenCardStyle },
    }

    return (
      <PanelToken
        key={source.key}
        role="presentation"
        style={tokenBadgePanelStyle}
        seldonRefs={measureRefs}
        chipAssist={{}}
        textLabel={{}}
        textLabel2={{}}
      />
    )
  })

  return (
    <Frame ref={measureRef} style={tokenBadgeMeasureStyle}>
      {badges}
    </Frame>
  )
}
