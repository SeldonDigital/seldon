import { EntryNode } from "../../types"
import { isUserVariant } from "./is-user-variant"

export function isUserNodeVariant(
  node: EntryNode,
): node is EntryNode & { type: "variant" } {
  return isUserVariant(node)
}
