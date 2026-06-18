import { useCallback } from "react"
import { workspacePropagationService } from "@seldon/core/workspace/services/propagation/workspace-propagation.service"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Returns a stable parser that turns serialized workspace text into a workspace.
 * @returns A callback that parses workspace JSON text
 */
export function useParseWorkspace() {
  return useCallback(
    (text: string) =>
      workspacePropagationService.parseWorkspace(text) as Workspace,
    [],
  )
}
