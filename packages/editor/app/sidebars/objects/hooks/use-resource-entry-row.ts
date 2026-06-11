import { Variant } from "@seldon/core"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import type { ResourceRowConfig } from "../VMResourceEntry"
import { useEditState } from "./use-edit-state"

/**
 * Edit state and the rename command for a resource entry row. Owns the dispatch
 * so the row component stays a binding shell.
 */
export function useResourceEntryRow(
  config: ResourceRowConfig,
  entryId: string,
) {
  const { dispatch } = useWorkspace({ usePreview: false })
  const { isEditingName, setEditingName } = useEditState({
    id: entryId,
  } as unknown as Variant)

  const submitLabel = (newLabel: string) => {
    if (!config.buildLabelAction) return
    dispatch(config.buildLabelAction(entryId, newLabel.trim()))
    setEditingName(false)
  }

  return { isEditingName, setEditingName, submitLabel }
}
