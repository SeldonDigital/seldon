"use client"

import { resetChat } from "@app/ai/use-ai-chat"
import { useZoomControls } from "@app/canvas/hooks/use-zoom-controls"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useMoveCommands } from "@app/commands/use-move-commands"
import { useSelectCommands } from "@app/commands/use-select-commands"
import { useDebugMode } from "@app/editor/hooks/use-debug-mode"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useToggleIsolation } from "@app/editor/hooks/use-toggle-isolation"
import { useTool } from "@app/editor/hooks/use-tool"
import { useImportExport } from "@app/io/use-import-export"
import { linkWorkspaceFolder } from "@app/project/hooks/use-project-link"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useRefBadges } from "@app/refs/use-ref-badges"
import { loadRefBindings } from "@app/refs/use-ref-bindings"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useHistory } from "@app/workspace/hooks/use-history"
import { useNodeClipboardActions } from "@app/workspace/hooks/use-node-clipboard-actions"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
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

import type { MenuConfig, MenuItem } from "../menus/types"

/**
 * Builds the topbar menu configuration with all required menus and actions.
 */
export function useMenuConfig(): MenuConfig {
  // Import all the necessary hooks for the menu actions
  const navigate = useNavigate()
  const { toggleIsolation, canToggleIsolation } = useToggleIsolation()
  const {
    showPanels,
    togglePanels,
    propertiesFloating,
    propertiesFloatingOpen,
    propertiesDockedOpen,
    showProperties,
    showSelection,
    toggleShowSelection,
    showFocus,
    toggleShowFocus,
    wireframeMode,
    toggleWireframeMode,
    showConnectors,
    toggleShowConnectors,
    showLayoutBadges,
    toggleLayoutBadges,
    showSpaceBadges,
    toggleSpaceBadges,
    showDimensionBadges,
    toggleDimensionBadges,
    showAppearanceBadges,
    toggleAppearanceBadges,
    showTypographyBadges,
    toggleTypographyBadges,
    showEffectsBadges,
    toggleEffectsBadges,
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
    isolatedView,
    directSelect,
    toggleDirectSelect,
  } = useEditorConfig()
  const { showRefBadges, toggleRefBadges } = useRefBadges()
  const { workspace } = useWorkspace()
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
  const { addVariant, deleteSelection, duplicateSelection } = useAddRemoveCommands()
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
  const workspaceId = useWorkspaceId()
  const { setActiveTool } = useTool()
  const { openPanel, aiChatOpen, openAiChat, closeAiChat } = usePanel()

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
        return resolveComponentKey(selectedBoard, workspace) !== DEFAULT_THEME_BOARD_KEY
      }

      if (isFontCollectionBoard(selectedBoard)) {
        return resolveComponentKey(selectedBoard, workspace) !== DEFAULT_FONT_COLLECTION_BOARD_KEY
      }

      // The default Seldon icon set board is always kept. Other icon set boards
      // can be removed.
      if (isIconSetBoard(selectedBoard)) {
        return resolveComponentKey(selectedBoard, workspace) !== DEFAULT_ICON_SET_BOARD_KEY
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

  // Points the workspace at the components folder in the user's own project, so the
  // ref overlays can read what that project reports back. An export from the editor
  // links its own folder, so this is for the projects it never touched.
  //
  // The read is asked for here, because the reader watches the workspace rather than
  // the link. Nothing about the open workspace changed, so a card would otherwise
  // keep reporting the link it had before this one.
  const linkWorkspace = useCallback(async () => {
    if (!workspaceId) return

    const { ok, message } = await linkWorkspaceFolder(workspaceId)

    if (message) addToast(message)
    if (ok) void loadRefBindings(workspaceId)
  }, [addToast, workspaceId])

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
        visibleIn: ["edit"], // Not visible in project view
      },
      "separator",
      {
        id: "export-folder",
        label: "Export Components…",
        action: () => {
          openPanel("export-components")
          setActiveTool("select")
        },
        visibleIn: ["edit"],
      },
      {
        id: "link-workspace",
        label: "Link Workspace…",
        action: linkWorkspace,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "export-workspace",
        label: "Save Workspace As…",
        action: exportWorkspaceToFile,
        visibleIn: ["edit"],
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
    linkWorkspace,
  ])

  const devMenuItems = useMemo(() => {
    const items: (MenuItem | "separator")[] = [
      {
        id: "import-web",
        label: "Import Web…",
        action: importWeb,
        visibleIn: ["edit"],
      },
      {
        id: "show-playground",
        label: "Show Playgrounds",
        action: toggleShowPlayground,
        active: showPlayground,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit"], // Not visible in project view
      },
      {
        id: "copy-schema-json",
        label: "Copy Schema JSON",
        action: copySchemaJsonToClipboard,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "canvas-profiling",
        label: "Canvas Profiling",
        action: toggleCanvasProfiling,
        active: canvasProfiling,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "show-node-ids",
        label: "Show Node IDs",
        action: toggleShowNodeIds,
        active: showNodeIds,
        visibleIn: ["edit"],
      },
      {
        id: "show-node-types",
        label: "Show Node Types",
        action: toggleShowNodeTypes,
        active: showNodeTypes,
        visibleIn: ["edit"],
      },
      {
        id: "show-property-types",
        label: "Show Property Types",
        action: toggleShowPropertyTypes,
        active: showPropertyTypes,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "dispatch-logging",
        label: "Dispatch Logging",
        action: toggleDispatchLogging,
        active: dispatchLogging,
        visibleIn: ["edit"],
      },
      {
        id: "verbose-logging",
        label: "Verbose Logging",
        action: toggleVerboseLogging,
        active: verboseLogging,
        visibleIn: ["edit"],
      },
      {
        id: "workspace-logging",
        label: "Workspace Logging",
        action: toggleWorkspaceLogging,
        active: workspaceLogging,
        visibleIn: ["edit"],
      },
      {
        id: "ai-logging",
        label: "AI Logging",
        action: toggleAiLogging,
        active: aiLogging,
        visibleIn: ["edit"],
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
      "separator",
      {
        id: "direct-select",
        label: "Direct Select Mode",
        action: toggleDirectSelect,
        active: directSelect,
        shortcut: "A",
      },
      {
        id: "isolated-view",
        label: "Isolation Mode",
        action: toggleIsolation,
        active: isolatedView,
        shortcut: "I",
        enabled: canToggleIsolation,
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
    toggleDirectSelect,
    directSelect,
    toggleIsolation,
    isolatedView,
    canToggleIsolation,
  ])

  const selectionMenuItems = useMemo(() => {
    const items = [
      {
        id: "insert-component",
        label: "Insert Component",
        action: () => setActiveTool("component"),
        shortcut: "C",
      },
      "separator",
      {
        id: "create-component",
        label: "Create Component",
        action: () => {
          openPanel("create-component")
          setActiveTool("select")
        },
        shortcut: "⇧ C",
      },
      {
        id: "add-component",
        label: "Add Component",
        action: () => {
          openPanel("add-board")
          setActiveTool("select")
        },
        shortcut: "⌥ C",
      },
      {
        id: "add-variant",
        label: "Add Variant",
        action: addVariant,
        shortcut: "⇧ ⌥ C",
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

  const isChatOpen = aiChatOpen
  const hariMenuItems = useMemo(() => {
    const items: (MenuItem | "separator")[] = [
      {
        id: "show-chat",
        label: "Show Chat",
        action: () => (isChatOpen ? closeAiChat() : openAiChat()),
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
    closeAiChat,
    openAiChat,
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
        visibleIn: ["edit"], // Not visible in project view
        items: editMenuItems as MenuItem[],
      },
      {
        id: "component",
        label: "Component",
        visibleIn: ["edit"], // Not visible in project view
        items: selectionMenuItems as MenuItem[],
      },
      {
        id: "hari",
        label: "Hari",
        visibleIn: ["edit"], // Not visible in project view
        items: hariMenuItems as MenuItem[],
      },
      {
        id: "view",
        label: "View",
        visibleIn: ["edit"], // Not visible in project view
        items: [
          {
            id: "toggle-ui",
            label: showPanels ? "Hide Interface" : "Show Interface",
            action: togglePanels,
            active: !showPanels,
            shortcut: "\\",
          },
          {
            id: "show-properties",
            label: "Show Properties",
            action: showProperties,
            active: propertiesFloating ? propertiesFloatingOpen : propertiesDockedOpen,
            shortcut: "P",
          },
          "separator",
          {
            id: "show-layout-badges",
            label: "Show Layout",
            action: toggleLayoutBadges,
            active: showLayoutBadges,
            shortcut: "⇧ 1",
          },
          {
            id: "show-space-badges",
            label: "Show Space",
            action: toggleSpaceBadges,
            active: showSpaceBadges,
            shortcut: "⇧ 2",
          },
          {
            id: "show-dimension-badges",
            label: "Show Dimension",
            action: toggleDimensionBadges,
            active: showDimensionBadges,
            shortcut: "⇧ 3",
          },
          {
            id: "show-appearance-badges",
            label: "Show Appearance",
            action: toggleAppearanceBadges,
            active: showAppearanceBadges,
            shortcut: "⇧ 4",
          },
          {
            id: "show-typography-badges",
            label: "Show Typography",
            action: toggleTypographyBadges,
            active: showTypographyBadges,
            shortcut: "⇧ 5",
          },
          {
            id: "show-effects-badges",
            label: "Show Effects",
            action: toggleEffectsBadges,
            active: showEffectsBadges,
            shortcut: "⇧ 6",
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
          {
            id: "show-connectors",
            label: "Show Connectors",
            action: toggleShowConnectors,
            active: showConnectors,
            shortcut: "E",
            enabled: isolatedView,
          },
          {
            id: "show-reference-badges",
            label: "Show Reference",
            action: toggleRefBadges,
            active: showRefBadges,
            shortcut: "R",
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
            id: "show-code-names",
            label: "Show Code Names",
            action: toggleShowCodeNames,
            active: showCodeNames,
          },
          {
            id: "show-unused-properties",
            label: "Show Unused Properties",
            action: toggleShowUnusedProperties,
            active: showUnusedProperties,
            shortcut: "U",
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
            shortcut: "N",
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
      togglePanels,
      showPanels,
      showProperties,
      propertiesFloating,
      propertiesFloatingOpen,
      propertiesDockedOpen,
      toggleShowSelection,
      showSelection,
      toggleShowFocus,
      showFocus,
      toggleWireframeMode,
      wireframeMode,
      showConnectors,
      toggleShowConnectors,
      isolatedView,
      showRefBadges,
      toggleRefBadges,
      showLayoutBadges,
      toggleLayoutBadges,
      showSpaceBadges,
      toggleSpaceBadges,
      showDimensionBadges,
      toggleDimensionBadges,
      showAppearanceBadges,
      toggleAppearanceBadges,
      showTypographyBadges,
      toggleTypographyBadges,
      showEffectsBadges,
      toggleEffectsBadges,
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
