import { isEntryNodeInstance } from "../../model/entry-node"
import type { EntryNode } from "../../types"

/** True when the node is a default or variant row (not an instance). */
export function isVariantNode(
  node: EntryNode | undefined,
): node is EntryNode & { type: "default" | "variant" } {
  return node !== undefined && !isEntryNodeInstance(node)
}
