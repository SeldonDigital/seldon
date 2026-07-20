import { useAiChatStore } from "@app/ai/ai-chat-store"
import { useZoomControlsStore } from "@app/canvas/zoom-controls-store"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useMoveCommands } from "@app/commands/use-move-commands"
import { useSelectCommands } from "@app/commands/use-select-commands"
import { useDebugStore } from "@app/editor/debug-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import { usePreviewModeStore } from "@app/editor/preview-mode-store"
import { useToolStore } from "@app/editor/tool-store"
import { useImportExport } from "@app/io/use-import-export"
import { useToastStore } from "@app/toaster/toast-store"
import { useHistoryStore } from "@app/workspace/history-store"
import { useNodeClipboardActions } from "@app/workspace/use-node-clipboard-actions"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { type ComputedRef, computed } from "vue"
import { useRouter } from "vue-router"

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

import type { MenuConfig, MenuDropdown, MenuItem } from "../menus/types"

/**
 * Builds the topbar menu configuration: the six dropdown menus (File, Edit,
 * Component, Hari, View, Dev) with their items, shortcuts, active/enabled state,
 * and app-state visibility, wired to the Vue stores and command composables.
 * Returns a reactive `MenuConfig` so highlight and enabled state stay live.
 * Mirrors the React `useMenuConfig`.
 */
