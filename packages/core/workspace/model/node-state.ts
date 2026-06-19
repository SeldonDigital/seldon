import type { Properties } from "../../properties/types/properties"

/**
 * Interaction-state vocabulary for component nodes.
 *
 * This module is target-agnostic. It defines state name keys, display labels,
 * and the custom-state registry shape only. It carries no CSS, pseudo-class,
 * attribute, or class-name data. Each export pipeline owns its own mapping from
 * a state name to a target construct, so adding a new render target needs no
 * change here.
 */

/** Reserved interaction-state names shared by every export target. */
export type ReservedStateName =
  | "disabled"
  | "hover"
  | "focused"
  | "active"
  | "dragged"
  | "error"
  | "selected"
  | "checked"

/**
 * Reserved state names with their display labels. Order is not significant;
 * the editor menu owns its own display order.
 */
export const RESERVED_STATE_LABELS: Record<ReservedStateName, string> = {
  disabled: "Disabled",
  hover: "Hover",
  focused: "Focused",
  active: "Active",
  dragged: "Dragged",
  error: "Error",
  selected: "Selected",
  checked: "Checked",
}

/** Runtime list of every reserved state name. */
export const RESERVED_STATE_NAMES = Object.keys(
  RESERVED_STATE_LABELS,
) as ReservedStateName[]

/** Tells whether a name is a reserved interaction-state name. */
export function isReservedStateName(name: string): name is ReservedStateName {
  return name in RESERVED_STATE_LABELS
}

/**
 * The base, unstated layer. Stored as a node's `overrides`, never as a key in
 * the `states` map. Editors use this sentinel to mean "edit the base layer".
 */
export const NORMAL_STATE = "normal" as const
export type NormalState = typeof NORMAL_STATE

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
