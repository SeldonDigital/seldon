import { invariant } from "../../../index"
import type { ComponentEntry, ComponentKey, Workspace } from "../../types"

/**
 * Looks up a board by its key in {@link Workspace.components}.
 */
export function getComponentById(componentKey: ComponentKey, workspace: Workspace): ComponentEntry {
  const board = workspace.components[componentKey]
  invariant(board, `ComponentEntry ${componentKey} not found.`)
  return board
}