export function useMenuConfig(): ComputedRef<MenuConfig> {
  const router = useRouter()
  const config = useEditorConfigStore()
  const debug = useDebugStore()
  const panel = usePanelStore()
  const previewMode = usePreviewModeStore()
  const tool = useToolStore()
  const history = useHistoryStore()
  const aiChat = useAiChatStore()
  const toast = useToastStore()
  const { workspace } = useWorkspace()

  const {
    selectedNode,
    selectedBoard,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()

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
  const zoom = useZoomControlsStore()

  const canDeleteSelection = computed(() => {
    if (selectedNode.value) return true

    const board = selectedBoard.value
    if (board) {
      if (
        isComponentBoard(board) ||
        isPlaygroundBoard(board) ||
        isMediaBoard(board)
      ) {
        return true
      }
      if (isThemeBoard(board)) {
        return (
          resolveComponentKey(board, workspace.value) !==
          DEFAULT_THEME_BOARD_KEY
        )
      }
      if (isFontCollectionBoard(board)) {
        return (
          resolveComponentKey(board, workspace.value) !==
          DEFAULT_FONT_COLLECTION_BOARD_KEY
        )
      }
      if (isIconSetBoard(board)) {
        return (
          resolveComponentKey(board, workspace.value) !==
          DEFAULT_ICON_SET_BOARD_KEY
        )
      }
      return false
    }

    if (selectedThemeEntryId.value) {
      const entry = workspace.value.themes[selectedThemeEntryId.value]
      return Boolean(entry) && !isEntryThemeDefault(entry)
    }
    if (selectedFontCollectionEntryId.value) {
      const entry =
        workspace.value["font-collections"][selectedFontCollectionEntryId.value]
      return Boolean(entry) && !isEntryFontCollectionDefault(entry)
    }
    if (selectedIconSetEntryId.value) {
      const entry = workspace.value["icon-sets"][selectedIconSetEntryId.value]
      return Boolean(entry) && !isEntryIconSetDefault(entry)
    }

    return false
  })

  const fileMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "import-file",
      label: "Open Workspace…",
      action: async () => {
        const result = await selectFile()
        if (!result.success) return
        await importWorkspaceFromFile(result.file)
      },
      visibleIn: ["edit", "preview"],
    },
    "separator",
    {
      id: "export-folder",
      label: "Export Components…",
      action: () => {
        panel.openPanel("export-components")
        tool.setActiveTool("select")
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
      action: () => void router.push("/"),
      shortcut: "⇧ Q",
    },
  ])

  const editMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "undo",
      label: "Undo",
      action: () => history.undo(),
      shortcut: "⌘ Z",
    },
    {
      id: "redo",
      label: "Redo",
      action: () => history.redo(),
      shortcut: "⌘ ⇧ Z",
    },
    "separator",
    { id: "cut", label: "Cut", action: cutNode, shortcut: "⌘ X" },
    { id: "copy", label: "Copy", action: copyNode, shortcut: "⌘ C" },
    { id: "paste", label: "Paste", action: pasteNode, shortcut: "⌘ V" },
    "separator",
    {
      id: "delete",
      label: "Delete",
      action: deleteSelection,
      shortcut: "Delete",
      enabled: canDeleteSelection.value,
    },
    {
      id: "duplicate",
      label: "Duplicate",
      action: duplicateSelection,
      shortcut: "⌘ D",
      enabled: Boolean(selectedNode.value),
    },
  ])

  const selectionMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "create-component",
      label: "Create Component",
      action: () => {
        panel.openPanel("create-component")
        tool.setActiveTool("select")
      },
      shortcut: "T",
    },
    "separator",
    {
      id: "insert-component",
      label: "Insert Component",
      action: () => tool.setActiveTool("component"),
      shortcut: "I",
    },
    {
      id: "add-component",
      label: "Add Component",
      action: () => {
        panel.openPanel("add-board")
        tool.setActiveTool("select")
      },
      shortcut: "A",
    },
    {
      id: "add-variant",
      label: "Add Variant",
      action: addVariant,
      shortcut: "⇧ A",
      enabled: Boolean(selectedBoard.value),
    },
    "separator",
    {
      id: "move-to-front",
      label: "Move to Front",
      action: moveSelectionToFront,
      shortcut: "⇧ [",
      enabled: canMoveToFront.value,
    },
    {
      id: "move-forward",
      label: "Move Forward",
      action: moveSelectionForward,
      shortcut: "[",
      enabled: canMoveForward.value,
    },
    {
      id: "move-backward",
      label: "Move Backward",
      action: moveSelectionBackward,
      shortcut: "]",
      enabled: canMoveBackward.value,
    },
    {
      id: "move-to-back",
      label: "Move to Back",
      action: moveSelectionToBack,
      shortcut: "⇧ ]",
      enabled: canMoveToBack.value,
    },
    "separator",
    {
      id: "select-parent",
      label: "Select Parent",
      action: selectParent,
      shortcut: "⇧ <",
      enabled: canSelectParent.value,
    },
    {
      id: "select-previous-sibling",
      label: "Select Previous Sibling",
      action: selectPreviousSibling,
      shortcut: "<",
      enabled: canSelectPreviousSibling.value,
    },
    {
      id: "select-next-sibling",
      label: "Select Next Sibling",
      action: selectNextSibling,
      shortcut: ">",
      enabled: canSelectNextSibling.value,
    },
    {
      id: "select-first-child",
      label: "Select First Child",
      action: selectFirstChild,
      shortcut: "⇧ >",
      enabled: canSelectFirstChild.value,
    },
    "separator",
    {
      id: "select-source",
      label: "Select Source",
      action: selectSource,
      shortcut: "⌥ ~",
      enabled: canSelectSource.value,
    },
    {
      id: "select-original",
      label: "Select Original",
      action: selectOriginal,
      shortcut: "⇧ ~",
      enabled: canSelectOriginal.value,
    },
  ])

  const hariMenuItems = computed<(MenuItem | "separator")[]>(() => {
    const isChatOpen = panel.activePanel === "ai-chat"
    return [
      {
        id: "show-chat",
        label: "Show Chat",
        action: () =>
          isChatOpen ? panel.closePanel() : panel.openPanel("ai-chat"),
        active: isChatOpen,
        shortcut: "~",
      },
      "separator",
      {
        id: "show-output",
        label: "Show Output",
        action: debug.toggleShowOutcome,
        active: debug.showOutcome,
      },
      {
        id: "show-tools",
        label: "Show Tools",
        action: debug.toggleShowTools,
        active: debug.showTools,
      },
      "separator",
      {
        id: "clamp-thinking",
        label: "Clamp Thinking",
        action: debug.toggleNoThink,
        active: debug.noThink,
      },
      "separator",
      { id: "reset-chat", label: "Reset Chat", action: () => aiChat.reset() },
    ]
  })

  const devMenuItems = computed<(MenuItem | "separator")[]>(() => {
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
        action: config.toggleShowPlayground,
        active: config.showPlayground,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit", "preview"],
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
        action: debug.toggleCanvasProfiling,
        active: debug.canvasProfiling,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "show-node-ids",
        label: "Show Node IDs",
        action: debug.toggleShowNodeIds,
        active: debug.showNodeIds,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "show-node-types",
        label: "Show Node Types",
        action: debug.toggleShowNodeTypes,
        active: debug.showNodeTypes,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "show-property-types",
        label: "Show Property Types",
        action: debug.toggleShowPropertyTypes,
        active: debug.showPropertyTypes,
        visibleIn: ["edit", "preview"],
      },
      "separator",
      {
        id: "dispatch-logging",
        label: "Dispatch Logging",
        action: debug.toggleDispatchLogging,
        active: debug.dispatchLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "verbose-logging",
        label: "Verbose Logging",
        action: debug.toggleVerboseLogging,
        active: debug.verboseLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "workspace-logging",
        label: "Workspace Logging",
        action: debug.toggleWorkspaceLogging,
        active: debug.workspaceLogging,
        visibleIn: ["edit", "preview"],
      },
      {
        id: "ai-logging",
        label: "AI Logging",
        action: debug.toggleAiLogging,
        active: debug.aiLogging,
        visibleIn: ["edit", "preview"],
      },
    ]

    if (import.meta.env.DEV) {
      items.push("separator")
      items.push({
        id: "load-editor-workspace",
        label: "Load Editor Workspace",
        action: () => {
          toast.addToast("Test workspace fixture is not available yet.")
        },
      })
    }

    return items
  })

  const viewMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "preview-mode",
      label: "Preview Mode",
      action: () => previewMode.togglePreviewMode(),
      active: previewMode.isInPreviewMode,
      shortcut: "P",
      enabled: false,
    },
    {
      id: "toggle-ui",
      label: config.showPanels ? "Hide Interface" : "Show Interface",
      action: config.togglePanels,
      active: !config.showPanels,
      shortcut: "\\",
    },
    "separator",
    {
      id: "auto-expand-selection",
      label: "Expand Tree to Selection",
      action: config.toggleAutoExpandOnSelection,
      active: config.autoExpandOnSelection,
    },
    {
      id: "auto-scroll-selection",
      label: "Scroll to Selection",
      action: config.toggleAutoScrollToSelection,
      active: config.autoScrollToSelection,
    },
    "separator",
    {
      id: "show-hover",
      label: "Show Hover",
      action: config.toggleShowSelection,
      active: config.showSelection,
      shortcut: "H",
    },
    {
      id: "wireframe-mode",
      label: "Show Wireframes",
      action: () => config.toggleWireframeMode(),
      active: config.wireframeMode === "on",
      shortcut: "W",
    },
    "separator",
    {
      id: "show-focus",
      label: "Show Keyboard Focus",
      action: config.toggleShowFocus,
      active: config.showFocus,
    },
    "separator",
    {
      id: "show-selection",
      label: "Show Selection",
      action: () => config.setComponentHighlightMode("selection"),
      active: config.componentHighlightMode === "selection",
      activeMarker: "bullet",
    },
    {
      id: "show-leaves",
      label: "Show Leaves",
      action: () => config.setComponentHighlightMode("leaves"),
      active: config.componentHighlightMode === "leaves",
      activeMarker: "bullet",
    },
    {
      id: "show-branch",
      label: "Show Branch",
      action: () => config.setComponentHighlightMode("branch"),
      active: config.componentHighlightMode === "branch",
      activeMarker: "bullet",
    },
    {
      id: "show-tree",
      label: "Show Tree",
      action: () => config.setComponentHighlightMode("tree"),
      active: config.componentHighlightMode === "tree",
      activeMarker: "bullet",
    },
    "separator",
    {
      id: "show-code-names",
      label: "Show Code Names",
      action: config.toggleShowCodeNames,
      active: config.showCodeNames,
    },
    "separator",
    {
      id: "show-unused-properties",
      label: "Show Unused Properties",
      action: config.toggleShowUnusedProperties,
      active: config.showUnusedProperties,
      shortcut: "R",
    },
    {
      id: "show-unused-fonts",
      label: "Show Unused Fonts",
      action: config.toggleShowUnusedFonts,
      active: config.showUnusedFonts,
      shortcut: "F",
    },
    {
      id: "show-unused-icons",
      label: "Show Unused Icons",
      action: config.toggleShowUnusedIcons,
      active: config.showUnusedIcons,
      shortcut: "I",
    },
    "separator",
    {
      id: "actual-size",
      label: "Actual Size",
      action: zoom.resetZoom,
      shortcut: "⌘ 0",
    },
    { id: "zoom-in", label: "Zoom In", action: zoom.zoomIn, shortcut: "⌘ +" },
    {
      id: "zoom-out",
      label: "Zoom Out",
      action: zoom.zoomOut,
      shortcut: "⌘ -",
    },
  ])

  return computed<MenuConfig>(() => [
    { id: "file", label: "File", items: fileMenuItems.value },
    {
      id: "edit",
      label: "Edit",
      visibleIn: ["edit", "preview"],
      items: editMenuItems.value,
    },
    {
      id: "component",
      label: "Component",
      visibleIn: ["edit", "preview"],
      items: selectionMenuItems.value,
    },
    {
      id: "hari",
      label: "Hari",
      visibleIn: ["edit", "preview"],
      items: hariMenuItems.value,
    },
    {
      id: "view",
      label: "View",
      visibleIn: ["edit", "preview"],
      items: viewMenuItems.value,
    },
    {
      id: "dev",
      label: "Dev",
      items: devMenuItems.value,
    } satisfies MenuDropdown,
  ])
}
