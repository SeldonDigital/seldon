import { CONNECTOR_Z_INDEX, MUTED_BADGE_FILTER } from "../ref-badges/connector-style"

import type { BadgeBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "react"

/**
 * Where a token badge sits in the gutter, and how its state reads. Its surface, type,
 * and spacing come from the `PanelToken` schema, so only placement and state are set
 * here.
 *
 * A badge is placed from a measured box, so these are functions rather than constants.
 * The box is anchored by its vertical center, which `connector-layout` measured as
 * `centerY`, so the connector meets the middle of the badge whatever height the schema
 * gives it.
 */

/**
 * Drops the panel's own board box, so the badge is laid out by the wrapper that places
 * it in the gutter rather than by the frame the panel is drawn on.
 */
export const tokenBadgePanelStyle: CSSProperties = { display: "contents" }

/** Suppresses the card half of a badge's panel instance. */
export const tokenBadgeHiddenCardStyle: CSSProperties = { display: "none" }

/**
 * The hidden badges the column's metrics are measured from. Each is drawn at the width
 * its own label asks for, so the widest reports the width every badge then takes.
 */
export const tokenBadgeMeasureStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "grid",
  justifyItems: "start",
  visibility: "hidden",
  pointerEvents: "none",
}

/** The label in a measured badge, sized to its own text. */
export const tokenBadgeMeasureLabelStyle: CSSProperties = { flex: "0 0 auto" }

/**
 * The badge's own box, held at the width the column shares. The schema draws it at
 * `fit-content` from the start edge, so the width is set here and the slack is put
 * between the label and the icon, keeping the icons in line down the column.
 */
export function tokenBadgeBoxStyle(width: number): CSSProperties {
  return {
    width: `${width}px`,
    justifyContent: "space-between",
  }
}

/**
 * A token badge. Interactive on purpose, unlike every other canvas overlay, because
 * clicking it opens the token card.
 */
export function tokenBadgeStyle(badge: BadgeBox): CSSProperties {
  return {
    position: "absolute",
    top: `${badge.centerY}px`,
    left: `${badge.left}px`,
    transform: "translateY(-50%)",
    zIndex: CONNECTOR_Z_INDEX,
    opacity: 1,
    pointerEvents: "auto",
    cursor: "pointer",
  }
}

/**
 * A dimmed token badge, for a property whose value is default or inherited. It reads
 * faint like an omitted reference, but still opens its card so the value can be set.
 */
export function tokenBadgeMutedStyle(badge: BadgeBox): CSSProperties {
  return {
    position: "absolute",
    top: `${badge.centerY}px`,
    left: `${badge.left}px`,
    transform: "translateY(-50%)",
    zIndex: CONNECTOR_Z_INDEX,
    filter: MUTED_BADGE_FILTER,
    pointerEvents: "auto",
    cursor: "pointer",
  }
}
