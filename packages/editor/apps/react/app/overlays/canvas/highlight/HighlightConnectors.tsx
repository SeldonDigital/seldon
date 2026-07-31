"use client"

import { ConnectorPaths } from "@app/overlays/primitives"

import { highlightConnectorSvgStyle } from "./highlight-connector-style"
import { useHighlightConnectors } from "./hooks/use-highlight-connectors"

/**
 * Draws the selected node's branch across the isolation gallery.
 *
 * The objects sidebar tints the same nodes in its rows. This answers the same
 * question on the canvas: which boards the selection reaches, and where on each
 * of them. Lines run through the gutters between boards and only cross a board
 * to leave the selection and to land on what they point at.
 */
export function HighlightConnectors() {
  const { shapes, canvasSize } = useHighlightConnectors()

  if (shapes.length === 0) return null

  return (
    <ConnectorPaths
      shapes={shapes}
      width={canvasSize.width}
      height={canvasSize.height}
      style={highlightConnectorSvgStyle}
    />
  )
}
