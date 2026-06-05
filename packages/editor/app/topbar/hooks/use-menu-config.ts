"use client"

import { selectFile } from "@lib/utils/select-file"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "@seldon/core/workspace/helpers/font-collections/seed-default-font-collection-board"
import { DEFAULT_THEME_BOARD_KEY } from "@seldon/core/workspace/helpers/themes/seed-default-theme-board"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { useNavigate } from "react-router"
import { useCallback, useMemo } from "react"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useMoveCommands } from "@lib/hooks/commands/use-move-commands"
import { useSelectCommands } from "@lib/hooks/commands/use-select-commands"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useDialog } from "@lib/hooks/use-dialog"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useImportExport } from "@lib/hooks/use-import-export"
import { useNodeClipboardActions } from "@lib/hooks/use-node-clipboard-actions"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useZoomControls } from "@lib/hooks/use-zoom-controls"
import { useHistory } from "@lib/workspace/use-history"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/hooks/use-add-toast"
import { HeaderConfig, MenuConfig, MenuItem, ToolbarConfig } from "../menus/types"

/**
 * Builds header configuration with all required menus and actions
 */
export function useMenuConfig(): HeaderConfig {
  // Import all the necessary hooks for the menu actions
  const navigate = useNavigate()
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const {
    showPanels,
    togglePanels,
    showSelection,
    toggleShowSelection,
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
  } = useEditorConfig()
  const { dispatch, workspace } = useWorkspace()
  const { debugModeEnabled, toggleDebugMode } = useDebugMode()
  const { copyNode, cutNode, pasteNode } = useNodeClipboardActions()
  const {
    exportWorkspaceToFile,
    exportSelectionToClipboard,
    importWorkspaceFromFile,
    exportToFolder,
  } = useImportExport()
  const { addVariant, deleteSelection, duplicateSelection } =
    useAddRemoveCommands()
  const { moveSelectionDown, moveSelectionUp } = useMoveCommands()
  const {
    selectOriginalNode,
    selectVariant,
    canSelectOriginal,
    canSelectVariant,
  } = useSelectCommands()
  const { undo, redo } = useHistory()
  const {
    selectedNode,
    selectedBoard,
    selection,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
  } = useSelection()
  const addToast = useAddToast()
  const { setActiveTool } = useTool()
  const { openDialog } = useDialog()

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
      // Icon-set catalog boards cannot be removed.
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

    return false
  }, [
    selectedNode,
    selectedBoard,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
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
        label: "Import Workspace…",
        action: async () => {
          const result = await selectFile()
          if (!result.success) return
          await importWorkspaceFromFile(result.file)
        },
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
      {
        id: "export-workspace",
        label: "Export Workspace JSON…",
        action: exportWorkspaceToFile,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "export-folder",
        label: "Export Components…",
        action: exportToFolder,
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
    exportToFolder,
    exportWorkspaceToFile,
    goToProjects,
    importWorkspaceFromFile,
  ])

  const debugMenuItems = useMemo(() => {
    const items: MenuItem[] = []

    if (process.env.NODE_ENV === "development") {
      items.push({
        id: "load-editor-workspace",
        label: "Load Editor Workspace",
        action: () => {
          addToast("Test workspace fixture is not available yet.")
        },
      })
    }

    if (debugModeEnabled) {
      items.push({
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit", "preview"], // Not visible in project view
      })
    }

    items.push({
      id: "debug-mode",
      label: "Enable Debug Mode",
      action: toggleDebugMode,
      active: debugModeEnabled,
      visibleIn: ["edit", "preview"], // Not visible in project view
    })

    return items
  }, [
    addToast,
    debugModeEnabled,
    exportSelectionToClipboard,
    toggleDebugMode,
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
        id: "add-component",
        label: "Add Component",
        action: () => {
          openDialog("add-board")
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
    openDialog,
    setActiveTool,
    addVariant,
    selectedBoard,
    deleteSelection,
    canDeleteSelection,
    duplicateSelection,
    selectedNode,
  ])

  const selectionMenuItems = useMemo(() => {
    const items = [
      {
        id: "move-up",
        label: "Move Up",
        action: moveSelectionUp,
        shortcut: "⌘ [",
        enabled: Boolean(selection),
      },
      {
        id: "move-down",
        label: "Move Down",
        action: moveSelectionDown,
        shortcut: "⌘ ]",
        enabled: Boolean(selection),
      },
      "separator",
      {
        id: "select-original",
        label: "Select Original",
        action: selectOriginalNode,
        shortcut: "⇧ `",
        enabled: canSelectOriginal,
      },
      {
        id: "select-variant",
        label: "Select Variant",
        action: selectVariant,
        shortcut: "⌥ `",
        enabled: canSelectVariant,
      },
    ]

    return items
  }, [
    moveSelectionUp,
    selection,
    moveSelectionDown,
    selectOriginalNode,
    canSelectOriginal,
    canSelectVariant,
    selectVariant,
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
        id: "selection",
        label: "Selection",
        visibleIn: ["edit", "preview"], // Not visible in project view
        items: selectionMenuItems as MenuItem[],
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
            id: "show-selection",
            label: "Show Selection",
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
            id: "auto-expand-selection",
            label: "Expand Tree on Selection",
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
        id: "debug",
        label: "Debug",
        items: debugMenuItems as MenuItem[],
      },
    ],
    [
      fileMenuItems,
      editMenuItems,
      selectionMenuItems,
      debugMenuItems,
      togglePreviewMode,
      isInPreviewMode,
      togglePanels,
      showPanels,
      toggleShowSelection,
      showSelection,
      toggleWireframeMode,
      wireframeMode,
      autoExpandOnSelection,
      toggleAutoExpandOnSelection,
      autoScrollToSelection,
      toggleAutoScrollToSelection,
      resetZoom,
      zoomIn,
      zoomOut,
      toggleDebugMode,
      debugModeEnabled,
      showUnusedProperties,
      toggleShowUnusedProperties,
      showUnusedFonts,
      toggleShowUnusedFonts,
    ],
  )

  // Toolbar configuration is no longer needed as we've integrated tools into the header
  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      visible: false, // We don't use the separate toolbar anymore
    }),
    [],
  )

  return {
    menuConfig,
    toolbarConfig,
    dialogs: {},
  }
}
