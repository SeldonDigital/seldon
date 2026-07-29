import { CONNECTOR_Z_INDEX, MUTED_OPACITY } from "./connector-style"

import type { ChipBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/**
 * Where a chip sits in the gutter, and how its state reads. Its surface, type, and
 * spacing come from the `PanelRefs` schema, so only placement and state are set here.
 *
 * A chip is placed from a measured box, so these are functions rather than constants,
 * but each returns one flat set of values with nothing to work out. Each state is its
 * own function: the caller picks the state, and the style does not decide it.
 *
 * The box is anchored by its vertical center, which `connector-layout` measured as
 * `centerY`, so the connector meets the middle of the chip whatever height the schema
 * gives it.
 */

/**
 * Drops the panel's own board box, so the chip is laid out by the wrapper that places
 * it in the gutter rather than by the frame the panel is drawn on.
 */
export const refChipPanelStyle: CSSProperties = { display: "contents" }

/** Suppresses the card half of a chip's panel instance. */
export const refChipHiddenCardStyle: CSSProperties = { display: "none" }

/**
 * A bound chip. Interactive on purpose, unlike every other canvas overlay, because
 * clicking it opens the ref card.
 */
export function refChipStyle(chip: ChipBox): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.centerY}px`,
    left: `${chip.left}px`,
    transform: "translateY(-50%)",
    maxWidth: `${chip.width}px`,
    zIndex: CONNECTOR_Z_INDEX,
    opacity: 1,
    pointerEvents: "auto",
    cursor: "pointer",
  }
}

/** A chip for a ref that no code drives. It still opens its card, which says so. */
export function refChipMutedStyle(chip: ChipBox): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.centerY}px`,
    left: `${chip.left}px`,
    transform: "translateY(-50%)",
    maxWidth: `${chip.width}px`,
    zIndex: CONNECTOR_Z_INDEX,
    opacity: MUTED_OPACITY,
    pointerEvents: "auto",
    cursor: "pointer",
  }
}

/** The count of refs that did not fit. It carries no connector and opens no card. */
export function refOmittedStyle(chip: ChipBox): CSSProperties {
  return {
    position: "absolute",
    top: `${chip.centerY}px`,
    left: `${chip.left}px`,
    transform: "translateY(-50%)",
    maxWidth: `${chip.width}px`,
    zIndex: CONNECTOR_Z_INDEX,
    opacity: MUTED_OPACITY,
    pointerEvents: "none",
  }
}
