"use client"

import { useAddToast } from "@components/toaster/use-add-toast"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useMoveCommands } from "@lib/hooks/commands/use-move-commands"
import { useSelectCommands } from "@lib/hooks/commands/use-select-commands"
import { useActionDebugger } from "@lib/hooks/use-action-debugger"
import { useChat } from "@lib/hooks/use-chat"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useImportExport } from "@lib/hooks/use-import-export"
import { useNodeClipboardActions } from "@lib/hooks/use-node-clipboard-actions"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import { useZoomControls } from "@lib/hooks/use-zoom-controls"
import { useProjectId } from "@lib/project/hooks/use-project-id"
import { selectFile } from "@lib/utils/select-file"
import { useHistory } from "@lib/workspace/use-history"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { computeWorkspace } from "@seldon/factory/helpers/compute-workspace"
import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "wouter"

import { TEST_WORKSPACE } from "../../scripts/test-workspace"
import { HeaderConfig, MenuConfig, MenuItem, ToolbarConfig } from "./types"

/**
 * Builds header configuration with all required menus and actions
 */
export function useMenuConfig(): HeaderConfig {
  // Import all the necessary hooks for the menu actions
  const { showChat, toggleChat } = useChat()
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const {
    showPanels,
    togglePanels,
    wireframeMode,
    toggleWireframeMode,
    autoScrollToSelection,
    toggleAutoScrollToSelection,
    showUnusedProperties,
    toggleShowUnusedProperties,
  } = useEditorConfig()
  const { dispatch, workspace } = useWorkspace()
  const { showActionDebugger, toggleActionDebugger } = useActionDebugger()
  const { debugModeEnabled, toggleDebugMode } = useDebugMode()
  const { copyNode, cutNode, pasteNode } = useNodeClipboardActions()
  const {
    exportWorkspaceToFile,
    exportCustomTheme,
    exportSelectionToClipboard,
    importWorkspaceFromFile,
  } = useImportExport()
  const { deleteSelection, duplicateSelection } = useAddRemoveCommands()
  const { moveSelectionDown, moveSelectionUp } = useMoveCommands()
  const { selectOriginalNode, selectVariant } = useSelectCommands()
  const { undo, redo } = useHistory()
  const { selectedNode, selection } = useSelection()
  const { projectId } = useProjectId()

  const addToast = useAddToast()

  // Use the useTool hook to activate the catalog tool
  const { setActiveTool } = useTool()

  // State for export dialog
  const [searchParams] = useSearchParams()
  const showExportDialogParam = searchParams.get("export")

  const [showExportDialog, setShowExportDialog] = useState(
    Boolean(showExportDialogParam),
  )

  // Navigation and dialog actions
  const renameProject = useCallback(() => alert("TODO: Rename project"), [])

  const exportToGithub = useCallback(() => {
    setShowExportDialog(true)
  }, [setShowExportDialog])

  const goToProjects = useCallback(() => {
    window.location.href = "/"
    // Force a refresh to ensure state is updated
    // window.location.reload();
  }, [])

  // Get zoom controls from the hook
  const { zoomIn, zoomOut, resetZoom } = useZoomControls()

  const shouldIncludeActionDebugger = import.meta.env.DEV && debugModeEnabled

  const fileMenuItems = useMemo(() => {
    const items = [
      {
        id: "projects",
        label: "Open Project Browser…",
        action: goToProjects,
        // Always visible in all modes
      },
      {
        id: "rename-project",
        label: "Rename Project…",
        action: renameProject,
        visibleIn: ["edit", "preview"], // Only visible in edit mode
      },
      "separator",
      {
        id: "component",
        label: "Insert Component",
        action: () => setActiveTool("component"),
        shortcut: "C",
        visibleIn: ["edit", "preview"], // Only visible in edit mode
      },
      "separator",
      {
        id: "export-github",
        label: "Publish Changes to GitHub…",
        action: exportToGithub,
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
    ]

    if (import.meta.env.DEV) {
      items.push(
        "separator",
        {
          id: "import-test-workspace",
          label: "Import Test Workspace",
          action: () =>
            dispatch({
              type: "set_workspace",
              payload: { workspace: TEST_WORKSPACE },
            }),
        },
        {
          id: "compute-workspace",
          label: "Compute Workspace",
          action: () => {
            const copy = JSON.parse(JSON.stringify(workspace))
            const _workspace = computeWorkspace(copy)
            // eslint-disable-next-line no-console
            console.log("Computed workspace:", _workspace)
            addToast("Copied computed workspace to console")
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
        label: "Export Workspace",
        action: exportWorkspaceToFile,
        visibleIn: ["edit", "preview"], // Not visible in project view
      },
      {
        id: "export-custom-theme",
        label: "Export Custom Theme",
        action: exportCustomTheme,
        visibleIn: ["edit", "preview"], // Not visible in project view
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

    return items
  }, [
    addToast,
    debugModeEnabled,
    exportCustomTheme,
    exportSelectionToClipboard,
    exportToGithub,
    exportWorkspaceToFile,
    goToProjects,
    importWorkspaceFromFile,
    renameProject,
    dispatch,
    setActiveTool,
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
        id: "start-chat",
        label: "Start Chat",
        action: toggleChat,
        active: showChat,
        shortcut: "/",
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
    toggleChat,
    showChat,
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
        enabled: Boolean(selectedNode && "instanceOf" in selectedNode),
      },
      {
        id: "select-variant",
        label: "Select Variant",
        action: selectVariant,
        shortcut: "⌥ `",
        enabled: Boolean(selectedNode && "variant" in selectedNode),
      },
    ]

    return items
  }, [
    moveSelectionUp,
    selection,
    moveSelectionDown,
    selectOriginalNode,
    selectedNode,
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
            id: "show-unused-properties",
            label: "Show Unused Properties",
            action: toggleShowUnusedProperties,
            active: showUnusedProperties,
          },
          {
            id: "wireframe-mode",
            label: "Show Wireframes",
            action: toggleWireframeMode,
            active: wireframeMode === "on",
            shortcut: "W",
          },
          {
            id: "auto-scroll-selection",
            label: "Auto Scroll To Selection",
            action: toggleAutoScrollToSelection,
            active: autoScrollToSelection,
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
          // Conditionally add the action debugger menu item
          ...(shouldIncludeActionDebugger
            ? [
                {
                  id: "action-debugger",
                  label: "Show Action Debugger",
                  action: toggleActionDebugger,
                  active: showActionDebugger,
                  visibleIn: ["edit", "preview"], // Not visible in project view
                } as MenuItem,
              ]
            : []),
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
      toggleWireframeMode,
      wireframeMode,
      autoScrollToSelection,
      toggleAutoScrollToSelection,
      resetZoom,
      zoomIn,
      zoomOut,
      toggleDebugMode,
      debugModeEnabled,
      shouldIncludeActionDebugger,
      toggleActionDebugger,
      showActionDebugger,
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

  const dialogs = useMemo(() => {
    return {
      showExportDialog,
      setShowExportDialog,
    }
  }, [showExportDialog, setShowExportDialog])

  return {
    menuConfig,
    toolbarConfig,
    dialogs,
  }
}
