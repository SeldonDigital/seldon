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
