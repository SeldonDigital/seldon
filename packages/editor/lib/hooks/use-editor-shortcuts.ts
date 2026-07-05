import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router"
import {
  NORMAL_STATE,
  RESERVED_STATE_GROUPS,
} from "@seldon/core/workspace/model/node-state"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useHistory } from "@lib/workspace/hooks/use-history"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { useBoardStateStore } from "@app/canvas/hooks/use-board-state-store"
import { useAddRemoveCommands } from "./commands/use-add-remove-commands"
import { useMoveCommands } from "./commands/use-move-commands"
import { useSelectCommands } from "./commands/use-select-commands"
import { useDialog } from "./use-dialog"
import { useEditorConfig } from "./use-editor-config"
import { useNodeClipboardActions } from "./use-node-clipboard-actions"
import { usePreview } from "./use-preview"
import { useTool } from "./use-tool"

/**
 * Reserved states in menu order, matching `BoardStateSwitcher`. Index 0 is
 * Normal and the rest follow `RESERVED_STATE_GROUPS`, so Option-1 through
 * Option-0 map top to bottom to Normal through Dragged.
 */
const STATE_SHORTCUT_ORDER = [
  NORMAL_STATE,
  ...RESERVED_STATE_GROUPS.flatMap((group) => group.states),
]

export function useEditorShortcuts() {
  const { addVariant, deleteSelection, duplicateSelection } =
    useAddRemoveCommands()
  const {
    moveSelectionForward,
    moveSelectionBackward,
    moveSelectionToFront,
    moveSelectionToBack,
  } = useMoveCommands()
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
    toggleShowUnusedProperties,
    toggleShowUnusedFonts,
    toggleShowUnusedIcons,
  } = useEditorConfig()
  const { togglePreviewMode, setDevice, isInPreviewMode } = usePreview()
  const { activeDialog, openDialog } = useDialog()
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
    enabled: !activeDialog,
  })
  useHotkeys("meta+d", duplicateSelection, {
    preventDefault: true,
    enableOnFormTags: true,
  })

  // Add component (opens the add-board dialog) / add variant
  useHotkeys(
    "a",
    () => {
      openDialog("add-board")
      setActiveTool("select")
    },
    { preventDefault: true },
  )
  useHotkeys("shift+a", addVariant, { preventDefault: true })

  // Open the AI chat palette
  useHotkeys("mod+j", () => openDialog("ai-chat"), {
    preventDefault: true,
    enableOnFormTags: true,
  })
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

  // Device view
  useHotkeys("1", () => setDevice("desktop"), {
    preventDefault: true,
  })
  useHotkeys("2", () => setDevice("laptop"), {
    preventDefault: true,
  })
  useHotkeys("3", () => setDevice("tablet"), {
    preventDefault: true,
  })
  useHotkeys("4", () => setDevice("phone"), {
    preventDefault: true,
  })
  useHotkeys("5", () => setDevice("watch"), {
    preventDefault: true,
  })
  useHotkeys("6", () => setDevice("tv"), {
    preventDefault: true,
  })

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

  useHotkeys("esc", () => togglePreviewMode(false), {
    enabled: isInPreviewMode,
  })

  // Exit the insert component tool
  useHotkeys("esc", () => setActiveTool("select"), {
    enabled: activeTool === "component",
  })

  // Header tools
  useHotkeys("i", () => setActiveTool("component"), {
    preventDefault: true,
  }) // prevent the character from being typed after the trigger
  useHotkeys("v", () => setActiveTool("select"))

  // Preview mode
  useHotkeys("p", () => togglePreviewMode(), { preventDefault: true })

  // Selection overlay visibility
  useHotkeys("h", () => toggleShowSelection(), { preventDefault: true })

  // Wireframe mode
  useHotkeys("w", () => toggleWireframeMode(), { preventDefault: true })

  // Show unused properties / fonts / icons in the properties sidebar.
  useHotkeys("r", () => toggleShowUnusedProperties(), { preventDefault: true })
  useHotkeys("f", () => toggleShowUnusedFonts(), { preventDefault: true })
  useHotkeys("n", () => toggleShowUnusedIcons(), { preventDefault: true })

  // Back to workspaces
  useHotkeys("shift+q", () => navigate("/"), { preventDefault: true })
}
