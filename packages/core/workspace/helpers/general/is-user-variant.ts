import { isEntryNodeVariant } from "../../model/entry-node"
import type { EntryNode } from "../../types"

export function isUserVariant(
  variant: EntryNode,
): variant is EntryNode & { type: "variant" } {
  return isEntryNodeVariant(variant)
}
