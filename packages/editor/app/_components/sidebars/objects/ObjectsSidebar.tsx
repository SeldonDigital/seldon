"use client"

import { useCallback, useEffect, useMemo } from "react"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useWorkspaceRecord } from "@lib/local-workspace/use-workspace-record"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useSelection } from "@lib/workspace/use-selection"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { SidebarContainer } from "../../../seldon/elements/SidebarContainer"
import { BarTabsProject } from "../../../seldon/parts/BarTabsProject"
import { getBoardSections } from "../helpers/get-board-sections"
import { sidebarShellStyle } from "../helpers/sidebar-styles"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { ProjectTree } from "./ProjectTree"

export function ObjectsSidebar() {
  const workspaceId = useWorkspaceId()
  const { record } = useWorkspaceRecord(workspaceId)
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const {
    selectBoard,
    selectedNodeId,
    selectedBoardId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
  } = useSelection()
  const { openDialog } = useDialog()
  const { setActiveTool } = useTool()
  const scrollerRef = useScrollSelection()

  useDraggableMonitor()

  useEffect(() => {
    const boards = workspaceService.getBoards(workspace)
    if (
      !activeBoard &&
      !selectedNodeId &&
      !selectedBoardId &&
      !selectedThemeEntryId &&
      !selectedFontCollectionEntryId &&
      boards.length > 0
    ) {
      selectBoard(getComponentKey(boards[0]))
    }
  }, [
    workspace,
    activeBoard,
    selectBoard,
    selectedNodeId,
    selectedBoardId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
  ])

  const sections = useMemo(() => {
    return getBoardSections(workspaceService.getBoards(workspace))
  }, [workspace])

  const handleAddClick = useCallback(() => {
    openDialog("add-board")
    setActiveTool("select")
  }, [openDialog, setActiveTool])

  if (!record) return null

  return (
    <SidebarContainer style={sidebarShellStyle} data-testid="objects-sidebar">
      <BarTabsProject
        button={{ style: { display: "none" } }}
        text={{
          children: record.name,
          style: {
            alignSelf: "unset",
            minWidth: 0,
            display: "block",
            maxWidth: "100%",
          },
        }}
        button2={{ onClick: handleAddClick }}
        icon2={{ icon: "seldon-component" }}
      />
      <SelectionRelationsProvider>
        <ProjectTree sections={sections} scrollerRef={scrollerRef} />
      </SelectionRelationsProvider>
    </SidebarContainer>
  )
}

