"use client"

import {
  useSaveWorkspace,
  useWorkspaceName,
} from "@lib/persistence/workspace-save-store"
import { buildFieldStateProps } from "@lib/views/state-props"
import { LayoutGroup } from "framer-motion"
import { CSSProperties, PointerEvent, useCallback, useState } from "react"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useTool } from "@lib/hooks/use-tool"
import { useRenameInput } from "../hooks/use-rename-input"
import { useIsSectionExpanded } from "../hooks/use-section-expansion"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useObjectsSidebar } from "./hooks/use-objects-sidebar"
import { useRowClick } from "./hooks/use-row-click"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"
import { getSelectionTarget } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/frames/Frame"
import { SidebarObjects } from "@seldon/components/modules/SidebarObjects"
import { FramerExpandable } from "@app/sidebars/FramerExpandable.bespoke"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { BoardSection } from "../helpers/get-board-sections"
import { BoardController } from "./BoardController"
import { Section } from "./Section"

/** Class that renders a header ButtonToggle in its activated (on) state. */
const ACTIVE_TOGGLE_CLASS = "sdn-state-activated"

/**
 * View-model for the objects sidebar. Feeds the generated `SidebarObjects`
 * view: it renders the inert header combobox and the section list, scroller,
 * and tree-level hover controller injected into the view's frame.
 */
export function ObjectsSidebar() {
  const { sections } = useObjectsSidebar()
  const scrollerRef = useScrollSelection()
  const setHoveredId = useSetHoveredId()
  const { workspace } = useWorkspace({ usePreview: false })
  const name = useWorkspaceName()
  const saveNow = useSaveWorkspace()
  const addToast = useAddToast()
  const [isEditingName, setEditingName] = useState(false)

  const { activeBoard } = useActiveBoard()
  const { selectWorkspace } = useSelectionActions()
  const { activeTool } = useTool()
  const { objectsView, setObjectsView } = useEditorConfig()
  const workspaceSelected = useSelectionStore(
    (state) => state.workspaceSelected,
  )

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

  // Selecting the project row selects the workspace itself. The board the
  // canvas is showing is frozen so the canvas stays put while the workspace is
  // the active selection.
  const selectWorkspaceRow = useCallback(() => {
    const frozenBoardKey = activeBoard ? getComponentKey(activeBoard) : null
    selectWorkspace(frozenBoardKey)
  }, [activeBoard, selectWorkspace])

  // Reuses the row click contract: ignores clicks on the force-save button and
  // only selects under the select tool.
  const onProjectClick = useRowClick({
    activeTool,
    onSelect: selectWorkspaceRow,
  })

  // The projectActions button force-saves the live workspace immediately,
  // bypassing the autosave debounce.
  const handleForceSave = useCallback(() => {
    if (workspace) void saveNow(workspace)
    addToast("Project saved")
  }, [workspace, saveNow, addToast])

  const projectField = {
    onClick: onProjectClick,
    onDoubleClick: enterRename,
    ...buildFieldStateProps({ selected: workspaceSelected }),
  }
  const projectActions = { onClick: handleForceSave }

  // Header view toggles behave as a radio pair: one is always active. The
  // activated state renders through the generated button-toggle `on` styling.
  const showComponents = useCallback(
    () => setObjectsView("components"),
    [setObjectsView],
  )
  const showResources = useCallback(
    () => setObjectsView("resources"),
    [setObjectsView],
  )
  const componentsActive = objectsView === "components"
  const resourcesActive = objectsView === "resources"
  const componentsToggle = {
    onClick: showComponents,
    className: componentsActive ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": componentsActive,
    title: "Components",
  }
  const resourcesToggle = {
    onClick: showResources,
    className: resourcesActive ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": resourcesActive,
    title: "Resources",
  }

  const sectionGroups = sections.map((section) => (
    <ObjectsSectionGroup key={section.label} section={section} />
  ))

  const treeChildren = (
    <Frame
      ref={scrollerRef}
      style={styles.scroller}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <SelectionRelationsProvider>
        <Frame style={styles.tree}>
          <LayoutGroup>{sectionGroups}</LayoutGroup>
        </Frame>
      </SelectionRelationsProvider>
    </Frame>
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
      buttonToggle={componentsToggle}
      buttonToggle2={resourcesToggle}
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
      <BoardController emptyLabel={emptyLabel} />
    ) : (
      section.boards.map((board) => (
        <BoardController key={getComponentKey(board)} board={board} />
      ))
    )

  return (
    <>
      <Section section={section} />
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
    padding: "var(--sdn-paddings-tight) 0 var(--sdn-paddings-cozy) 0",
    gap: "var(--sdn-gaps-tight)",
  },
}
