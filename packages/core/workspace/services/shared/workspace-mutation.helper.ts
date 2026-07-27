import { produce } from "immer"

import type { Workspace } from "../../types"
import type { WritableDraft } from "immer"

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
