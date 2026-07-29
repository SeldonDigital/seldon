import { ConnectorPaths } from "@app/overlays/primitives"
import { toElbowPath } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { useMemo } from "react"

import { RefBadge, RefBadgeMeasure, RefOmitted, RefSummaryBadge } from "./RefBadge"
import {
  connectorAnchorStyle,
  connectorMutedAnchorStyle,
  connectorMutedStrokeStyle,
  connectorStrokeStyle,
  connectorSvgStyle,
} from "./connector-style"
import { useRefConnector } from "./hooks/use-ref-connector"

import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.bespoke"
import type { ConnectorPlacement } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { PlacedConnector } from "@seldon/editor/lib/canvas/connectors/ref-connectors"
import type { ReactNode } from "react"

/**
 * Draws the refs inside the selected component out to named badges.
 *
 * A ref with no consumers still draws, faint and dashed. That a ref reached generated
 * code but nothing drives it is the useful thing to see.
 *
 * The hidden measured set stays mounted whether or not a column drew. Badges are placed
 * from what that set reports, so unmounting it with the column would leave the next
 * selection with nothing to measure.
 */
export function RefConnector() {
  const { entries, canvasSize, omitted, omittedBadge, anchorRadius, labels, measureRef } =
    useRefConnector()

  const shapes = useMemo(
    () => entries.map((entry) => toShape(entry, anchorRadius)),
    [entries, anchorRadius],
  )

  const badgeElements = useMemo(() => entries.map(toBadge), [entries])

  const omittedElement = useMemo(() => {
    if (!omittedBadge) return null

    return <RefOmitted badge={omittedBadge} count={omitted} />
  }, [omitted, omittedBadge])

  const column = useMemo(() => {
    if (entries.length === 0) return null

    return (
      <>
        <ConnectorPaths
          shapes={shapes}
          width={canvasSize.width}
          height={canvasSize.height}
          style={connectorSvgStyle}
        />
        {badgeElements}
        {omittedElement}
      </>
    )
  }, [entries.length, shapes, badgeElements, omittedElement, canvasSize.width, canvasSize.height])

  return (
    <>
      {column}
      <RefBadgeMeasure labels={labels} measureRef={measureRef} />
    </>
  )
}

function toBadge(entry: PlacedConnector): ReactNode {
  if (entry.kind === "summary") {
    return (
      <RefSummaryBadge
        key={entry.placement.key}
        placement={entry.placement}
        nodeId={entry.nodeId}
      />
    )
  }

  return <RefBadge key={entry.placement.key} placement={entry.placement} binding={entry.binding} />
}

function toShape(
  { placement }: { placement: ConnectorPlacement },
  anchorRadius: number,
): ConnectorShape {
  const strokeStyle = placement.muted ? connectorMutedStrokeStyle : connectorStrokeStyle
  const anchorStyle = placement.muted ? connectorMutedAnchorStyle : connectorAnchorStyle

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
