import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router"
import { useHistory } from "@lib/workspace/hooks/use-history"
import { useHasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useAddRemoveCommands } from "./commands/use-add-remove-commands"
import { useMoveCommands } from "./commands/use-move-commands"
import { useSelectCommands } from "./commands/use-select-commands"
import { useDialog } from "./use-dialog"
import { useEditorConfig } from "./use-editor-config"
import { useNodeClipboardActions } from "./use-node-clipboard-actions"
import { usePreview } from "./use-preview"
import { useTool } from "./use-tool"

export function useEditorShortcuts() {
  const { addVariant, deleteSelection, duplicateSelection } =
    useAddRemoveCommands()
  const { moveSelectionDown, moveSelectionUp } = useMoveCommands()
  const { selectOriginalNode, selectVariant } = useSelectCommands()

  const { undo, redo } = useHistory()
  const { setActiveTool } = useTool()
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
  const isHoveringCanvas = useHasHoverState()

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
  useHotkeys("mod+[", moveSelectionUp, {
    preventDefault: true,
  })
  useHotkeys("mod+]", moveSelectionDown, {
    preventDefault: true,
  })

  // Selection
  // Selects the original variant of the currently selected node
  useHotkeys("alt+`", selectVariant, {
    preventDefault: true,
  })
  // Selects the node that the currently selected node instantiates
  useHotkeys("shift+`", selectOriginalNode, {
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

  useHotkeys("esc", () => togglePreviewMode(false), {
    enabled: isInPreviewMode,
  })

  // Header tools
  useHotkeys("c", () => setActiveTool("component"), {
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
  // The canvas binds `i` to its tool action while hovering, so gate this global
  // toggle to fire only when the canvas is not hovered.
  useHotkeys("r", () => toggleShowUnusedProperties(), { preventDefault: true })
  useHotkeys("f", () => toggleShowUnusedFonts(), { preventDefault: true })
  useHotkeys("i", () => toggleShowUnusedIcons(), {
    preventDefault: true,
    enabled: !isHoveringCanvas,
  })

  // Back to workspaces
  useHotkeys("shift+q", () => navigate("/"), { preventDefault: true })
}
