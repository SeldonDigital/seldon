import { useBoardStateStore } from "@app/canvas/hooks/use-board-state-store"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useToggleIsolation } from "@app/editor/hooks/use-toggle-isolation"
import { useTool } from "@app/editor/hooks/use-tool"
import { useRefBadges } from "@app/refs/use-ref-badges"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useHistory } from "@app/workspace/hooks/use-history"
import { useNodeClipboardActions } from "@app/workspace/hooks/use-node-clipboard-actions"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router"

import { NORMAL_STATE, RESERVED_STATE_GROUPS } from "@seldon/core/workspace/model/node-state"

import { useAddRemoveCommands } from "./use-add-remove-commands"
import { useMoveCommands } from "./use-move-commands"
import { useSelectCommands } from "./use-select-commands"

/**
 * Reserved states in menu order, matching `useBoardStateMenu`. Index 0 is
 * Normal and the rest follow `RESERVED_STATE_GROUPS`, so Option-1 through
 * Option-0 map top to bottom to Normal through Dragged.
 */
const STATE_SHORTCUT_ORDER = [
  NORMAL_STATE,
  ...RESERVED_STATE_GROUPS.flatMap((group) => group.states),
]

export function useEditorShortcuts() {
  const { addVariant, deleteSelection, duplicateSelection } = useAddRemoveCommands()
  const { moveSelectionForward, moveSelectionBackward, moveSelectionToFront, moveSelectionToBack } =
    useMoveCommands()
  const {
    selectOriginal,
    selectSource,
    selectParent,
    selectFirstChild,
    selectPreviousSibling,
    selectNextSibling,
  } = useSelectCommands()

  const { undo, redo } = useHistory()
  const { activeTool, setActiveTool } = useTool()
  const { copyNode, pasteNode, cutNode } = useNodeClipboardActions()
  const {
    togglePanels,
    toggleShowSelection,
    toggleWireframeMode,
    toggleShowConnectors,
    isolatedView,
    toggleShowUnusedProperties,
    toggleShowUnusedFonts,
    toggleShowUnusedIcons,
    toggleDirectSelect,
    toggleLayoutBadges,
    toggleSpaceBadges,
    toggleDimensionBadges,
    toggleAppearanceBadges,
    toggleTypographyBadges,
    toggleEffectsBadges,
  } = useEditorConfig()
  const { toggleRefBadges } = useRefBadges()
  const { toggleIsolation } = useToggleIsolation()
  const { activePanel, openPanel, closePanel } = usePanel()
  const navigate = useNavigate()

  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()
  const setActiveState = useBoardStateStore((store) => store.setActiveState)

  const selectBoardState = (index: number) => {
    if (!activeBoard) return
    const state = STATE_SHORTCUT_ORDER[index]

    if (!state) return
    setActiveState(resolveComponentKey(activeBoard, workspace), state)
  }

  // Undo redo
  useHotkeys("mod+z", undo, { preventDefault: true })
  useHotkeys("mod+shift+z", redo, { preventDefault: true })

  // Copy/paste
  useHotkeys("mod+c", copyNode)
  useHotkeys("mod+v", pasteNode)
  useHotkeys("mod+x", cutNode)

  // Delete/copy/move nodes
  useHotkeys("backspace, delete", deleteSelection, {
    enabled: !activePanel,
  })
  useHotkeys("meta+d", duplicateSelection, {
    preventDefault: true,
    enableOnFormTags: true,
  })

  // Add component (opens the add-board dialog) / add variant
  useHotkeys(
    "alt+c",
    () => {
      openPanel("add-board")
      setActiveTool("select")
    },
    { preventDefault: true },
  )
  useHotkeys("shift+alt+c", addVariant, { preventDefault: true })

  // Create authored component (opens the create-component dialog)
  useHotkeys(
    "c",
    () => {
      openPanel("create-component")
      setActiveTool("select")
    },
    { preventDefault: true },
  )

  // Toggle the Hari chat palette
  useHotkeys(
    "`",
    () => {
      if (activePanel === "ai-chat") closePanel()
      else openPanel("ai-chat")
    },
    { preventDefault: true },
  )
  useHotkeys("[", moveSelectionForward, {
    preventDefault: true,
  })
  useHotkeys("]", moveSelectionBackward, {
    preventDefault: true,
  })
  useHotkeys("shift+[", moveSelectionToFront, {
    preventDefault: true,
  })
  useHotkeys("shift+]", moveSelectionToBack, {
    preventDefault: true,
  })

  // Selection
  // Selects the source node one hop up the template chain
  useHotkeys("alt+`", selectSource, {
    preventDefault: true,
  })
  // Selects the original node at the top of the template chain
  useHotkeys("shift+`", selectOriginal, {
    preventDefault: true,
  })
  // Structural navigation across the tree
  useHotkeys("comma", selectPreviousSibling, {
    preventDefault: true,
  })
  useHotkeys("period", selectNextSibling, {
    preventDefault: true,
  })
  useHotkeys("shift+comma", selectParent, {
    preventDefault: true,
  })
  useHotkeys("shift+period", selectFirstChild, {
    preventDefault: true,
  })

  // Toggle panels
  useHotkeys("backslash", togglePanels, { preventDefault: true })

  // Interaction state, Option-1 (Normal) through Option-0 (Dragged).
  useHotkeys("alt+1", () => selectBoardState(0), { preventDefault: true })
  useHotkeys("alt+2", () => selectBoardState(1), { preventDefault: true })
  useHotkeys("alt+3", () => selectBoardState(2), { preventDefault: true })
  useHotkeys("alt+4", () => selectBoardState(3), { preventDefault: true })
  useHotkeys("alt+5", () => selectBoardState(4), { preventDefault: true })
  useHotkeys("alt+6", () => selectBoardState(5), { preventDefault: true })
  useHotkeys("alt+7", () => selectBoardState(6), { preventDefault: true })
  useHotkeys("alt+8", () => selectBoardState(7), { preventDefault: true })
  useHotkeys("alt+9", () => selectBoardState(8), { preventDefault: true })
  useHotkeys("alt+0", () => selectBoardState(9), { preventDefault: true })

  // Exit the insert component tool
  useHotkeys("esc", () => setActiveTool("select"), {
    enabled: activeTool === "component",
  })

  // Header tools
  useHotkeys("shift+c", () => setActiveTool("component"), {
    preventDefault: true,
  }) // prevent the character from being typed after the trigger
  useHotkeys("v", () => setActiveTool("select"))

  // Isolation mode
  useHotkeys("i", toggleIsolation, { preventDefault: true })

  // Direct select mode
  useHotkeys("a", toggleDirectSelect, { preventDefault: true })

  // Selection overlay visibility
  useHotkeys("h", () => toggleShowSelection(), { preventDefault: true })

  // Wireframe mode
  useHotkeys("w", () => toggleWireframeMode(), { preventDefault: true })

  // Component connector overlay, which only draws in isolation mode
  useHotkeys("e", () => isolatedView && toggleShowConnectors(), { preventDefault: true })

  // Ref connector overlay. Turning it on reads the linked folder, which needs this
  // keypress to count as the gesture.
  useHotkeys("r", () => toggleRefBadges(), { preventDefault: true })

  // Token badge groups, Shift-1 through Shift-6 in View menu order.
  useHotkeys("shift+1", () => toggleLayoutBadges(), { preventDefault: true })
  useHotkeys("shift+2", () => toggleSpaceBadges(), { preventDefault: true })
  useHotkeys("shift+3", () => toggleDimensionBadges(), { preventDefault: true })
  useHotkeys("shift+4", () => toggleAppearanceBadges(), { preventDefault: true })
  useHotkeys("shift+5", () => toggleTypographyBadges(), { preventDefault: true })
  useHotkeys("shift+6", () => toggleEffectsBadges(), { preventDefault: true })

  // Show unused properties / fonts / icons in the properties sidebar.
  useHotkeys("p", () => toggleShowUnusedProperties(), { preventDefault: true })
  useHotkeys("f", () => toggleShowUnusedFonts(), { preventDefault: true })
  useHotkeys("n", () => toggleShowUnusedIcons(), { preventDefault: true })

  // Back to workspaces
  useHotkeys("shift+q", () => navigate("/"), { preventDefault: true })
}
