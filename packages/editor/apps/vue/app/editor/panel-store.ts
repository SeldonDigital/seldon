import type { Target } from "@seldon/editor/lib/workspace/target"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

import { ComponentLevel } from "@seldon/core/components/constants"

import { useToolStore } from "./tool-store"

export type PanelType =
  | "add-board"
  | "create-component"
  | "export-components"
  | "add-theme"
  | "add-font-collection"
  | "add-icon-set"
  | "component"
  | "image-upload"
  | "ai-chat"
  | null

/**
 * Which editor dialog/panel is open, plus its context (a click target for the
 * component panel, a hierarchy level for the add-board panel). Mirrors the React
 * `use-panel` store, including resetting the active tool to "select" when
 * closing a structural panel. Non-structural panels (image upload, AI chat)
 * leave the tool untouched.
 */
export const usePanelStore = defineStore("panel", () => {
  const tool = useToolStore()

  const activePanel = ref<PanelType>(null)
  const targetRef = ref<Target | undefined>(undefined)
  const dialogLevelRef = ref<ComponentLevel | undefined>(undefined)

  function openPanel(
    panel: PanelType,
    options?: { level?: ComponentLevel } | Target,
  ): void {
    if (panel === "component") {
      activePanel.value = panel
      targetRef.value = options as Target | undefined
      dialogLevelRef.value = undefined
      return
    }
    if (panel === "add-board") {
      activePanel.value = panel
      targetRef.value = undefined
      dialogLevelRef.value = (
        options as { level?: ComponentLevel } | undefined
      )?.level
      return
    }
    if (panel === null) {
      activePanel.value = null
      targetRef.value = undefined
      dialogLevelRef.value = undefined
      return
    }
    activePanel.value = panel
    targetRef.value = undefined
    dialogLevelRef.value = undefined
  }

  function closePanel(): void {
    if (
      activePanel.value !== "image-upload" &&
      activePanel.value !== "ai-chat" &&
      activePanel.value !== null
    ) {
      tool.setActiveTool("select")
    }
    activePanel.value = null
    targetRef.value = undefined
    dialogLevelRef.value = undefined
  }

  const target = computed(() =>
    activePanel.value === "component" ? targetRef.value : undefined,
  )
  const dialogLevel = computed(() =>
    activePanel.value === "add-board" ? dialogLevelRef.value : undefined,
  )

  return { activePanel, target, dialogLevel, openPanel, closePanel }
})
