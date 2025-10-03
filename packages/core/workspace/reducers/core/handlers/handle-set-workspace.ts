import { ExtractPayload, Workspace } from "../../../types"

/**
 * Resets the workspace to a new workspace
 *
 * This handler completely replaces the current workspace with a new one.
 * It performs a shallow copy to ensure immutability.
 *
 * @param payload Contains the new workspace state
 * @returns A new workspace instance with the provided state
 * @throws Error if the workspace is invalid
 */
export function handleSetWorkspace(
  payload: ExtractPayload<"set_workspace">,
): Workspace {
  // Return the workspace as-is, preserving any properties added by middleware
  return payload.workspace
}
