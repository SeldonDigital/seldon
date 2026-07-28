import { DETAIL_CARD_MAX_WIDTH } from "@seldon/editor/lib/canvas/connections/connection-layout"

import type {
  ConnectionChipBox,
  DetailCardPosition,
} from "@seldon/editor/lib/canvas/connections/connection-layout"
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
 * because clicking it opens the detail card.
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
    cursor: "pointer",
    zIndex: CONNECTION_Z_INDEX,
  }
}

/**
 * The detail card, fixed to the viewport and portaled to the body so it escapes
 * the canvas stacking context and is never clipped by a board.
 *
 * One of `top` and `bottom` is set, whichever side of the chip the card opens on.
 * It takes pointer events, unlike the rest of the overlay, so it can be scrolled
 * and so a click inside it is not mistaken for a click away.
 */
export function connectionDetailCardStyle(position: DetailCardPosition): CSSProperties {
  return {
    position: "fixed",
    top: position.top === undefined ? undefined : `${position.top}px`,
    bottom: position.bottom === undefined ? undefined : `${position.bottom}px`,
    left: `${position.left}px`,
    zIndex: 2147483000,
    maxWidth: `${DETAIL_CARD_MAX_WIDTH}px`,
    maxHeight: `${position.maxHeight}px`,
    overflowY: "auto",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid var(--sdn-swatch-primary)",
    backgroundColor: "var(--sdn-swatch-offBlack)",
    color: "var(--sdn-swatch-offWhite)",
    fontFamily: "var(--sdn-font-family-primary), system-ui, sans-serif",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.4,
    pointerEvents: "auto",
    boxShadow: "0 4px 12px rgb(0 0 0 / 35%)",
  }
}

export const detailCardTitleStyle: CSSProperties = {
  fontWeight: "var(--sdn-font-weight-bold)",
  marginBottom: "4px",
}

export const detailCardSectionStyle: CSSProperties = {
  marginTop: "6px",
  opacity: 0.7,
}

export const detailCardRowStyle: CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}

/** Supporting detail under a heading row, such as an expression or its inputs. */
export const detailCardDimRowStyle: CSSProperties = {
  ...detailCardRowStyle,
  paddingLeft: "10px",
  opacity: 0.7,
}
