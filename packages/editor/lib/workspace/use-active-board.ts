import { useMemo } from "react"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useActiveBoard() {
  const { selection, selectedThemeEntryId, selectedResourceItemKey } =
    useSelection()
  const { workspace } = useWorkspace()

  return {
    activeBoard: useMemo(() => {
      if (selection) {
        if (isComponentEntry(selection)) return selection
        return workspaceService.findBoardForNode(selection, workspace)
      }

      // Editing a theme variant keeps its theme board active so the canvas keeps
      // rendering it and the auto-select-first-board effect does not fire.
      if (selectedThemeEntryId) {
        return (
          Object.values(workspace.components).find(
            (entry) =>
              isThemeBoard(entry) &&
              entry.variants.some(
                (variant) => variant.id === selectedThemeEntryId,
              ),
          ) ?? null
        )
      }

      // Selecting a resource item (a font family row, and later icon/media rows)
      // keeps its board active. The key is `${resource}:${componentKey}:${slot}`.
      if (selectedResourceItemKey) {
        const componentKey = selectedResourceItemKey.split(":")[1]
        return componentKey
          ? (workspace.components[componentKey] ?? null)
          : null
      }

      return null
    }, [selection, selectedThemeEntryId, selectedResourceItemKey, workspace]),
  }
}
