import type { CSSProperties } from "react"

/**
 * Styling for the connector itself: the elbow and the anchor dot at its node end.
 * The chip it runs to is dressed by `ref-chip-style`, and the card that chip opens
 * by `ref-card-style`.
 */

/**
 * Above the selection and wireframe outlines so a connector is never buried, below
 * the insert indicator at 10, which is transient and must win while placing.
 */
export const CONNECTOR_Z_INDEX = 5

/** Connector stroke, shared with the chip fill so the two read as one mark. */
export const CONNECTOR_COLOR = "var(--sdn-swatch-accent)"

/** An unbound ref is drawn faint rather than in another color. */
export const MUTED_OPACITY = 0.65

/** Dash pattern for an unbound connector, in SVG user units rather than pixels. */
const MUTED_DASH = "3 3"

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
 *
 * Unbound refs run dashed and faint.
 */
export function connectorStrokeStyle(muted: boolean): CSSProperties {
  return {
    fill: "none",
    stroke: CONNECTOR_COLOR,
    strokeWidth: "var(--sdn-border-width-small)",
    strokeOpacity: muted ? MUTED_OPACITY : 1,
    strokeDasharray: muted ? MUTED_DASH : undefined,
  }
}

/** The dot marking where a connector meets its node. Paints as fill, not stroke. */
export function connectorAnchorStyle(muted: boolean): CSSProperties {
  return {
    fill: CONNECTOR_COLOR,
    fillOpacity: muted ? MUTED_OPACITY : 1,
  }
}
