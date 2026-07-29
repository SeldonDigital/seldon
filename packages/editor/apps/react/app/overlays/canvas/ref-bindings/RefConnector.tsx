import { ConnectorPaths } from "@app/overlays/primitives"
import {
  CONNECTOR_ANCHOR_RADIUS,
  toElbowPath,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { useMemo } from "react"

import { RefChip, RefOmitted, RefSummaryChip } from "./RefChip"
import {
  connectorAnchorStyle,
  connectorMutedAnchorStyle,
  connectorMutedStrokeStyle,
  connectorStrokeStyle,
  connectorSvgStyle,
} from "./connector-style"
import { useRefConnector } from "./hooks/use-ref-connector"

import type { PlacedConnector } from "./hooks/use-ref-connector"
import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.bespoke"
import type { ConnectorPlacement } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { ReactNode } from "react"

/**
 * Draws the refs inside the selected component out to named chips.
 *
 * A ref with no consumers still draws, faint and dashed. That a ref reached generated
 * code but nothing drives it is the useful thing to see.
 */
export function RefConnector() {
  const { entries, canvasSize, omitted, omittedChip } = useRefConnector()

  const shapes = useMemo(() => entries.map(toShape), [entries])

  const chipElements = useMemo(() => entries.map(toChip), [entries])

  const omittedElement = useMemo(() => {
    if (!omittedChip) return null

    return <RefOmitted chip={omittedChip} count={omitted} />
  }, [omitted, omittedChip])

  if (entries.length === 0) return null

  const { width, height } = canvasSize

  return (
    <>
      <ConnectorPaths shapes={shapes} width={width} height={height} style={connectorSvgStyle} />
      {chipElements}
      {omittedElement}
    </>
  )
}

function toChip(entry: PlacedConnector): ReactNode {
  if (entry.kind === "frame") {
    return (
      <RefSummaryChip key={entry.placement.key} placement={entry.placement} nodeId={entry.nodeId} />
    )
  }

  return <RefChip key={entry.placement.key} placement={entry.placement} binding={entry.binding} />
}

function toShape({ placement }: { placement: ConnectorPlacement }): ConnectorShape {
  const strokeStyle = placement.muted ? connectorMutedStrokeStyle : connectorStrokeStyle
  const anchorStyle = placement.muted ? connectorMutedAnchorStyle : connectorAnchorStyle

  return {
    key: placement.key,
    d: toElbowPath(placement.points),
    anchorX: placement.anchor.x,
    anchorY: placement.anchor.y,
    anchorRadius: CONNECTOR_ANCHOR_RADIUS,
    strokeStyle,
    anchorStyle,
  }
}
