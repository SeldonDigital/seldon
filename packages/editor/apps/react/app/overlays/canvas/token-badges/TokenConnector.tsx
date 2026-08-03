import { ConnectorPaths } from "@app/overlays/primitives"
import { toElbowPath } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { useMemo } from "react"

import { TokenBadge, TokenBadgeMeasure } from "./TokenBadge"
import {
  tokenConnectorAnchorStyle,
  tokenConnectorMutedAnchorStyle,
  tokenConnectorMutedStrokeStyle,
  tokenConnectorStrokeStyle,
  tokenConnectorSvgStyle,
} from "./token-connector-style"
import { useTokenConnector } from "./hooks/use-token-connector"

import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.bespoke"
import type { PlacedToken } from "./hooks/use-token-connector"

/**
 * Draws the selection's property tokens out to named badges in the gutter.
 *
 * The hidden measured set stays mounted whether or not a column drew. Badges are placed
 * from what that set reports, so unmounting it with the column would leave the next
 * selection with nothing to measure.
 */
export function TokenConnector() {
  const { entries, canvasSize, anchorRadius, sources, measureRef } = useTokenConnector()

  const shapes = useMemo(
    () => entries.map((entry) => toShape(entry, anchorRadius)),
    [entries, anchorRadius],
  )

  const badgeElements = useMemo(
    () => entries.map((entry) => <TokenBadge key={entry.source.key} {...entry} />),
    [entries],
  )

  const column = useMemo(() => {
    if (entries.length === 0) return null

    return (
      <>
        <ConnectorPaths
          shapes={shapes}
          width={canvasSize.width}
          height={canvasSize.height}
          style={tokenConnectorSvgStyle}
        />
        {badgeElements}
      </>
    )
  }, [entries.length, shapes, badgeElements, canvasSize.width, canvasSize.height])

  return (
    <>
      {column}
      <TokenBadgeMeasure sources={sources} measureRef={measureRef} />
    </>
  )
}

function toShape({ placement }: PlacedToken, anchorRadius: number): ConnectorShape {
  const strokeStyle = placement.muted ? tokenConnectorMutedStrokeStyle : tokenConnectorStrokeStyle
  const anchorStyle = placement.muted ? tokenConnectorMutedAnchorStyle : tokenConnectorAnchorStyle

  return {
    key: placement.key,
    d: toElbowPath(placement.points),
    anchorX: placement.anchor.x,
    anchorY: placement.anchor.y,
    anchorRadius,
    strokeStyle,
    anchorStyle,
  }
}
