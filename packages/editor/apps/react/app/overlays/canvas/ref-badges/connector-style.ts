import type { CSSProperties } from "react"

/**
 * Styling for the connector itself: the elbow and the anchor dot at its node end.
 * The badge it runs to is dressed by `ref-badge-style`.
 *
 * Every style here is finished. A bound connector and an unbound one are separate
 * constants, so each reads as the values it paints with.
 */

/**
 * Above the selection and wireframe outlines so a connector is never buried, below
 * the insert indicator at 10, which is transient and must win while placing.
 *
 * The badge draws on this layer too, since the two are one mark.
 */
export const CONNECTOR_Z_INDEX = 5

/**
 * An unbound ref is drawn faint rather than in another color, and its badge is faded
 * to match.
 */
export const MUTED_OPACITY = 0.65

export const connectorSvgStyle: CSSProperties = {
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
export const connectorStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-accent)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: 1,
}

/** An unbound ref runs dashed and faint. The dash is in SVG user units, not pixels. */
export const connectorMutedStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-accent)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: MUTED_OPACITY,
  strokeDasharray: "3 3",
}

/** The dot marking where a connector meets its node. Paints as fill, not stroke. */
export const connectorAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-accent)",
  fillOpacity: 1,
}

export const connectorMutedAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-accent)",
  fillOpacity: MUTED_OPACITY,
}
