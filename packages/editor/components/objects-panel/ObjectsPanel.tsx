import { ButtonIconic } from "@components/seldon/elements/ButtonIconic"
import { Frame } from "@components/seldon/frames/Frame"
import { FrameScroller } from "@components/seldon/frames/FrameScroller"
import { Title } from "@components/seldon/primitives/Title"
import { useAddToast } from "@components/toaster/use-add-toast"
import { useCurrentProject } from "@lib/api/hooks/use-current-project"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { LayoutGroup } from "framer-motion"
import { CSSProperties, useEffect, useMemo } from "react"
import { useLocation } from "wouter"

import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  ORDERED_COMPONENT_LEVELS,
} from "@seldon/core/components/constants"
import { Board as BoardType } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

import { Button } from "../seldon/elements/Button"
import { SectionHeader } from "../ui/SectionHeader"
import { Board } from "./Board"
import { useDragAndDropMonitor } from "./hooks/use-drag-and-drop-monitor"
import { useScrollSelectionIntoView } from "./hooks/use-scroll-selection-into-view"
import { useSectionExpansion } from "./hooks/use-section-expansion"

const SECTION_LABELS: Record<ComponentLevel, string> = {
  [ComponentLevel.FRAME]: "Frames",
  [ComponentLevel.PRIMITIVE]: "Primitives",
  [ComponentLevel.ELEMENT]: "Elements",
  [ComponentLevel.PART]: "Parts",
  [ComponentLevel.MODULE]: "Modules",
  [ComponentLevel.SCREEN]: "Screens",
}

// Get and process boards into sections based on their component level
const getSectionBoards = (boards: BoardType[]) => {
  const sections = [...ORDERED_COMPONENT_LEVELS].reduce<
    { label: string; level: ComponentLevel; boards: BoardType[] }[]
  >((acc, level) => {
    const boardsAtThisLevel = boards.filter((board) => {
      try {
        return getComponentSchema(board.id).level === level
      } catch (error) {
        console.warn(
          `Skipping board ${board.id} with invalid component ID in ObjectsPanel`,
        )
        return false
      }
    })
    if (boardsAtThisLevel.length > 0)
      acc.push({
        label: SECTION_LABELS[level],
        level,
        boards: boardsAtThisLevel,
      })
    return acc
  }, [])
  return sections
}

export const ObjectsPanel = () => {
  const [_, navigate] = useLocation()

  const { data: project } = useCurrentProject()

  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { selectBoard } = useSelection()
  const { openDialog } = useDialog()
  const { setActiveTool } = useTool()
  const { isSectionExpanded, toggleSection } = useSectionExpansion()

  const scrollerRef = useScrollSelectionIntoView()

  const addToast = useAddToast()

  useDragAndDropMonitor()

  // Always make sure there is a board active
  useEffect(() => {
    const boards = workspaceService.getBoards(workspace)
    if (!activeBoard && boards.length > 0) selectBoard(boards[0].id)
  }, [workspace, activeBoard, selectBoard])

  // Get sections based on the current boards in the workspace
  const sections = useMemo(() => {
    const boards = workspaceService.getBoards(workspace)
    return getSectionBoards(boards)
  }, [workspace])

  if (!project) return null

  return (
    <Frame style={styles.container} data-testid="objects-sidebar">
      <Frame style={styles.header}>
        {/* TODO: Pull this piece into a Seldon component */}
        <ButtonIconic
          data-testid="back-button"
          iconProps={{ icon: "material-chevronDoubleLeft" }}
          onClick={() => navigate("/")}
        />
        <Title style={styles.title}>{project.name}</Title>
        <Button
          data-testid="add-component-button"
          iconProps={{ icon: "seldon-component" }}
          labelProps={{ children: "Add" }}
          onClick={() => {
            openDialog("add-board")
            setActiveTool("select")
          }}
        />
        <Button
          data-testid="build-component-button"
          iconProps={{ icon: "material-bolt" }}
          labelProps={{ children: "Build" }}
          onClick={() => {
            addToast("This feature is coming soon")
          }}
        />
      </Frame>
      <FrameScroller ref={scrollerRef} style={styles.sections}>
        <LayoutGroup>
          {sections.map((section) => (
            <Frame key={section.label} style={styles.section}>
              <SectionHeader
                onClick={() => toggleSection(section.level)}
                isExpanded={isSectionExpanded(section.level)}
              >
                {section.label}
              </SectionHeader>
              {isSectionExpanded(section.level) &&
                section.boards.map((board) => (
                  <Board key={board.id} componentId={board.id} />
                ))}
            </Frame>
          ))}
        </LayoutGroup>
      </FrameScroller>
    </Frame>
  )
}

// TODO: Use props and Seldon components instead of styles on Frames
const styles: Record<string, CSSProperties> = {
  container: {
    height: "100%",
    flexDirection: "column",
  },
  sections: {
    padding: "0.25rem 0.25rem 0.75rem 0.25rem",
    gap: "0.25rem",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0.75rem",
    gap: "0.25rem",
    borderBottom: `1px solid rgb(10, 10, 10)`,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  title: {
    color: "hsl(0deg 4% 98%)",
    fontFamily: "IBM Plex Sans",
    fontStyle: "normal",
    fontSynthesisStyle: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.15,
    letterSpacing: "0.1px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    paddingLeft: "0.25rem",
    alignSelf: "center", // TODO: Need to add this to props
    flexGrow: 1, // TODO: We need to add FlexGrow when width is set to fill
  },
}
