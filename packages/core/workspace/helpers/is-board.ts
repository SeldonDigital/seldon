import type { ComponentEntry, EntryNode } from "../types"
import { isComponentEntry } from "./components/is-component-entry"

export type Board = ComponentEntry

/** @deprecated Use `isComponentEntry` */
export function isBoard(
  nodeOrBoard: EntryNode | ComponentEntry,
): nodeOrBoard is ComponentEntry {
  return isComponentEntry(nodeOrBoard)
}
