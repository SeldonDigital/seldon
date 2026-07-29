import { CONNECTOR_Z_INDEX, MUTED_OPACITY } from "./connector-style"

import type { ChipBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/**
 * Where a chip sits in the gutter. Its surface, type, and spacing come from the
 * `PanelRefs` schema, so only placement and state are set here.
 */

/**
 * Drops the panel's own board box, so the chip is laid out by the wrapper that places
 * it in the gutter rather than by the frame the panel is drawn on.
 */
export const refChipPanelStyle: CSSProperties = { display: "contents" }

/** Suppresses the card half of a chip's panel instance. */
export const refChipHiddenCardStyle: CSSProperties = { display: "none" }

/**
 * The chip box. Interactive on purpose, unlike every other canvas overlay, because
 * clicking it opens the ref card.
 *
 * Placed by its vertical center rather than its top edge, so the connector meets the
 * middle of the chip whatever height the schema gives it.
 */
export function refChipStyle(chip: ChipBox, muted: boolean): CSSProperties {
  return {
    ...chipBox(chip),
    opacity: muted ? MUTED_OPACITY : 1,
    pointerEvents: "auto",
    cursor: "pointer",
  }
}

/** The count of refs that did not fit. It carries no connector and opens no card. */
export function refOmittedStyle(chip: ChipBox): CSSProperties {
  return {
    ...chipBox(chip),
    opacity: MUTED_OPACITY,
    pointerEvents: "none",
  }
}

function chipBox(chip: ChipBox): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.top + chip.height / 2}px`,
    left: `${chip.left}px`,
    transform: "translateY(-50%)",
    maxWidth: `${chip.width}px`,
    zIndex: CONNECTOR_Z_INDEX,
  }
}
