import { CSSObject } from "../../styles/css-properties/types"

export type Classes = { [className: string]: CSSObject }
export type NodeIdToClass = Record<string, string>

/**
 * Per-class interaction-state rules. Keyed by class name, then by state name.
 * Each entry is the CSS delta of that state against the class's Normal rule.
 * Empty deltas are omitted. The CSS generator maps each state name to a
 * selector suffix when emitting these rules.
 */
export type StateClasses = {
  [className: string]: { [stateName: string]: CSSObject }
}

/**
 * Root-scoped interaction-state rules. A container row owns the interaction and
 * cascades it to its descendants, so each rule is keyed by the interaction
 * root's class, then by state name, then by the descendant class the delta
 * targets. A `null` descendant targets the root element itself.
 *
 * The CSS generator emits `.{rootClass}{ancestorSuffix} .{descendantClass}` for
 * descendant rules and `.{rootClass}{ancestorSuffix}` for the root's own delta,
 * reproducing the canvas board preview where hovering or focusing the row
 * restyles the whole subtree.
 */
export type RootScopedStateRule = {
  /** Descendant class the delta targets, or `null` for the root element. */
  descendantClass: string | null
  css: CSSObject
}

export type DescendantStateClasses = {
  [rootClassName: string]: { [stateName: string]: RootScopedStateRule[] }
}
