"use client"

import { COLORS } from "@lib/ui/colors"
import Link from "next/link"
import { CSSProperties } from "react"
import { useRouter } from "next/navigation"
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
import { ProjectTree } from "./ProjectTree"

export function ObjectsSidebar() {
  const workspaceId = useWorkspaceId()
  const { record } = useWorkspaceRecord(workspaceId)
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { selectBoard, selectedNodeId, selectedBoardId } = useSelection()
  const { openDialog } = useDialog()
  const { setActiveTool } = useTool()
  const router = useRouter()
  const scrollerRef = useScrollSelection()

  useDraggableMonitor()

  useEffect(() => {
    const boards = workspaceService.getBoards(workspace)
    if (
      !activeBoard &&
      !selectedNodeId &&
      !selectedBoardId &&
      boards.length > 0
    ) {
      selectBoard(getComponentKey(boards[0]))
    }
  }, [workspace, activeBoard, selectBoard, selectedNodeId, selectedBoardId])

  const sections = useMemo(() => {
    return getBoardSections(workspaceService.getBoards(workspace))
  }, [workspace])

  const handleWorkspacesClick = useCallback(() => {
    router.push("/")
  }, [router])

  const handleAddClick = useCallback(() => {
    openDialog("add-board")
    setActiveTool("select")
  }, [openDialog, setActiveTool])

  if (!record) return null

  return (
    <SidebarContainer style={styles.container} data-testid="objects-sidebar">
      <BarTabsProject
        button={{ onClick: handleWorkspacesClick }}
        icon={{ icon: "material-chevronDoubleLeft" }}
        label={{ children: <Link href="/">Workspaces</Link> }}
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
      <ProjectTree sections={sections} scrollerRef={scrollerRef} />
    </SidebarContainer>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    backgroundColor: COLORS.charcoal[500],
  },
}
