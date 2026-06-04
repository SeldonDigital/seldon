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
