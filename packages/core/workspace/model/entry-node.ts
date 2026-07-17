import type { Properties } from "../../properties/types/properties"
import type { EntryNodeStates } from "./node-state"

export type EntryNodeId = string

export type EntryNodeType = "default" | "variant" | "instance" | "authored"

export type EntryNodePropertyOverrides = Properties

export type EntryNodeLevel =
  | "screen"
  | "module"
  | "part"
  | "element"
  | "primitive"
  | "frame"

export type EntryNodeThemeRef = string

/**
 * Creation origin of an instance node. `schema` means the instance exists
 * because a component schema composition requires it. `user` means a person
 * inserted, pasted, or duplicated it. Engine-owned and not user editable.
 * Only meaningful on `type: "instance"` nodes.
 */
export type NodeOrigin = "schema" | "user"

export interface EntryNode {
  id: EntryNodeId
  type: EntryNodeType
  level: EntryNodeLevel
  label: string
  theme: EntryNodeThemeRef | null
  template: string
  overrides: EntryNodePropertyOverrides
  /**
   * Optional per-state property override bags layered on top of `overrides`
   * (the Normal layer). Sparse: a state key is present only when it carries
   * overrides. Authored on default and user variants only; instances inherit.
   */
  states?: EntryNodeStates
  origin?: NodeOrigin
  /**
   * Stable, user-assigned reference handle for this node. Unique across the
   * whole workspace and never inherited or merged, so generated code and app
   * logic can target a specific node regardless of position. Absent until set.
   */
  ref?: string
  __editor?: Record<string, unknown>
}

export function isEntryNodeDefault(
  entry: EntryNode,
): entry is EntryNode & { type: "default" } {
  return entry.type === "default"
}

export function isEntryNodeVariant(
  entry: EntryNode,
): entry is EntryNode & { type: "variant" } {
  return entry.type === "variant"
}

export function isEntryNodeInstance(
  entry: EntryNode,
): entry is EntryNode & { type: "instance" } {
  return entry.type === "instance"
}

/**
 * True for an authored root node. An authored root is the base variant of an
 * authored component board. It is schema-free and freely editable, so it is
 * neither catalog-locked like a default variant nor reset-to-catalog capable.
 */
export function isEntryNodeAuthored(
  entry: EntryNode,
): entry is EntryNode & { type: "authored" } {
  return entry.type === "authored"
}
