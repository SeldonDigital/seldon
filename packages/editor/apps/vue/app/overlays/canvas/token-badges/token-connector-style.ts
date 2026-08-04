import { CONNECTOR_Z_INDEX, MUTED_OPACITY } from "../ref-badges/connector-style"

import type { CSSProperties } from "vue"

/**
 * Styling for a token connector: the elbow and the anchor dot at its node end. The
 * badge it runs to is dressed by `token-badge-style`. Mirrors the React
 * `token-connector-style`.
 *
 * Token connectors paint with the primary swatch, where reference connectors paint
 * with the accent, so the two overlays read apart at a glance. The z-index and the
 * muted opacity are shared with the reference connectors, since the two draw on one
 * layer at the same faintness.
 */

export const tokenConnectorSvgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "visible",
  pointerEvents: "none",
  zIndex: CONNECTOR_Z_INDEX,
}

/**
 * Stroke for one elbow, as a style object rather than SVG attributes, because a
 * `var()` reference resolves in CSS and not in a presentation attribute.
 */
export const tokenConnectorStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-primary)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: 1,
}

export const tokenConnectorMutedStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-primary)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: MUTED_OPACITY,
  strokeDasharray: "3 3",
}

/** The dot marking where a connector meets its node. Paints as fill, not stroke. */
export const tokenConnectorAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-primary)",
  fillOpacity: 1,
}

export const tokenConnectorMutedAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-primary)",
  fillOpacity: MUTED_OPACITY,
}
