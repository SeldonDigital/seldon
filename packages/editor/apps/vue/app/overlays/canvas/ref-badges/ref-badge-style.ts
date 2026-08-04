import { CONNECTOR_Z_INDEX, MUTED_BADGE_FILTER } from "./connector-style"

import type { BadgeBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "vue"

/**
 * Where a badge sits in the gutter, and how its state reads. Its surface, type, and
 * spacing come from the `PanelRefs` schema, so only placement and state are set here.
 *
 * A badge is placed from a measured box, so these are functions rather than constants,
 * but each returns one flat set of values with nothing to work out. Each state is its
 * own function: the caller picks the state, and the style does not decide it.
 *
 * The box is anchored by its vertical center, which `connector-layout` measured as
 * `centerY`, so the connector meets the middle of the badge whatever height the schema
 * gives it. Mirrors the React `ref-badge-style`.
 */

/**
 * Drops the panel's own board box, so the badge is laid out by the wrapper that places
 * it in the gutter rather than by the frame the panel is drawn on.
 */
export const refBadgePanelStyle: CSSProperties = { display: "contents" }

/** Suppresses the card half of a badge's panel instance. */
export const refBadgeHiddenCardStyle: CSSProperties = { display: "none" }

/**
 * The hidden badges the column's metrics are measured from. Each is drawn at the width
 * its own label asks for, so the widest reports the width every badge then takes.
 */
export const refBadgeMeasureStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "grid",
  justifyItems: "start",
  visibility: "hidden",
  pointerEvents: "none",
}

/**
 * The label in a measured badge, sized to its own text.
 *
 * The schema tells the label to fill its badge, which is what holds the icon at the end
 * of a badge drawn at the column's width. A filling label reports no width of its own
 * though, since it is free to sit narrower than its text, so the copies the column is
 * measured from ask theirs for the text instead. Only those copies size this way. A
 * drawn badge keeps the filling label, and takes the width measured here.
 */
export const refBadgeMeasureLabelStyle: CSSProperties = { flex: "0 0 auto" }

/**
 * The badge's own box, held at the width the column shares. The schema draws it at
 * `fit-content` from the start edge, so the width is set here and the slack is put
 * between the label and the icon, keeping the icons in line down the column.
 */
export function refBadgeBoxStyle(width: number): CSSProperties {
  return {
    width: `${width}px`,
    justifyContent: "space-between",
  }
}

/**
 * A bound badge. Interactive on purpose, unlike every other canvas overlay, because
 * clicking it opens the ref card.
 */
export function refBadgeStyle(badge: BadgeBox): CSSProperties {
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

/** A badge for a ref that no code drives. It still opens its card, which says so. */
export function refBadgeMutedStyle(badge: BadgeBox): CSSProperties {
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

/** The count of refs that did not fit. It carries no connector and opens no card. */
export function refOmittedStyle(badge: BadgeBox): CSSProperties {
  return {
    position: "absolute",
    top: `${badge.centerY}px`,
    left: `${badge.left}px`,
    transform: "translateY(-50%)",
    zIndex: CONNECTOR_Z_INDEX,
    filter: MUTED_BADGE_FILTER,
    pointerEvents: "none",
  }
}
