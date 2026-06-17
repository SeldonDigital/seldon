import type { Board } from "../../model/components"
import type { EntryNode } from "../../model/entry-node"

/** Values that can be classified for `rules.mutations.*` policy lookup. */
export type RulesNodeOrComponent = Board | EntryNode

export function isEntryNodeForRules(
  node: RulesNodeOrComponent,
): node is EntryNode {
  if (typeof node !== "object" || node === null || "variants" in node) {
    return false
  }
  const kind = (node as { type?: unknown }).type
  return kind === "default" || kind === "variant" || kind === "instance"
}

export type DefaultVariant = EntryNode & { type: "default" }

export type UserVariant = EntryNode & { type: "variant" }

export type Variant = DefaultVariant | UserVariant

export type Instance = EntryNode & { type: "instance" }
