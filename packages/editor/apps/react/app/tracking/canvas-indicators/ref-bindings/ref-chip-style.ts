import { CONNECTOR_COLOR, CONNECTOR_Z_INDEX, MUTED_OPACITY } from "./connector-style"

import type { ChipBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/**
 * Styling for the chips a connector runs to. They take the connector's color and
 * stacking so the line and its label read as one mark.
 */

/**
 * The chip label box. Interactive on purpose, unlike every other canvas overlay,
 * because clicking it opens the ref card.
 */
export function refChipStyle(chip: ChipBox, muted: boolean): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.top}px`,
    left: `${chip.left}px`,
    width: `${chip.width}px`,
    height: `${chip.height}px`,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    padding: "0 var(--sdn-paddings-tight)",
    borderRadius: "var(--sdn-corners-tight)",
    backgroundColor: CONNECTOR_COLOR,
    color: "var(--sdn-swatch-offWhite)",
    fontFamily: "var(--sdn-font-family-primary), system-ui, sans-serif",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: "var(--sdn-line-height-tight)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    opacity: muted ? MUTED_OPACITY : 1,
    pointerEvents: "auto",
    cursor: "pointer",
    zIndex: CONNECTOR_Z_INDEX,
  }
}
