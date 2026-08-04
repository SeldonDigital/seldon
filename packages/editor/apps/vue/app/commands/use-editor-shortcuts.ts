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

    // Token badge groups, Shift-1 through Shift-6 in View menu order. Uses
    // event.code so it is layout-independent (Shift+1 yields "!" on US layouts).
    if (shift && !mod && !alt) {
      switch (event.code) {
        case "Digit1":
          event.preventDefault()
          config.toggleLayoutBadges()

          return
        case "Digit2":
          event.preventDefault()
          config.toggleDimensionBadges()

          return
        case "Digit3":
          event.preventDefault()
          config.toggleSpaceBadges()

          return
        case "Digit4":
          event.preventDefault()
          config.toggleAppearanceBadges()

          return
        case "Digit5":
          event.preventDefault()
          config.toggleTypographyBadges()

          return
        case "Digit6":
          event.preventDefault()
          config.toggleEffectsBadges()

          return
      }
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
          panel.openPanel("create-component")
          tool.setActiveTool("select")
        } else {
          tool.setActiveTool("component")
        }

        return
      case "`":
        event.preventDefault()

        if (alt) {
          selectSource()
        } else if (shift) {
          selectOriginal()
        } else if (panel.aiChatOpen) {
          panel.closeAiChat()
        } else {
          panel.openAiChat()
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
      case "e":
        event.preventDefault()
        // The connectors only draw in isolation mode.
        if (config.isolatedView) config.toggleShowConnectors()

        return
      case "r":
        event.preventDefault()
        toggleRefBadges()

        return
      case "p":
        event.preventDefault()
        config.showProperties()

        return
      case "u":
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
