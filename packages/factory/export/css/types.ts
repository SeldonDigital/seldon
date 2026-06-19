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
