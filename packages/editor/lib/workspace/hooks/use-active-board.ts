import { useMemo } from "react"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useActiveBoard() {
  const { selection, selectedResourceEntry, selectedResourceItemKey } =
    useSelection()
  const { workspace } = useWorkspace()

  return {
    activeBoard: useMemo(() => {
      if (selection) {
        if (isComponentEntry(selection)) return selection
        return workspaceService.findBoardForNode(selection, workspace)
      }

      // Selecting a resource board variant entry (theme, font collection, icon
      // set, or media) keeps its board active so the canvas keeps rendering it
      // and the auto-select-first-board effect does not fire.
      if (selectedResourceEntry) {
        return (
          Object.values(workspace.components).find((entry) =>
            (
              entry as { variants?: { id: string }[] }
            ).variants?.some((variant) => variant.id === selectedResourceEntry.id),
          ) ?? null
        )
      }

      // Selecting a resource item (a font family or icon row) keeps its board
      // active. The key is `${resource}:${componentKey}:${entryId}:${slot}`.
      if (selectedResourceItemKey) {
        const componentKey = selectedResourceItemKey.split(":")[1]
        return componentKey
          ? (workspace.components[componentKey] ?? null)
          : null
      }

      return null
    }, [selection, selectedResourceEntry, selectedResourceItemKey, workspace]),
  }
}
