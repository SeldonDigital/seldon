import type { ComponentEntry, ComponentKey, Workspace } from "../../types"

/**
 * Lists every board key in workspace.components.
 *
 * @param workspace Workspace that holds the boards map.
 */
export function getComponentIds(workspace: Workspace): ComponentKey[] {
  return Object.keys(workspace.components) as ComponentKey[]
}

/**
 * Finds the key for this board in workspace.components.
 * Matches the board by reference against each map entry.
 *
 * Returns null when no entry is this same board instance.
 *
 * @param workspace Workspace that holds the boards map.
 * @param board ComponentEntry instance to resolve.
 */
export function getComponentId(workspace: Workspace, board: ComponentEntry): ComponentKey | null {
  for (const [componentKey, entry] of Object.entries(workspace.components)) {
    if (entry === board) {
      return componentKey as ComponentKey
    }
  }
  return null
}
