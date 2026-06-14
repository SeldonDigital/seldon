import { clonePlayground } from "../../../services"
import type { ExtractPayload, Workspace } from "../../../types"

/**
 * Applies `duplicate_playground`: clones the source playground container and its
 * Sandbox trees under the new playground key with remapped node ids. Validation
 * rejects a missing source or a colliding key.
 */
export function duplicatePlayground(
  payload: ExtractPayload<"duplicate_playground">,
  workspace: Workspace,
): Workspace {
  return clonePlayground(
    workspace,
    payload.sourcePlaygroundKey,
    payload.newPlaygroundKey,
    payload.label,
  )
}
