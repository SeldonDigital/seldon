import { EntryNode } from "../../types"
import { isDefaultVariant } from "./is-default-variant"

export function isDefaultNodeVariant(
  node: EntryNode,
): node is EntryNode & { type: "default" } {
  return isDefaultVariant(node)
}
