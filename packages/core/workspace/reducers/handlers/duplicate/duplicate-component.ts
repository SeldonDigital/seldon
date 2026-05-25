import { cloneComponent } from "../../../services"
import type { ExtractPayload, Workspace } from "../../../types"

/**
 * Applies `duplicate_component`: calls `cloneComponent` to copy the source board under `newComponentKey` with remapped
 * ids in the right workspace maps. Validation rejects component boards and boards tied
 * to packaged theme, font-collection, icon-set, or media catalog ids.
 */
export function duplicateComponent(
  payload: ExtractPayload<"duplicate_component">,
  workspace: Workspace,
): Workspace {
  return cloneComponent(
    workspace,
    payload.sourceComponentKey,
    payload.newComponentKey,
    payload.label,
  )
}
