import type { Properties } from "../../properties/types/properties"

/**
 * Interaction-state vocabulary for component nodes.
 *
 * This module defines state name keys, display labels, the expression kind that
 * groups them, and the custom-state registry shape. It carries no concrete CSS
 * selector, attribute, or class-name strings. Each export pipeline owns the
 * mapping from a state name to a target construct, but every web target must
 * honor the {@link RESERVED_STATE_EXPRESSION} kind so the user and agent mental
 * model of how a state is expressed stays consistent. A pseudo state is driven
 * by the browser, an aria state by a view-set attribute, and a class state by a
 * runtime-toggled class.
 */

/** Reserved interaction-state names shared by every export target. */
export type ReservedStateName =
  | "disabled"
  | "hover"
  | "focused"
  | "active"
  | "dragged"
  | "activated"
  | "error"
  | "selected"
  | "checked"

/**
 * Reserved state names with their display labels. Order is not significant;
 * the editor menu derives its display order from {@link RESERVED_STATE_GROUPS}.
 */
export const RESERVED_STATE_LABELS: Record<ReservedStateName, string> = {
  disabled: "Disabled",
  hover: "Hover",
  focused: "Focused",
  active: "Active",
  dragged: "Dragged",
  activated: "Activated",
  error: "Error",
  selected: "Selected",
  checked: "Checked",
}

/** Runtime list of every reserved state name. */
export const RESERVED_STATE_NAMES = Object.keys(
  RESERVED_STATE_LABELS,
) as ReservedStateName[]

/**
 * How a reserved state is expressed by web export targets. This is the shared
 * contract behind the grouping:
 * - `pseudo`: the browser toggles it (a CSS pseudo-class). It cannot be forced
 *   as a display state by the view.
 * - `aria`: the view declares it through an aria attribute.
 * - `class`: the app toggles a runtime state class.
 */
export type StateExpression = "pseudo" | "aria" | "class"

/** Expression kind for each reserved state. Web targets must honor this. */
export const RESERVED_STATE_EXPRESSION: Record<
  ReservedStateName,
  StateExpression
> = {
  hover: "pseudo",
  focused: "pseudo",
  active: "pseudo",
  checked: "pseudo",
  disabled: "aria",
  error: "aria",
  selected: "aria",
  dragged: "class",
  activated: "class",
}

/** Cluster order for the expression kinds in menus and tooling. */
const STATE_EXPRESSION_ORDER: StateExpression[] = ["pseudo", "aria", "class"]

/**
 * Intended menu display order within the expression clusters. States are grouped
 * contiguously by expression so cluster filtering keeps this order inside each
 * group. This is the display order only; keyboard shortcuts follow
 * {@link RESERVED_STATE_SHORTCUT_ORDER}.
 */
const RESERVED_STATE_DISPLAY_ORDER: ReservedStateName[] = [
  "active",
  "hover",
  "focused",
  "checked",
  "selected",
  "disabled",
  "error",
  "activated",
  "dragged",
]

/**
 * Reserved states clustered by expression kind, in expression order, each
 * cluster following {@link RESERVED_STATE_DISPLAY_ORDER}. Editors render these
 * clusters as separated groups so the menu mirrors how each state is expressed
 * during export. The flattened order also drives the Option-number shortcuts,
 * which run Option-1 (Normal) through Option-0 top to bottom.
 */
export const RESERVED_STATE_GROUPS: {
  expression: StateExpression
  states: ReservedStateName[]
}[] = STATE_EXPRESSION_ORDER.map((expression) => ({
  expression,
  states: RESERVED_STATE_DISPLAY_ORDER.filter(
    (name) => RESERVED_STATE_EXPRESSION[name] === expression,
  ),
}))

/** Tells whether a name is a reserved interaction-state name. */
export function isReservedStateName(name: string): name is ReservedStateName {
  return name in RESERVED_STATE_LABELS
}

/**
 * The base, unstated layer. Stored as a node's `overrides`, never as a key in
 * the `states` map. Editors use this sentinel to mean "edit the base layer".
 */
export const NORMAL_STATE = "normal" as const

/**
 * A workspace-defined custom state. Stored on `metadata.customStates` and shared
 * across the whole workspace. Target-agnostic: it carries no render data. Each
 * exporter derives its own binding from `key`.
 */
export interface CustomState {
  /** Stable identifier used as the key in a node's `states` map. */
  key: string
  /** Human-readable display name. */
  label: string
  /** Optional description for menus and tooling. */
  description?: string
}

/**
 * A state name key used inside a node's `states` map. It is either a reserved
 * name or a workspace custom-state key. Never `normal`, which lives in
 * `overrides`.
 */
export type NodeState = string

/**
 * Per-state property override bags for a node. Sparse: a key is present only
 * when that state carries overrides. The `normal` layer is not stored here; it
 * stays in the node's `overrides`.
 */
export type EntryNodeStates = Partial<Record<NodeState, Properties>>
