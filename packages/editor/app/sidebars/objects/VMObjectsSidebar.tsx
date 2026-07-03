"use client"

import {
  useSaveWorkspace,
  useWorkspaceName,
} from "@lib/persistence/workspace-save-store"
import { LayoutGroup } from "framer-motion"
import { CSSProperties, PointerEvent, useCallback, useState } from "react"
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useRenameInput } from "../hooks/use-rename-input"
import { useIsSectionExpanded } from "../hooks/use-section-expansion"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useObjectsSidebar } from "./hooks/use-objects-sidebar"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { getSelectionTarget } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { SidebarObjects } from "@seldon/components/modules/SidebarObjects"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { BoardSection } from "../helpers/get-board-sections"
import { VMBoard } from "./VMBoard"
import { VMSection } from "./VMSection"
import { OBJECTS_TREE_GAP } from "./objects.bespoke"

/**
 * View-model for the objects sidebar. Feeds the generated `SidebarObjects`
 * view: it renders the inert header combobox and the section list, scroller,
 * and tree-level hover controller injected into the view's frame.
 */
export function VMObjectsSidebar() {
  const { sections } = useObjectsSidebar()
  const scrollerRef = useScrollSelection()
  const setHoveredId = useSetHoveredId()
  const { workspace } = useWorkspace({ usePreview: false })
  const name = useWorkspaceName()
  const saveNow = useSaveWorkspace()
  const addToast = useAddToast()
  const [isEditingName, setEditingName] = useState(false)

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

  // The project name reuses the node-row rename machinery: a read-only display
  // input until edit mode, then an editable input that commits on Enter/blur.
  const submitRename = useCallback(
    (next: string) => {
      const trimmed = next.trim()
      if (trimmed && trimmed !== name)
        void saveNow(workspace, { name: trimmed })
      setEditingName(false)
    },
    [name, saveNow, workspace],
  )

  const nameInput = useRenameInput({
    label: name,
    isEditing: isEditingName,
    setEditing: setEditingName,
    onSubmit: submitRename,
  })

  const enterRename = useCallback(() => setEditingName(true), [])

  // The projectActions button force-saves the live workspace immediately,
  // bypassing the autosave debounce.
  const handleForceSave = useCallback(() => {
    if (workspace) void saveNow(workspace)
    addToast("Project saved")
  }, [workspace, saveNow, addToast])

  const projectField = { onDoubleClick: enterRename }
  const projectActions = { onClick: handleForceSave }

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
      comboboxFieldProject={projectField}
      input={nameInput}
      buttonIconic={projectActions}
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
    padding: "0.25rem 0 0.75rem 0",
    gap: OBJECTS_TREE_GAP,
  },
}
