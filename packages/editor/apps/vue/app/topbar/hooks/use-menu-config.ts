import { useAiChatStore } from "@app/ai/ai-chat-store"
import { useZoomControlsStore } from "@app/canvas/zoom-controls-store"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useMoveCommands } from "@app/commands/use-move-commands"
import { useSelectCommands } from "@app/commands/use-select-commands"
import { useDebugStore } from "@app/editor/debug-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useToggleIsolation } from "@app/editor/use-toggle-isolation"
import { useImportExport } from "@app/io/use-import-export"
import { useProjectLinkStore } from "@app/project/project-link-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useRefBindingsStore } from "@app/refs/ref-bindings-store"
import { useRefBadges } from "@app/refs/use-ref-badges"
import { useToastStore } from "@app/toaster/toast-store"
import { getChromeThemes } from "@app/topbar/chrome-themes"
import { useHistoryStore } from "@app/workspace/history-store"
import { useNodeClipboardActions } from "@app/workspace/use-node-clipboard-actions"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed } from "vue"
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
import type { ComputedRef } from "vue"

/**
 * Builds the topbar menu configuration: the dropdown menus (File, Edit, View,
 * Component, Hari, Window, Dev) with their items, shortcuts, active/enabled
 * state, and app-state visibility, wired to the Vue stores and command
 * composables. The Window menu holds the interface toggle, properties toggle,
 * selection-follow options, interface mode, chrome themes, and zoom. Returns a
 * reactive `MenuConfig` so highlight and enabled state stay live. Mirrors the
 * React `useMenuConfig`.
 */
