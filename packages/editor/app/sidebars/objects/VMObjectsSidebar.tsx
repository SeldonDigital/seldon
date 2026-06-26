"use client"

import { LayoutGroup } from "framer-motion"
import { CSSProperties, PointerEvent, useCallback } from "react"
import { useEditableWorkspaceName } from "@lib/persistence/hooks/use-editable-workspace-name"
import { useWorkspaceRecord } from "@lib/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover"
import { useIsSectionExpanded } from "../hooks/use-section-expansion"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useObjectsSidebar } from "./hooks/use-objects-sidebar"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { getSelectionTarget } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import {
  FramerExpandable,
  SidebarContainer,
} from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"
import { BarTabsBar } from "@seldon/components/parts/BarTabsBar"
import { BoardSection } from "../helpers/get-board-sections"
import { sidebarShellStyle } from "../helpers/sidebar-styles"
import { VMBoard } from "./VMBoard"
import { VMSection } from "./VMSection"

/**
 * View-model for the objects sidebar. Owns the workspace name bar, the section
 * list, the scroller, and the tree-level hover controller that publishes the
 * hovered row to the shared bridge.
 */
export function VMObjectsSidebar() {
  const workspaceId = useWorkspaceId()
  const { record, updateRecord } = useWorkspaceRecord(workspaceId)
  const { sections } = useObjectsSidebar()
  const scrollerRef = useScrollSelection()
  const setHoveredId = useSetHoveredId()

  useDraggableMonitor()

  const editableNameProps = useEditableWorkspaceName({
    name: record?.name ?? "",
    onRename: (name) => updateRecord({ name }),
  })

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
      <BarTabsBar
        style={{ height: "var(--sdn-size-xlarge)" }}
        buttonSimple={{
          style: {
            background: "none",
            border: "none",
            padding: 0,
            minWidth: 0,
            width: "100%",
            justifyContent: "flex-start",
            cursor: "text",
          },
        }}
        textLabel={{
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
        buttonSimple2={null}
        buttonSimple3={null}
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
                <ObjectsSectionGroup key={section.label} section={section} />
              ))}
            </LayoutGroup>
          </Frame>
        </div>
      </SelectionRelationsProvider>
    </SidebarContainer>
  )
}

function ObjectsSectionGroup({ section }: { section: BoardSection }) {
  const isExpanded = useIsSectionExpanded(section.level)

  return (
    <>
      <VMSection section={section} />
      <FramerExpandable isExpanded={isExpanded}>
        {section.boards.length === 0 ? (
          <VMBoard emptyLabel={`No ${section.label.toLowerCase()}`} />
        ) : (
          section.boards.map((board) => (
            <VMBoard key={getComponentKey(board)} board={board} />
          ))
        )}
      </FramerExpandable>
    </>
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
}
