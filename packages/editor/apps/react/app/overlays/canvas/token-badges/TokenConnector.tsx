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
import type {
  TokenStubGeometry,
  TokenTrunkGeometry,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"

/**
 * Draws the selection's property tokens out to named badges in the gutter.
 *
 * The hidden measured set stays mounted whether or not a column drew. Badges are placed
 * from what that set reports, so unmounting it with the column would leave the next
 * selection with nothing to measure.
 */
export function TokenConnector() {
  const { entries, geometry, canvasSize, anchorRadius, sources, measureRef } = useTokenConnector()

  const shapes = useMemo(() => {
    const stubShapes = geometry.stubs.map(toStubShape)
    const trunkShapes = geometry.trunks.flatMap((trunk) => toTrunkShapes(trunk, anchorRadius))

    return [...stubShapes, ...trunkShapes]
  }, [geometry, anchorRadius])

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

/** A badge's stub. It carries no dot of its own, so the anchor is drawn at radius 0. */
function toStubShape(stub: TokenStubGeometry): ConnectorShape {
  return {
    key: `token-stub:${stub.key}`,
    d: toElbowPath(stub.points),
    anchorX: 0,
    anchorY: 0,
    anchorRadius: 0,
    strokeStyle: stub.muted ? tokenConnectorMutedStrokeStyle : tokenConnectorStrokeStyle,
    anchorStyle: tokenConnectorAnchorStyle,
  }
}

/**
 * A group's single connector to the object, drawn as one shape per run so each bus piece
 * keeps its own dashed or solid stroke. The dot where the trunk meets the node rides on the
 * first run, the elbow, and the rest draw the bus with no dot of their own.
 */
function toTrunkShapes(trunk: TokenTrunkGeometry, anchorRadius: number): ConnectorShape[] {
  const anchorStyle = trunk.muted ? tokenConnectorMutedAnchorStyle : tokenConnectorAnchorStyle

  return trunk.segments.map((segment, index) => {
    const strokeStyle = segment.muted ? tokenConnectorMutedStrokeStyle : tokenConnectorStrokeStyle
    const carriesAnchor = index === 0

    return {
      key: `token-trunk:${trunk.key}:${index}`,
      d: toElbowPath(segment.points),
      anchorX: trunk.anchor.x,
      anchorY: trunk.anchor.y,
      anchorRadius: carriesAnchor ? anchorRadius : 0,
      strokeStyle,
      anchorStyle,
    }
  })
}
