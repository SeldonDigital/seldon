import { useCallback } from "react"
import { Board, Instance, Variant } from "@seldon/core"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"

/**
 * Theme-assignment command. Boards set their component theme; nodes set their
 * node theme. Owns the dispatch so property controls stay binding shells.
 */
export function useSetObjectTheme() {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { selectedBoardId } = useSelection()

  return useCallback(
    (subject: Variant | Instance | Board, themeId: ThemeInstanceId | null) => {
      if (isBoard(subject)) {
        dispatch({
          type: "set_component_theme",
          payload: {
            boardKey:
              selectedBoardId ?? resolveComponentKey(subject, workspace),
            theme: themeId || "seldon",
          },
        })
      } else {
        dispatch({
          type: "set_node_theme",
          payload: {
            nodeId: subject.id,
            theme: themeId,
          },
        })
      }
    },
    [workspace, dispatch, selectedBoardId],
  )
}