export function useMenuConfig(): ComputedRef<MenuConfig> {
  const router = useRouter()
  const config = useEditorConfigStore()
  const debug = useDebugStore()
  const panel = usePanelStore()
  const { toggleIsolation, canToggleIsolation } = useToggleIsolation()
  const { toggleRefBadges } = useRefBadges()
  const tool = useToolStore()
  const history = useHistoryStore()
  const aiChat = useAiChatStore()
  const toast = useToastStore()
  const projectLink = useProjectLinkStore()
  const refBindings = useRefBindingsStore()
  const workspaceId = useWorkspaceId()
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
  const zoom = useZoomControlsStore()

  const canDeleteSelection = computed(() => {
    if (selectedNode.value) return true

    const board = selectedBoard.value

    if (board) {
      if (isComponentBoard(board) || isPlaygroundBoard(board) || isMediaBoard(board)) {
        return true
      }

      if (isThemeBoard(board)) {
        return resolveComponentKey(board, workspace.value) !== DEFAULT_THEME_BOARD_KEY
      }

      if (isFontCollectionBoard(board)) {
        return resolveComponentKey(board, workspace.value) !== DEFAULT_FONT_COLLECTION_BOARD_KEY
      }

      if (isIconSetBoard(board)) {
        return resolveComponentKey(board, workspace.value) !== DEFAULT_ICON_SET_BOARD_KEY
      }

      return false
    }

    if (selectedThemeEntryId.value) {
      const entry = workspace.value.themes[selectedThemeEntryId.value]

      return Boolean(entry) && !isEntryThemeDefault(entry)
    }

    if (selectedFontCollectionEntryId.value) {
      const entry = workspace.value["font-collections"][selectedFontCollectionEntryId.value]

      return Boolean(entry) && !isEntryFontCollectionDefault(entry)
    }

    if (selectedIconSetEntryId.value) {
      const entry = workspace.value["icon-sets"][selectedIconSetEntryId.value]

      return Boolean(entry) && !isEntryIconSetDefault(entry)
    }

    return false
  })

  // Points the workspace at the components folder in the user's own project, so the
  // ref overlays can read what that project reports back. An export from the editor
  // links its own folder, so this is for the projects it never touched.
  //
  // The read is asked for here, because the reader watches the workspace rather than
  // the link. Nothing about the open workspace changed, so a card would otherwise
  // keep reporting the link it had before this one.
  async function linkWorkspace(): Promise<void> {
    const id = workspaceId.value

    if (!id) return

    const { ok, message } = await projectLink.linkWorkspaceFolder(id)

    if (message) toast.addToast(message)
    if (ok) void refBindings.load(id)
  }

  const fileMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "import-file",
      label: "Open Workspace…",
      action: async () => {
        const result = await selectFile()

        if (!result.success) return
        await importWorkspaceFromFile(result.file)
      },
      visibleIn: ["edit"],
    },
    "separator",
    {
      id: "export-folder",
      label: "Export Components…",
      action: () => {
        panel.openPanel("export-components")
        tool.setActiveTool("select")
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
    "separator",
    {
      id: "direct-select",
      label: "Direct Select Mode",
      action: config.toggleDirectSelect,
      active: config.directSelect,
      shortcut: "A",
    },
    {
      id: "isolated-view",
      label: "Isolation Mode",
      action: toggleIsolation,
      active: config.isolatedView,
      shortcut: "I",
      enabled: canToggleIsolation.value,
    },
  ])

  const selectionMenuItems = computed<(MenuItem | "separator")[]>(() => [
    {
      id: "insert-component",
      label: "Insert Component",
      action: () => tool.setActiveTool("component"),
      shortcut: "C",
    },
    "separator",
    {
      id: "create-component",
      label: "Create Component",
      action: () => {
        panel.openPanel("create-component")
        tool.setActiveTool("select")
      },
      shortcut: "⇧ C",
    },
    {
      id: "add-component",
      label: "Add Component",
      action: () => {
        panel.openPanel("add-board")
        tool.setActiveTool("select")
      },
      shortcut: "⌥ C",
    },
    {
      id: "add-variant",
      label: "Add Variant",
      action: addVariant,
      shortcut: "⇧ ⌥ C",
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
    const isChatOpen = panel.aiChatOpen

    return [
      {
        id: "show-chat",
        label: "Show Chat",
        action: () => (isChatOpen ? panel.closeAiChat() : panel.openAiChat()),
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
        visibleIn: ["edit"],
      },
      {
        id: "show-playground",
        label: "Show Playgrounds",
        action: config.toggleShowPlayground,
        active: config.showPlayground,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "export-selected-node",
        label: "Copy Selection to Clipboard",
        action: exportSelectionToClipboard,
        visibleIn: ["edit"],
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
        action: debug.toggleCanvasProfiling,
        active: debug.canvasProfiling,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "show-node-ids",
        label: "Show Node IDs",
        action: debug.toggleShowNodeIds,
        active: debug.showNodeIds,
        visibleIn: ["edit"],
      },
      {
        id: "show-node-types",
        label: "Show Node Types",
        action: debug.toggleShowNodeTypes,
        active: debug.showNodeTypes,
        visibleIn: ["edit"],
      },
      {
        id: "show-property-types",
        label: "Show Property Types",
        action: debug.toggleShowPropertyTypes,
        active: debug.showPropertyTypes,
        visibleIn: ["edit"],
      },
      "separator",
      {
        id: "dispatch-logging",
        label: "Dispatch Logging",
        action: debug.toggleDispatchLogging,
        active: debug.dispatchLogging,
        visibleIn: ["edit"],
      },
      {
        id: "verbose-logging",
        label: "Verbose Logging",
        action: debug.toggleVerboseLogging,
        active: debug.verboseLogging,
        visibleIn: ["edit"],
      },
      {
        id: "workspace-logging",
        label: "Workspace Logging",
        action: debug.toggleWorkspaceLogging,
        active: debug.workspaceLogging,
        visibleIn: ["edit"],
      },
      {
        id: "ai-logging",
        label: "AI Logging",
        action: debug.toggleAiLogging,
        active: debug.aiLogging,
        visibleIn: ["edit"],
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
      id: "show-layout-badges",
      label: "Show Layout",
      action: config.toggleLayoutBadges,
      active: config.showLayoutBadges,
      shortcut: "⇧ 1",
    },
    {
      id: "show-space-badges",
      label: "Show Space",
      action: config.toggleSpaceBadges,
      active: config.showSpaceBadges,
      shortcut: "⇧ 2",
    },
    {
      id: "show-dimension-badges",
      label: "Show Dimension",
      action: config.toggleDimensionBadges,
      active: config.showDimensionBadges,
      shortcut: "⇧ 3",
    },
    {
      id: "show-appearance-badges",
      label: "Show Appearance",
      action: config.toggleAppearanceBadges,
      active: config.showAppearanceBadges,
      shortcut: "⇧ 4",
    },
    {
      id: "show-typography-badges",
      label: "Show Typography",
      action: config.toggleTypographyBadges,
      active: config.showTypographyBadges,
      shortcut: "⇧ 5",
    },
    {
      id: "show-effects-badges",
      label: "Show Effects",
      action: config.toggleEffectsBadges,
      active: config.showEffectsBadges,
      shortcut: "⇧ 6",
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
    {
      id: "show-connectors",
      label: "Show Connectors",
      action: config.toggleShowConnectors,
      active: config.showConnectors,
      shortcut: "E",
      enabled: config.isolatedView,
    },
    {
      id: "show-reference-badges",
      label: "Show Reference",
      action: toggleRefBadges,
      active: config.showRefBadges,
      shortcut: "R",
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
      id: "show-code-names",
      label: "Show Code Names",
      action: config.toggleShowCodeNames,
      active: config.showCodeNames,
    },
    {
      id: "show-unused-properties",
      label: "Show Unused Properties",
      action: config.toggleShowUnusedProperties,
      active: config.showUnusedProperties,
      shortcut: "U",
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
      shortcut: "N",
    },
  ])

  const chromeThemes = getChromeThemes()

  const windowMenuItems = computed<(MenuItem | "separator")[]>(() => {
    const modeItems: MenuItem[] = [
      {
        id: "mode-system",
        label: "Use System",
        action: () => config.setInterfaceMode("system"),
        active: config.interfaceMode === "system",
        activeMarker: "bullet",
      },
      {
        id: "mode-light",
        label: "Light Mode",
        action: () => config.setInterfaceMode("light"),
        active: config.interfaceMode === "light",
        activeMarker: "bullet",
      },
      {
        id: "mode-dark",
        label: "Dark Mode",
        action: () => config.setInterfaceMode("dark"),
        active: config.interfaceMode === "dark",
        activeMarker: "bullet",
      },
    ]

    const themeItems: MenuItem[] = chromeThemes.map((theme) => ({
      id: `chrome-theme-${theme.slug}`,
      label: theme.label,
      action: () => config.setChromeTheme(theme.slug),
      active: config.chromeTheme === theme.slug,
      activeMarker: "bullet",
    }))

    return [
      {
        id: "toggle-ui",
        label: config.showPanels ? "Hide Interface" : "Show Interface",
        action: config.togglePanels,
        active: !config.showPanels,
        shortcut: "\\",
      },
      {
        id: "show-properties",
        label: "Show Properties",
        action: config.showProperties,
        active: config.propertiesFloating
          ? config.propertiesFloatingOpen
          : config.propertiesDockedOpen,
        shortcut: "P",
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
      ...modeItems,
      "separator",
      ...themeItems,
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
    ]
  })

  return computed<MenuConfig>(() => [
    { id: "file", label: "File", items: fileMenuItems.value },
    {
      id: "edit",
      label: "Edit",
      visibleIn: ["edit"],
      items: editMenuItems.value,
    },
    {
      id: "component",
      label: "Component",
      visibleIn: ["edit"],
      items: selectionMenuItems.value,
    },
    {
      id: "hari",
      label: "Hari",
      visibleIn: ["edit"],
      items: hariMenuItems.value,
    },
    {
      id: "view",
      label: "View",
      visibleIn: ["edit"],
      items: viewMenuItems.value,
    },
    {
      id: "window",
      label: "Window",
      visibleIn: ["edit"],
      items: windowMenuItems.value,
    },
    {
      id: "dev",
      label: "Dev",
      items: devMenuItems.value,
    } satisfies MenuDropdown,
  ])
}
