"use client"

import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-font-collection-board"
import { DEFAULT_ICON_SET_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-icon-set-board"
import { DEFAULT_THEME_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-theme-board"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { isEntryIconSetDefault } from "@seldon/core/workspace/model/entry-icon-set"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import { useHistory } from "@app/workspace/hooks/use-history"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@app/hooks/commands/use-add-remove-commands"
import { useMoveCommands } from "@app/hooks/commands/use-move-commands"
import { useSelectCommands } from "@app/hooks/commands/use-select-commands"
import { resetChat } from "@app/hooks/use-ai-chat"
import { useDebugMode } from "@app/hooks/use-debug-mode"
import { useEditorConfig } from "@app/hooks/use-editor-config"
import { useImportExport } from "@app/hooks/use-import-export"
import { useNodeClipboardActions } from "@app/hooks/use-node-clipboard-actions"
import { usePanel } from "@app/hooks/use-panel"
import { usePreview } from "@app/hooks/use-preview"
import { useTool } from "@app/hooks/use-tool"
import { useZoomControls } from "@app/hooks/use-zoom-controls"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { MenuConfig, MenuItem } from "../menus/types"

/**
 * Builds the topbar menu configuration with all required menus and actions.
 */
export function useMenuConfig(): MenuConfig {
  // Import all the necessary hooks for the menu actions
  const navigate = useNavigate()
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const {
    showPanels,
    togglePanels,
    showSelection,
    toggleShowSelection,
    componentHighlightMode,
    setComponentHighlightMode,
    showFocus,
    toggleShowFocus,
    wireframeMode,
    toggleWireframeMode,
    autoScrollToSelection,
    toggleAutoScrollToSelection,
    autoExpandOnSelection,
    toggleAutoExpandOnSelection,
    showUnusedProperties,
    toggleShowUnusedProperties,
    showUnusedFonts,
    toggleShowUnusedFonts,
    showUnusedIcons,
    toggleShowUnusedIcons,
    showPlayground,
    toggleShowPlayground,
    showCodeNames,
    toggleShowCodeNames,
  } = useEditorConfig()
  const { dispatch, workspace } = useWorkspace()
  const {
    canvasProfiling,
    toggleCanvasProfiling,
    showNodeIds,
    toggleShowNodeIds,
    showNodeTypes,
    toggleShowNodeTypes,
    showPropertyTypes,
    toggleShowPropertyTypes,
    verboseLogging,
    toggleVerboseLogging,
    dispatchLogging,
    toggleDispatchLogging,
    workspaceLogging,
    toggleWorkspaceLogging,
    aiLogging,
    toggleAiLogging,
    showTools,
    toggleShowTools,
    showOutcome,
    toggleShowOutcome,
    noThink,
    toggleNoThink,
  } = useDebugMode()
  const { copyNode, cutNode, pasteNode } = useNodeClipboardActions()
  const {
    exportWorkspaceToFile,
    exportSelectionToClipboard,
    copySchemaJsonToClipboard,
    importWorkspaceFromFile,
    importWeb,
  } = useImportExport()
  const { addVariant, deleteSelection, duplicateSelection } =
    useAddRemoveCommands()
  const {
    moveSelectionForward,
    moveSelectionBackward,
    moveSelectionToFront,
    moveSelectionToBack,
    canMoveForward,
    canMoveBackward,
    canMoveToFront,
    canMoveToBack,
  } = useMoveCommands()
  const {
    selectOriginal,
    selectSource,
    selectParent,
    selectFirstChild,
    selectNextSibling,
    selectPreviousSibling,
    canSelectOriginal,
    canSelectSource,
    canSelectParent,
    canSelectFirstChild,
    canSelectNextSibling,
    canSelectPreviousSibling,
  } = useSelectCommands()
  const { undo, redo } = useHistory()
  const {
    selectedNode,
    selectedBoard,
    selection,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()
  const addToast = useAddToast()
  const { setActiveTool } = useTool()
  const { activePanel, openPanel, closePanel } = usePanel()

  const canDeleteSelection = useMemo(() => {
    if (selectedNode) return true

    if (selectedBoard) {
      if (
        isComponentBoard(selectedBoard) ||
        isPlaygroundBoard(selectedBoard) ||
        isMediaBoard(selectedBoard)
      ) {
        return true
      }
      // The default Seldon theme board and the System font collection board are
      // always kept. Other theme and font collection boards can be removed.
      if (isThemeBoard(selectedBoard)) {
        return (
          resolveComponentKey(selectedBoard, workspace) !==
          DEFAULT_THEME_BOARD_KEY
        )
      }
      if (isFontCollectionBoard(selectedBoard)) {
        return (
          resolveComponentKey(selectedBoard, workspace) !==
          DEFAULT_FONT_COLLECTION_BOARD_KEY
        )
      }
      // The default Seldon icon set board is always kept. Other icon set boards
      // can be removed.
      if (isIconSetBoard(selectedBoard)) {
        return (
          resolveComponentKey(selectedBoard, workspace) !==
          DEFAULT_ICON_SET_BOARD_KEY
        )
      }
      return false
    }

    if (selectedThemeEntryId) {
      const entry = workspace.themes[selectedThemeEntryId]
      return Boolean(entry) && !isEntryThemeDefault(entry)
    }

    if (selectedFontCollectionEntryId) {
      const entry = workspace["font-collections"][selectedFontCollectionEntryId]
      return Boolean(entry) && !isEntryFontCollectionDefault(entry)
    }

    if (selectedIconSetEntryId) {
      const entry = workspace["icon-sets"][selectedIconSetEntryId]
      return Boolean(entry) && !isEntryIconSetDefault(entry)
    }

    return false
  }, [
    selectedNode,
    selectedBoard,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    workspace,
  ])

  const goToProjects = useCallback(() => {
    navigate("/")
  }, [navigate])

  // Get zoom controls from the hook
  const { zoomIn, zoomOut, resetZoom } = useZoomControls()

  const fileMenuItems = useMemo(() => {
    const items = [
      {
        id: "import-file",
        label: "Open Workspace…",
        action: async () => {
          const result = await selectFile()
          if (!result.success) return
          await importWorkspaceFromFile(result.file)
        },
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
      "separator",
      {
        id: "export-folder",
        label: "Export Components…",
        action: () => {
          openPanel("export-components")
          setActiveTool("select")
        },
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "export-workspace",
        label: "Save Workspace As…",
        action: exportWorkspaceToFile,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "projects",
        label: "Back to Workspaces",
        action: goToProjects,
        shortcut: "⇧ Q",
      },
    ]

    return items
  }, [
    openPanel,
    setActiveTool,
    exportWorkspaceToFile,
    goToProjects,
    importWorkspaceFromFile,
  ])

  const devMenuItems = useMemo(() => {
    const items: (MenuItem | "separator")[] = [
      {
        id: "import-web",
        label: "Import Web…",
        action: importWeb,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "show-playground",
        label: "Show Playgrounds",
        action: toggleShowPlayground,
        active: showPlayground,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
      {
        id: "copy-schema-json",
        label: "Copy Schema JSON",
        action: copySchemaJsonToClipboard,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "canvas-profiling",
        label: "Canvas Profiling",
        action: toggleCanvasProfiling,
        active: canvasProfiling,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "show-node-ids",
        label: "Show Node IDs",
        action: toggleShowNodeIds,
        active: showNodeIds,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "show-node-types",
        label: "Show Node Types",
        action: toggleShowNodeTypes,
        active: showNodeTypes,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "show-property-types",
        label: "Show Property Types",
        action: toggleShowPropertyTypes,
        active: showPropertyTypes,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "dispatch-logging",
        label: "Dispatch Logging",
        action: toggleDispatchLogging,
        active: dispatchLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "verbose-logging",
        label: "Verbose Logging",
        action: toggleVerboseLogging,
        active: verboseLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "workspace-logging",
        label: "Workspace Logging",
        action: toggleWorkspaceLogging,
        active: workspaceLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "ai-logging",
        label: "AI Logging",
        action: toggleAiLogging,
        active: aiLogging,
        visibleIn: ["edit", "preview"],
      },
    ]

    if (process.env.NODE_ENV === "development") {
      items.push("separator")
      items.push({
        id: "load-editor-workspace",
        label: "Load Editor Workspace",
        action: () => {
          addToast("Test workspace fixture is not available yet.")
        },
      })
    }

    return items
  }, [
    addToast,
    importWeb,
    exportSelectionToClipboard,
    copySchemaJsonToClipboard,
    showPlayground,
    toggleShowPlayground,
    canvasProfiling,
    toggleCanvasProfiling,
    showNodeIds,
    toggleShowNodeIds,
    showNodeTypes,
    toggleShowNodeTypes,
    showPropertyTypes,
    toggleShowPropertyTypes,
    verboseLogging,
    toggleVerboseLogging,
    dispatchLogging,
    toggleDispatchLogging,
    workspaceLogging,
    toggleWorkspaceLogging,
    aiLogging,
    toggleAiLogging,
  ])

  const editMenuItems = useMemo(() => {
    const items = [
      {
        id: "undo",
        label: "Undo",
        action: undo,
        shortcut: "⌘ Z",
      },
      {
        id: "redo",
        label: "Redo",
        action: redo,
        shortcut: "⌘ ⇧ Z",
      },
      "separator",
      {
        id: "cut",
        label: "Cut",
        action: cutNode,
        shortcut: "⌘ X",
      },
      {
        id: "copy",
        label: "Copy",
        action: copyNode,
        shortcut: "⌘ C",
      },
      {
        id: "paste",
        label: "Paste",
        action: pasteNode,
        shortcut: "⌘ V",
      },
      "separator",
      {
        id: "delete",
        label: "Delete",
        action: deleteSelection,
        shortcut: "Delete",
        enabled: canDeleteSelection,
      },
      {
        id: "duplicate",
        label: "Duplicate",
        action: duplicateSelection,
        shortcut: "⌘ D",
        enabled: Boolean(selectedNode),
      },
    ]

    return items
  }, [
    undo,
    redo,
    cutNode,
    copyNode,
    pasteNode,
    deleteSelection,
    canDeleteSelection,
    duplicateSelection,
    selectedNode,
  ])

  const selectionMenuItems = useMemo(() => {
    const items = [
      {
        id: "create-component",
        label: "Create Component",
        action: () => {
          openPanel("create-component")
          setActiveTool("select")
        },
        shortcut: "T",
      },
      "separator",
      {
        id: "insert-component",
        label: "Insert Component",
        action: () => setActiveTool("component"),
        shortcut: "I",
      },
      {
        id: "add-component",
        label: "Add Component",
        action: () => {
          openPanel("add-board")
          setActiveTool("select")
        },
        shortcut: "A",
      },
      {
        id: "add-variant",
        label: "Add Variant",
        action: addVariant,
        shortcut: "⇧ A",
        enabled: Boolean(selectedBoard),
      },
      "separator",
      {
        id: "move-to-front",
        label: "Move to Front",
        action: moveSelectionToFront,
        shortcut: "⇧ [",
        enabled: canMoveToFront,
      },
      {
        id: "move-forward",
        label: "Move Forward",
        action: moveSelectionForward,
        shortcut: "[",
        enabled: canMoveForward,
      },
      {
        id: "move-backward",
        label: "Move Backward",
        action: moveSelectionBackward,
        shortcut: "]",
        enabled: canMoveBackward,
      },
      {
        id: "move-to-back",
        label: "Move to Back",
        action: moveSelectionToBack,
        shortcut: "⇧ ]",
        enabled: canMoveToBack,
      },
      "separator",
      {
        id: "select-parent",
        label: "Select Parent",
        action: selectParent,
        shortcut: "⇧ <",
        enabled: canSelectParent,
      },
      {
        id: "select-previous-sibling",
        label: "Select Previous Sibling",
        action: selectPreviousSibling,
        shortcut: "<",
        enabled: canSelectPreviousSibling,
      },
      {
        id: "select-next-sibling",
        label: "Select Next Sibling",
        action: selectNextSibling,
        shortcut: ">",
        enabled: canSelectNextSibling,
      },
      {
        id: "select-first-child",
        label: "Select First Child",
        action: selectFirstChild,
        shortcut: "⇧ >",
        enabled: canSelectFirstChild,
      },
      "separator",
      {
        id: "select-source",
        label: "Select Source",
        action: selectSource,
        shortcut: "⌥ ~",
        enabled: canSelectSource,
      },
      {
        id: "select-original",
        label: "Select Original",
        action: selectOriginal,
        shortcut: "⇧ ~",
        enabled: canSelectOriginal,
      },
    ]

    return items
  }, [
    setActiveTool,
    openPanel,
    addVariant,
    selectedBoard,
    moveSelectionForward,
    moveSelectionBackward,
    moveSelectionToFront,
    moveSelectionToBack,
    canMoveForward,
    canMoveBackward,
    canMoveToFront,
    canMoveToBack,
    selection,
    selectParent,
    canSelectParent,
    selectFirstChild,
    canSelectFirstChild,
    selectPreviousSibling,
    canSelectPreviousSibling,
    selectNextSibling,
    canSelectNextSibling,
    selectOriginal,
    canSelectOriginal,
    selectSource,
    canSelectSource,
  ])

  const isChatOpen = activePanel === "ai-chat"
  const hariMenuItems = useMemo(() => {
    const items: (MenuItem | "separator")[] = [
      {
        id: "show-chat",
        label: "Show Chat",
        action: () => (isChatOpen ? closePanel() : openPanel("ai-chat")),
        active: isChatOpen,
        shortcut: "~",
      },
      "separator",
      {
        id: "show-output",
        label: "Show Output",
        action: toggleShowOutcome,
        active: showOutcome,
      },
      {
        id: "show-tools",
        label: "Show Tools",
        action: toggleShowTools,
        active: showTools,
      },
      "separator",
      {
        id: "clamp-thinking",
        label: "Clamp Thinking",
        action: toggleNoThink,
        active: noThink,
      },
      "separator",
      {
        id: "reset-chat",
        label: "Reset Chat",
        action: resetChat,
      },
    ]

    return items
  }, [
    isChatOpen,
    closePanel,
    openPanel,
    showOutcome,
    toggleShowOutcome,
    showTools,
    toggleShowTools,
    noThink,
    toggleNoThink,
  ])

  // Build menu configuration
  const menuConfig: MenuConfig = useMemo(
    () => [
      {
        id: "file",
        label: "File",
        items: fileMenuItems as MenuItem[],
      },
      {
        id: "edit",
        label: "Edit",
        visibleIn: ["edit", "preview"], // Not visible in project view
        items: editMenuItems as MenuItem[],
      },
      {
        id: "component",
        label: "Component",
        visibleIn: ["edit", "preview"], // Not visible in project view
        items: selectionMenuItems as MenuItem[],
      },
      {
        id: "hari",
        label: "Hari",
        visibleIn: ["edit", "preview"], // Not visible in project view
        items: hariMenuItems as MenuItem[],
      },
      {
        id: "view",
        label: "View",
        visibleIn: ["edit", "preview"], // Not visible in project view
        items: [
          {
            id: "preview-mode",
            label: "Preview Mode",
            action: togglePreviewMode,
            active: isInPreviewMode,
            shortcut: "P",
            enabled: false,
          },
          {
            id: "toggle-ui",
            label: showPanels ? "Hide Interface" : "Show Interface",
            action: togglePanels,
            active: !showPanels,
            shortcut: "\\",
          },
          "separator",
          {
            id: "auto-expand-selection",
            label: "Expand Tree to Selection",
            action: toggleAutoExpandOnSelection,
            active: autoExpandOnSelection,
          },
          {
            id: "auto-scroll-selection",
            label: "Scroll to Selection",
            action: toggleAutoScrollToSelection,
            active: autoScrollToSelection,
          },
          "separator",
          {
            id: "show-hover",
            label: "Show Hover",
            action: toggleShowSelection,
            active: showSelection,
            shortcut: "H",
          },
          {
            id: "wireframe-mode",
            label: "Show Wireframes",
            action: toggleWireframeMode,
            active: wireframeMode === "on",
            shortcut: "W",
          },
          "separator",
          {
            id: "show-focus",
            label: "Show Keyboard Focus",
            action: toggleShowFocus,
            active: showFocus,
          },
          "separator",
          {
            id: "show-selection",
            label: "Show Selection",
            action: () => setComponentHighlightMode("selection"),
            active: componentHighlightMode === "selection",
            activeMarker: "bullet",
          },
          {
            id: "show-leaves",
            label: "Show Leaves",
            action: () => setComponentHighlightMode("leaves"),
            active: componentHighlightMode === "leaves",
            activeMarker: "bullet",
          },
          {
            id: "show-branch",
            label: "Show Branch",
            action: () => setComponentHighlightMode("branch"),
            active: componentHighlightMode === "branch",
            activeMarker: "bullet",
          },
          {
            id: "show-tree",
            label: "Show Tree",
            action: () => setComponentHighlightMode("tree"),
            active: componentHighlightMode === "tree",
            activeMarker: "bullet",
          },
          "separator",
          {
            id: "show-code-names",
            label: "Show Code Names",
            action: toggleShowCodeNames,
            active: showCodeNames,
          },
          "separator",
          {
            id: "show-unused-properties",
            label: "Show Unused Properties",
            action: toggleShowUnusedProperties,
            active: showUnusedProperties,
            shortcut: "R",
          },
          {
            id: "show-unused-fonts",
            label: "Show Unused Fonts",
            action: toggleShowUnusedFonts,
            active: showUnusedFonts,
            shortcut: "F",
          },
          {
            id: "show-unused-icons",
            label: "Show Unused Icons",
            action: toggleShowUnusedIcons,
            active: showUnusedIcons,
            shortcut: "I",
          },
          "separator",
          {
            id: "actual-size",
            label: "Actual Size",
            action: resetZoom,
            shortcut: "⌘ 0",
          },
          {
            id: "zoom-in",
            label: "Zoom In",
            action: zoomIn,
            shortcut: "⌘ +",
          },
          {
            id: "zoom-out",
            label: "Zoom Out",
            action: zoomOut,
            shortcut: "⌘ -",
          },
        ],
      },
      {
        id: "dev",
        label: "Dev",
        items: devMenuItems,
      },
    ],
    [
      fileMenuItems,
      editMenuItems,
      selectionMenuItems,
      hariMenuItems,
      devMenuItems,
      togglePreviewMode,
      isInPreviewMode,
      togglePanels,
      showPanels,
      toggleShowSelection,
      showSelection,
      componentHighlightMode,
      setComponentHighlightMode,
      toggleShowFocus,
      showFocus,
      toggleWireframeMode,
      wireframeMode,
      autoExpandOnSelection,
      toggleAutoExpandOnSelection,
      autoScrollToSelection,
      toggleAutoScrollToSelection,
      resetZoom,
      zoomIn,
      zoomOut,
      showUnusedProperties,
      toggleShowUnusedProperties,
      showUnusedFonts,
      toggleShowUnusedFonts,
      showUnusedIcons,
      toggleShowUnusedIcons,
      showCodeNames,
      toggleShowCodeNames,
    ],
  )

  return menuConfig
}
