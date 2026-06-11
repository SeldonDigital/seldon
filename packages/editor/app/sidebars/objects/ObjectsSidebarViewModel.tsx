"use client"

import { LayoutGroup } from "framer-motion"
import {
  CSSProperties,
  Fragment,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useEditableWorkspaceName } from "@lib/persistence/hooks/use-editable-workspace-name"
import { useWorkspaceRecord } from "@lib/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { useSectionExpansion } from "../hooks/use-section-expansion"
import { getSelectionTarget } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { SidebarContainer } from "@seldon/components/custom-components"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
import { Frame } from "@seldon/components/frames/Frame"
import { BarTabsProject } from "@seldon/components/parts/BarTabsProject"
import { getBoardSections } from "../helpers/get-board-sections"
import {
  relativeFullWidthStyle,
  sidebarNoSelectionTextStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { FramerExpandable } from "../shared/FramerExpandable"
import { BoardViewModel } from "./BoardViewModel"
import { SectionViewModel } from "./SectionViewModel"

/**
 * View-model for the objects sidebar. Owns the workspace name bar, default
 * board selection, the section list, the scroller, and the tree-level hover
 * controller that publishes the hovered row to the shared bridge.
 */
export function ObjectsSidebarViewModel() {
  const workspaceId = useWorkspaceId()
  const { record, updateRecord } = useWorkspaceRecord(workspaceId)
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const {
    selectBoard,
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
  } = useSelection()
  const scrollerRef = useScrollSelection()
  const { isSectionExpanded } = useSectionExpansion()
  const setHoveredId = useSetHoveredId()

  useDraggableMonitor()

  useEffect(() => {
    const boards = workspaceService.getBoards(workspace)
    if (
      !activeBoard &&
      !selectedNodeId &&
      !selectedBoardId &&
      !selectedResourceEntry &&
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
    selectedResourceEntry,
  ])

  const sections = useMemo(() => {
    return getBoardSections(workspaceService.getBoards(workspace))
  }, [workspace])

  const editableNameProps = useEditableWorkspaceName({
    name: record?.name ?? "",
    onRename: (name) => updateRecord({ name }),
  })

  // One hover controller for the whole tree: resolve the row under the pointer
  // and publish it to the shared bridge, so the matching canvas object lights up
  // and every row reflects hover without per-row listeners.
  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = getSelectionTarget(event.target as Element)
      setHoveredId(target?.id ?? null, target?.kind, target?.rootId)
    },
    [setHoveredId],
  )

  const handlePointerLeave = useCallback(
    () => setHoveredId(null),
    [setHoveredId],
  )

  if (!record) return null

  return (
    <SidebarContainer style={sidebarShellStyle} data-testid="objects-sidebar">
      <BarTabsProject
        style={{ height: "var(--sdn-size-xlarge)" }}
        button={{ style: { display: "none" } }}
        text={{
          children: record.name,
          ...editableNameProps,
          style: {
            alignSelf: "unset",
            minWidth: 0,
            display: "block",
            maxWidth: "100%",
            cursor: "text",
            outline: "none",
          },
        }}
        button2={{ style: { display: "none" } }}
      />
      <SelectionRelationsProvider>
        <div
          ref={scrollerRef}
          style={styles.scroller}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <Frame style={styles.tree}>
            <LayoutGroup>
              {sections.map((section) => (
                <Fragment key={section.label}>
                  <SectionViewModel section={section} />
                  <FramerExpandable
                    isExpanded={isSectionExpanded(
                      section.level,
                      section.boards.length > 0,
                    )}
                  >
                    {section.boards.length === 0 ? (
                      <EmptySectionRow
                        label={`No ${section.label.toLowerCase()}`}
                      />
                    ) : (
                      section.boards.map((board) => (
                        <BoardViewModel
                          key={getComponentKey(board)}
                          board={board}
                          disableReordering
                        />
                      ))
                    )}
                  </FramerExpandable>
                </Fragment>
              ))}
            </LayoutGroup>
          </Frame>
        </div>
      </SelectionRelationsProvider>
    </SidebarContainer>
  )
}

/** Placeholder row shown inside an empty section, reading "No {section}". */
function EmptySectionRow({ label }: { label: string }) {
  return (
    <div style={styles.rowWrapper}>
      <div style={relativeFullWidthStyle}>
        <ItemNodeRow
          buttonIconic={null}
          icon={null}
          icon2={null}
          textLabel={{ children: label, style: styles.emptyLabel }}
          buttonIconic2={null}
          icon3={null}
          buttonIconic3={null}
          icon4={null}
          aria-disabled
          data-testid="objects-sidebar-empty-section"
        />
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  scroller: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
  },
  tree: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 0,
    padding: "0.25rem 0.25rem 0.75rem 0.25rem",
    gap: "var(--sdn-gaps-tight)",
  },
  rowWrapper: {
    width: "100%",
    minWidth: 0,
  },
  emptyLabel: {
    ...sidebarNoSelectionTextStyle,
    paddingInlineStart: "0.5rem",
  },
}
