import { isEntryNodeDefault } from "../../model/entry-node"
import type { EntryNode } from "../../types"

export function isDefaultVariant(
  variant: EntryNode,
): variant is EntryNode & { type: "default" } {
  return isEntryNodeDefault(variant)
}
