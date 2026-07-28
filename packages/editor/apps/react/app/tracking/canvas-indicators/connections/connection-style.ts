import type { ConnectionChipBox } from "@seldon/editor/lib/canvas/connections/connection-layout"
import type { CSSProperties } from "react"

/**
 * Above the selection and wireframe outlines so a chip is never buried, below the
 * insert indicator at 10, which is transient and must win while placing.
 */
const CONNECTION_Z_INDEX = 5

/** Connector stroke and chip fill. A canvas swatch, matching the outline overlays. */
const CONNECTION_COLOR = "var(--sdn-swatch-accent)"

/** An unbound ref is drawn faint rather than in another color. */
const MUTED_OPACITY = 0.45

export const connectionSvgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "visible",
  pointerEvents: "none",
  zIndex: CONNECTION_Z_INDEX,
}

export interface ConnectionStrokeStyle {
  stroke: string
  strokeWidth: number
  strokeOpacity: number
  strokeDasharray?: string
}

/** Stroke for one elbow. Unbound refs run dashed and faint. */
export function connectionStrokeStyle(muted: boolean): ConnectionStrokeStyle {
  return {
    stroke: CONNECTION_COLOR,
    strokeWidth: 1,
    strokeOpacity: muted ? MUTED_OPACITY : 1,
    strokeDasharray: muted ? "3 3" : undefined,
  }
}

/**
 * The chip label box. Interactive on purpose, unlike every other canvas overlay,
 * because hovering it opens the detail card.
 */
export function connectionChipStyle(chip: ConnectionChipBox, muted: boolean): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.top}px`,
    left: `${chip.left}px`,
    width: `${chip.width}px`,
    height: `${chip.height}px`,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    padding: "0 6px",
    borderRadius: "3px",
    backgroundColor: CONNECTION_COLOR,
    color: "var(--sdn-swatch-offWhite)",
    fontFamily: "var(--sdn-font-family-primary), system-ui, sans-serif",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    opacity: muted ? MUTED_OPACITY : 1,
    pointerEvents: "auto",
    cursor: "default",
    zIndex: CONNECTION_Z_INDEX,
  }
}

/**
 * The detail card, fixed to the viewport and portaled to the body so it escapes
 * the canvas stacking context and is never clipped by a board.
 */
export function connectionHoverCardStyle(position: { top: number; left: number }): CSSProperties {
  return {
    position: "fixed",
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 2147483000,
    maxWidth: "420px",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid var(--sdn-swatch-primary)",
    backgroundColor: "var(--sdn-swatch-offBlack)",
    color: "var(--sdn-swatch-offWhite)",
    fontFamily: "var(--sdn-font-family-primary), system-ui, sans-serif",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.4,
    pointerEvents: "none",
    boxShadow: "0 4px 12px rgb(0 0 0 / 35%)",
  }
}

export const hoverCardTitleStyle: CSSProperties = {
  fontWeight: "var(--sdn-font-weight-bold)",
  marginBottom: "4px",
}

export const hoverCardSectionStyle: CSSProperties = {
  marginTop: "6px",
  opacity: 0.7,
}

export const hoverCardRowStyle: CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}

/** Supporting detail under a heading row, such as an expression or its inputs. */
export const hoverCardDimRowStyle: CSSProperties = {
  ...hoverCardRowStyle,
  paddingLeft: "10px",
  opacity: 0.7,
}
