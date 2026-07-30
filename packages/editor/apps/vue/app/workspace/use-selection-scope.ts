import { resolveSelectionScope } from "@seldon/editor/lib/workspace/selection-scope"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { useSelectionStore } from "./selection-store"
import { useWorkspace } from "./use-workspace"

import type { SelectionScope } from "@seldon/ai"
import type { ComputedRef } from "vue"

export type { SelectionScope }

/**
 * Reactive classification of the current selection into a {@link SelectionScope},
 * for the Hari basis chip. Tracks the selection fields and the workspace so the
 * chip updates as selection changes. Vue port of the React `useSelectionScope`.
 */
export function useSelectionScope(): ComputedRef<SelectionScope> {
  const { workspace } = useWorkspace()
  const {
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
    selectedResourceItemKey,
    workspaceSelected,
  } = storeToRefs(useSelectionStore())

  return computed(() =>
    resolveSelectionScope(
      {
        selectedNodeId: selectedNodeId.value,
        selectedBoardId: selectedBoardId.value,
        selectedResourceEntry: selectedResourceEntry.value,
        selectedResourceItemKey: selectedResourceItemKey.value,
        workspaceSelected: workspaceSelected.value,
      },
      workspace.value,
    ),
  )
}
