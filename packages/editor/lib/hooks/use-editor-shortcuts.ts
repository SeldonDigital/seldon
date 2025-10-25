import { useHotkeys } from "react-hotkeys-hook"
import { useHistory } from "@lib/workspace/use-history"
import { useAddRemoveCommands } from "./commands/use-add-remove-commands"
import { useMoveCommands } from "./commands/use-move-commands"
import { useSelectCommands } from "./commands/use-select-commands"
import { useChat } from "./use-chat"
import { useDialog } from "./use-dialog"
import { useEditorConfig } from "./use-editor-config"
import { useNodeClipboardActions } from "./use-node-clipboard-actions"
import { usePreview } from "./use-preview"
import { useTool } from "./use-tool"

export function useEditorShortcuts() {
  const { deleteSelection, duplicateSelection } = useAddRemoveCommands()
  const { moveSelectionDown, moveSelectionUp } = useMoveCommands()
  const { selectOriginalNode, selectVariant } = useSelectCommands()

  const { undo, redo } = useHistory()
  const { setActiveTool } = useTool()
  const { toggleChat } = useChat()
  const { copyNode, pasteNode, cutNode } = useNodeClipboardActions()
  const { togglePanels, toggleWireframeMode } = useEditorConfig()
  const { togglePreviewMode, setDevice, isInPreviewMode } = usePreview()
  const { activeDialog } = useDialog()

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

  // Chat
  useHotkeys("/", toggleChat, { preventDefault: true })

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

  // Chat & catalog tab
  useHotkeys("esc", () => togglePreviewMode(false), {
    enabled: isInPreviewMode,
  }) // we want this to work even if the chat input is focussed

  // Header tools
  useHotkeys("c", () => setActiveTool("component"), {
    preventDefault: true,
  }) // prevent the character from being typed after the trigger
  useHotkeys("v", () => setActiveTool("select"))

  // Preview mode
  useHotkeys("p", () => togglePreviewMode(), { preventDefault: true })

  // Wireframe mode
  useHotkeys("w", () => toggleWireframeMode(), { preventDefault: true })
}
