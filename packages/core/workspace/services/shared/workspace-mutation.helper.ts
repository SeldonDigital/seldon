import { WritableDraft, produce } from "immer"
import { Workspace } from "../../types"

/**
 * Helper for workspace mutations using Immer.
 * @param workspace - The workspace to mutate
 * @param mutator - Function that mutates the draft workspace
 * @returns The updated workspace
 */
export function mutateWorkspace(
  workspace: Workspace,
  mutator: (draft: WritableDraft<Workspace>) => void,
): Workspace {
  return produce(workspace, mutator)
}

/**
 * Helper for creating new workspace instances with mutations.
 * @param workspace - The base workspace
 * @param mutator - Function that mutates the draft workspace
 * @returns Object containing the new workspace and any additional data
 */
export function createWorkspaceWithMutation<T = void>(
  workspace: Workspace,
  mutator: (draft: WritableDraft<Workspace>) => T,
): { workspace: Workspace; data: T } {
  let data: T
  const newWorkspace = produce(workspace, (draft) => {
    data = mutator(draft)
  })
  return { workspace: newWorkspace, data: data! }
}
