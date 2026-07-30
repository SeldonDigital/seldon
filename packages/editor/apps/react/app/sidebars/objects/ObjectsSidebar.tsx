"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useTool } from "@app/editor/hooks/use-tool"
import { useSaveWorkspace } from "@app/persistence/workspace-save-store"
import { FramerExpandable } from "@app/sidebars/FramerExpandable.bespoke"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { buildFieldStateProps } from "@app/views/state-props"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSetHoveredId } from "@app/workspace/hooks/use-object-hover"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getSelectionTarget } from "@app/workspace/selection-target"
import { Frame } from "@seldon/components/frames/Frame"
import { SidebarObjects } from "@seldon/components/modules/SidebarObjects"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { LayoutGroup } from "framer-motion"
import { useCallback, useState } from "react"

import { useRenameInput } from "../hooks/use-rename-input"
import { useIsSectionExpanded } from "../hooks/use-section-expansion"
import { BoardController } from "./BoardController"
import { Section } from "./Section"
import { useDraggableMonitor } from "./hooks/use-draggable-monitor"
import { useObjectsSidebar } from "./hooks/use-objects-sidebar"
import { useRowClick } from "./hooks/use-row-click"
import { useScrollSelection } from "./hooks/use-scroll-selection"
import { SelectionRelationsProvider } from "./hooks/use-selection-relations"

import type { BoardSection } from "../helpers/get-board-sections"
import type { CSSProperties, PointerEvent } from "react"

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
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const name = workspace.metadata.label ?? ""
  const saveNow = useSaveWorkspace()
  const addToast = useAddToast()
  const [isEditingName, setEditingName] = useState(false)

  const { activeBoard } = useActiveBoard()
  const { selectWorkspace } = useSelectionActions()
  const { activeTool } = useTool()
  const { objectsView, setObjectsView } = useEditorConfig()
  const workspaceSelected = useSelectionStore((state) => state.workspaceSelected)

  useDraggableMonitor()

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = getSelectionTarget(event.target as Element)

      setHoveredId(target?.id ?? null, target?.kind, target?.rootId)
    },
    [setHoveredId],
  )

  const handlePointerLeave = useCallback(() => setHoveredId(null), [setHoveredId])

  // The project name reuses the node-row rename machinery: a read-only display
  // input until edit mode, then an editable input that commits on Enter/blur.
  // The name is the workspace label, so autosave persists it like any other edit.
  const submitRename = useCallback(
    (next: string) => {
      const trimmed = next.trim()

      if (trimmed && trimmed !== name) {
        dispatch({ type: "set_workspace_label", payload: { value: trimmed } })
      }

      setEditingName(false)
    },
    [name, dispatch],
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

  // The workspaceSave button force-saves the live workspace immediately,
  // bypassing the autosave debounce.
  const handleForceSave = useCallback(() => {
    if (workspace) void saveNow(workspace)
    addToast("Project saved")
  }, [workspace, saveNow, addToast])

  const workspaceField = {
    onClick: onProjectClick,
    onDoubleClick: enterRename,
    ...buildFieldStateProps({ selected: workspaceSelected }),
  }
  const workspaceSave = { onClick: handleForceSave }

  // Header view toggles behave as a radio pair: one is always active. The
  // activated state renders through the generated button-toggle `on` styling.
  const showComponents = useCallback(() => setObjectsView("components"), [setObjectsView])
  const showResources = useCallback(() => setObjectsView("resources"), [setObjectsView])
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

  // Drive every slot through its stable workspace ref. The two view toggles and
  // the workspace field are conditional slots, so they keep a positional `{}`
  // enabler to render; their data flows through `seldonRefs`.
  const seldonRefs = {
    workspaceField: { ...workspaceField },
    workspaceName: { ...nameInput },
    workspaceSave: { ...workspaceSave },
    objectsViewComponents: { ...componentsToggle },
    objectsViewResources: { ...resourcesToggle },
    objectsTree: {
      style: styles.frame,
      children: treeChildren,
    },
  }

  return (
    <SidebarObjects
      data-testid="objects-sidebar"
      comboboxFieldProject={{}}
      buttonToggle={{}}
      buttonToggle2={{}}
      seldonRefs={seldonRefs}
      style={styles.sidebar}
    />
  )
}

function ObjectsSectionGroup({ section }: { section: BoardSection }) {
  const isExpanded = useIsSectionExpanded(section.level)
  const { isolatedView } = useEditorConfig()
  const emptyLabel = isolatedView
    ? "Currently in Isolation Mode"
    : `No ${section.label.toLowerCase()}`
  const boardRows =
    section.boards.length === 0 ? (
      <BoardController emptyLabel={emptyLabel} />
    ) : (
      section.boards.map((board) => <BoardController key={getComponentKey(board)} board={board} />)
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
