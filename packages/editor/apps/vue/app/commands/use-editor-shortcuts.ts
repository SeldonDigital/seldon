import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useToggleIsolation } from "@app/editor/use-toggle-isolation"
import { useRefBadges } from "@app/refs/use-ref-badges"
import { useHistoryStore } from "@app/workspace/history-store"
import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

import { useAddRemoveCommands } from "./use-add-remove-commands"
import { useMoveCommands } from "./use-move-commands"
import { useSelectCommands } from "./use-select-commands"

/** Whether the event originates from an editable field, where most shortcuts pause. */
function isTypingTarget(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null

  if (!target) return false
  const tag = target.tagName

  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

/**
 * Global keyboard shortcuts for the editor, mirroring the React
 * `useEditorShortcuts` bindings using a single keydown listener. Must be called
 * from a component setup so the listener is registered and cleaned up with the
 * component lifecycle. Clipboard and board-state shortcuts arrive with their
 * commands in later stages.
 */
export function useEditorShortcuts(): void {
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

  const history = useHistoryStore()
  const tool = useToolStore()
  const config = useEditorConfigStore()
  const { toggleIsolation } = useToggleIsolation()
  const { toggleRefBadges } = useRefBadges()
  const panel = usePanelStore()
  const router = useRouter()

  function handler(event: KeyboardEvent): void {
    const mod = event.metaKey || event.ctrlKey
    const { shiftKey: shift, altKey: alt } = event
    const key = event.key.toLowerCase()
    const typing = isTypingTarget(event)

    // Undo / redo (allowed while typing to match browser expectations).
    if (mod && key === "z" && !shift) {
      event.preventDefault()
      history.undo()

      return
    }

    if (mod && key === "z" && shift) {
      event.preventDefault()
      history.redo()

      return
    }

    // Duplicate is allowed on form tags in the React editor.
    if (mod && key === "d") {
      event.preventDefault()
      duplicateSelection()

      return
    }

    if (typing) return

    // Delete selection, disabled while a panel is open.
    if ((key === "backspace" || key === "delete") && !panel.activePanel) {
      deleteSelection()

      return
    }

    switch (key) {
      case "a":
        if (!mod && !shift && !alt) {
          event.preventDefault()
          config.toggleDirectSelect()
        }

        return
      case "c":
        // Copy is left to the browser, which is what holds the modifier.
        if (mod) return

        event.preventDefault()

        if (shift && alt) {
          addVariant()
        } else if (alt) {
          panel.openPanel("add-board")
          tool.setActiveTool("select")
        } else if (shift) {
          tool.setActiveTool("component")
        } else {
          panel.openPanel("create-component")
          tool.setActiveTool("select")
        }

        return
      case "`":
        event.preventDefault()

        if (alt) {
          selectSource()
        } else if (shift) {
          selectOriginal()
        } else if (panel.activePanel === "ai-chat") {
          panel.closePanel()
        } else {
          panel.openPanel("ai-chat")
        }

        return
      case "[":
        event.preventDefault()
        if (shift) moveSelectionToFront()
        else moveSelectionForward()

        return
      case "]":
        event.preventDefault()
        if (shift) moveSelectionToBack()
        else moveSelectionBackward()

        return
      case ",":
        event.preventDefault()
        if (shift) selectParent()
        else selectPreviousSibling()

        return
      case ".":
        event.preventDefault()
        if (shift) selectFirstChild()
        else selectNextSibling()

        return
      case "\\":
        event.preventDefault()
        config.showPanels = !config.showPanels

        return
      case "escape":
        if (tool.activeTool === "component") tool.setActiveTool("select")

        return
      case "i":
        if (shift) return

        event.preventDefault()
        toggleIsolation()

        return
      case "v":
        tool.setActiveTool("select")

        return
      case "h":
        event.preventDefault()
        config.showSelection = !config.showSelection

        return
      case "w":
        event.preventDefault()
        config.toggleWireframeMode()

        return
      case "r":
        event.preventDefault()
        toggleRefBadges()

        return
      case "p":
        event.preventDefault()
        config.showUnusedProperties = !config.showUnusedProperties

        return
      case "f":
        event.preventDefault()
        config.showUnusedFonts = !config.showUnusedFonts

        return
      case "n":
        event.preventDefault()
        config.showUnusedIcons = !config.showUnusedIcons

        return
      case "q":
        if (shift) {
          event.preventDefault()
          void router.push("/")
        }

        return
    }
  }

  onMounted(() => window.addEventListener("keydown", handler))
  onUnmounted(() => window.removeEventListener("keydown", handler))
}
