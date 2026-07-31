import type { CSSProperties } from "react"

/**
 * Styling for the connectors that draw the selected node's branch across the
 * isolation gallery.
 *
 * The color is the same `active` swatch the objects sidebar tints its rows with,
 * so the canvas and the sidebar read as one highlight. Primary lineage runs
 * solid, and the template chain runs dashed and faint, matching the sidebar's two
 * strengths.
 */

/**
 * Above the selection and wireframe outlines at 1, below the ref connectors at 5
 * so a ref badge and its line stay legible when both overlays are on.
 */
export const HIGHLIGHT_CONNECTOR_Z_INDEX = 4

/** The template chain is drawn faint rather than in another color. */
export const SECONDARY_OPACITY = 0.75

export const highlightConnectorSvgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "visible",
  pointerEvents: "none",
  zIndex: HIGHLIGHT_CONNECTOR_Z_INDEX,
}

export const highlightStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-active)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: 1,
}

/** The dash is in SVG user units, not pixels. */
export const highlightSecondaryStrokeStyle: CSSProperties = {
  fill: "none",
  stroke: "var(--sdn-swatch-active)",
  strokeWidth: "var(--sdn-border-width-small)",
  strokeOpacity: SECONDARY_OPACITY,
  strokeDasharray: "3 3",
}

/** The dot marking where a connector lands on its node. Paints as fill, not stroke. */
export const highlightAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-active)",
  fillOpacity: 1,
}

export const highlightSecondaryAnchorStyle: CSSProperties = {
  fill: "var(--sdn-swatch-active)",
  fillOpacity: SECONDARY_OPACITY,
}
