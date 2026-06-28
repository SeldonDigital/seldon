"use client"

import { LayoutGroup } from "framer-motion"
import { CSSProperties, PointerEvent, useCallback } from "react"
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover"
import { useIsSectionExpanded } from "../hooks/use-section-expansion"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useObjectsSidebar } from "./hooks/use-objects-sidebar"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { getSelectionTarget } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { SidebarObjects } from "@seldon/components/modules/SidebarObjects"
import { BoardSection } from "../helpers/get-board-sections"
import { VMBoard } from "./VMBoard"
import { VMSection } from "./VMSection"

/**
 * View-model for the objects sidebar. Feeds the generated `SidebarObjects`
 * view: it renders the inert header combobox and the section list, scroller,
 * and tree-level hover controller injected into the view's frame.
 */
export function VMObjectsSidebar() {
  const { sections } = useObjectsSidebar()
  const scrollerRef = useScrollSelection()
  const setHoveredId = useSetHoveredId()

  useDraggableMonitor()

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

  const sectionGroups = sections.map((section) => (
    <ObjectsSectionGroup key={section.label} section={section} />
  ))

  const treeChildren = (
    <div
      ref={scrollerRef}
      style={styles.scroller}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <SelectionRelationsProvider>
        <div style={styles.tree}>
          <LayoutGroup>{sectionGroups}</LayoutGroup>
        </div>
      </SelectionRelationsProvider>
    </div>
  )

  const seldonRefs = {
    objectsContainer: {
      style: styles.frame,
      children: treeChildren,
    },
  }

  return (
    <SidebarObjects
      data-testid="objects-sidebar"
      comboboxFieldProjectField={{}}
      input={{ readOnly: true }}
      seldonRefs={seldonRefs}
      style={styles.sidebar}
    />
  )
}

function ObjectsSectionGroup({ section }: { section: BoardSection }) {
  const isExpanded = useIsSectionExpanded(section.level)
  const emptyLabel = `No ${section.label.toLowerCase()}`
  const boardRows =
    section.boards.length === 0 ? (
      <VMBoard emptyLabel={emptyLabel} />
    ) : (
      section.boards.map((board) => (
        <VMBoard key={getComponentKey(board)} board={board} />
      ))
    )

  return (
    <>
      <VMSection section={section} />
      <FramerExpandable isExpanded={isExpanded}>{boardRows}</FramerExpandable>
    </>
  )
}

const styles: Record<string, CSSProperties> = {
  sidebar: {
    height: "100%",
    minHeight: 0,
  },
  frame: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
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
