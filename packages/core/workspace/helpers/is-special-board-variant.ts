import type { EntryNode, Workspace } from "../types"
import { isSpecialComponentVariant } from "./general/is-special-component-variant"

/** @deprecated Use `isSpecialComponentVariant` */
export function isSpecialBoardVariant(
  variant: EntryNode,
  workspace: Workspace,
): boolean {
  return isSpecialComponentVariant(variant, workspace)
}
