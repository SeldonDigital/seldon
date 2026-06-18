import type { Properties } from "../../properties/types/properties"

export type EntryNodeId = string

export type EntryNodeType = "default" | "variant" | "instance"

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
