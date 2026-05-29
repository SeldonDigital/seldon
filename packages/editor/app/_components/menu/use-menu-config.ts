"use client"

import { selectFile } from "@lib/utils/select-file"
import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useMoveCommands } from "@lib/hooks/commands/use-move-commands"
import { useSelectCommands } from "@lib/hooks/commands/use-select-commands"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useImportExport } from "@lib/hooks/use-import-export"
import { useNodeClipboardActions } from "@lib/hooks/use-node-clipboard-actions"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useZoomControls } from "@lib/hooks/use-zoom-controls"
import { useHistory } from "@lib/workspace/use-history"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"
import { HeaderConfig, MenuConfig, MenuItem, ToolbarConfig } from "./types"

/**
 * Builds header configuration with all required menus and actions
 */
export function useMenuConfig(): HeaderConfig {
  // Import all the necessary hooks for the menu actions
  const router = useRouter()
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
  const { deleteSelection, duplicateSelection } = useAddRemoveCommands()
  const { moveSelectionDown, moveSelectionUp } = useMoveCommands()
  const {
    selectOriginalNode,
    selectVariant,
    canSelectOriginal,
    canSelectVariant,
  } = useSelectCommands()
  const { undo, redo } = useHistory()
  const { selectedNode, selection } = useSelection()
  const addToast = useAddToast()
  const { setActiveTool } = useTool()

  const goToProjects = useCallback(() => {
    router.push("/")
  }, [router])

  // Get zoom controls from the hook
  const { zoomIn, zoomOut, resetZoom } = useZoomControls()

  const fileMenuItems = useMemo(() => {
    const items = [
      {
        id: "export-folder",
        label: "Export to folder…",
        action: exportToFolder,
        visibleIn: ["edit", "preview"],
      },
    ]

    if (process.env.NODE_ENV === "development") {
      items.push(
        "separator",
        {
          id: "import-test-workspace",
          label: "Import Test Workspace",
          action: () => {
            addToast("Test workspace fixture is not available yet.")
          },
        },
      )
    }

    items.push(
      "separator",
      {
        id: "import-file",
        label: "Import Workspace",
        action: async () => {
          const result = await selectFile()
          if (!result.success) return
          await importWorkspaceFromFile(result.file)
        },
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
      {
        id: "export-workspace",
        label: "Export Workspace JSON",
        action: exportWorkspaceToFile,
        visibleIn: ["edit", "preview"],
      },
    )

    if (debugModeEnabled) {
      items.push({
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit", "preview"], // Not visible in project view
      })
    }

    items.push(
      "separator",
      {
        id: "projects",
        label: "Back to Workspaces…",
        action: goToProjects,
        shortcut: "⇧ Q",
      },
    )

    return items
  }, [
    addToast,
    debugModeEnabled,
    exportSelectionToClipboard,
    exportToFolder,
    exportWorkspaceToFile,
    goToProjects,
    importWorkspaceFromFile,
    dispatch,
    workspace,
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
        enabled: Boolean(selection),
      },
      {
        id: "duplicate",
        label: "Duplicate",
        action: duplicateSelection,
        shortcut: "⌘ D",
        enabled: Boolean(selectedNode),
      },
      "separator",
      {
        id: "select",
        label: "Select",
        action: () => setActiveTool("select"),
        shortcut: "V",
      },
      {
        id: "insert-component",
        label: "Insert Component",
        action: () => setActiveTool("component"),
        shortcut: "C",
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
    selection,
    duplicateSelection,
    selectedNode,
    setActiveTool,
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
            label: "Auto Expand on Selection",
            action: toggleAutoExpandOnSelection,
            active: autoExpandOnSelection,
          },
          {
            id: "auto-scroll-selection",
            label: "Auto Scroll To Selection",
            action: toggleAutoScrollToSelection,
            active: autoScrollToSelection,
          },
          "separator",
          {
            id: "show-unused-properties",
            label: "Show Unused Properties",
            action: toggleShowUnusedProperties,
            active: showUnusedProperties,
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
        id: "help",
        label: "Help",
        items: [
          {
            id: "debug-mode",
            label: "Enable Debug Mode",
            action: toggleDebugMode,
            active: debugModeEnabled,
            visibleIn: ["edit", "preview"], // Not visible in project view
          },
        ],
      },
    ],
    [
      fileMenuItems,
      editMenuItems,
      selectionMenuItems,
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
