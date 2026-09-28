import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"

import { useToolStore } from "./tool-store"

import type { ComponentLevel } from "@seldon/core/components/constants"

export type PanelType =
  | "add-board"
  | "create-component"
  | "export-components"
  | "add-theme"
  | "add-font-collection"
  | "add-icon-set"
  | "image-upload"
  | null

const STORAGE_KEY = "editor-panel"

function loadAiChatOpen(): boolean {
  if (typeof localStorage === "undefined") return false

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw ? Boolean((JSON.parse(raw) as { aiChatOpen?: boolean }).aiChatOpen) : false
  } catch {
    return false
  }
}

function loadComponentPaletteOpen(): boolean {
  if (typeof localStorage === "undefined") return false

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw
      ? Boolean((JSON.parse(raw) as { componentPaletteOpen?: boolean }).componentPaletteOpen)
      : false
  } catch {
    return false
  }
}

/**
 * Which editor dialog/panel is open, plus its context (a click target for the
 * component panel, a hierarchy level for the add-board panel). Mirrors the React
 * `use-panel` store, including resetting the active tool to "select" when
 * closing a structural panel. Non-structural panels (image upload) leave the
 * tool untouched.
 *
 * `activePanel` is the single exclusive dialog slot: opening one dialog closes
 * any other. Palettes are tracked separately (`aiChatOpen`), each independent of
 * the dialog slot and of one another, so a palette stays open while a dialog is
 * used. Only the palette-visibility flag persists; the dialog slot starts closed
 * each session.
 */
export const usePanelStore = defineStore("panel", () => {
  const tool = useToolStore()

  const activePanel = ref<PanelType>(null)
  const dialogLevelRef = ref<ComponentLevel | undefined>(undefined)

  const aiChatOpen = ref(loadAiChatOpen())
  const componentPaletteOpen = ref(loadComponentPaletteOpen())

  function openPanel(panel: PanelType, options?: { level?: ComponentLevel }): void {
    if (panel === "add-board") {
      activePanel.value = panel
      dialogLevelRef.value = (options as { level?: ComponentLevel } | undefined)?.level

      return
    }

    if (panel === null) {
      activePanel.value = null
      dialogLevelRef.value = undefined

      return
    }

    activePanel.value = panel
    dialogLevelRef.value = undefined
  }

  function closePanel(): void {
    if (activePanel.value !== "image-upload" && activePanel.value !== null) {
      tool.setActiveTool("select")
    }

    activePanel.value = null
    dialogLevelRef.value = undefined
  }

  function openAiChat(): void {
    aiChatOpen.value = true
  }

  function closeAiChat(): void {
    aiChatOpen.value = false
  }

  const target = computed(() => undefined)
  const dialogLevel = computed(() =>
    activePanel.value === "add-board" ? dialogLevelRef.value : undefined,
  )

  watch(aiChatOpen, (open) => {
    if (typeof localStorage === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ aiChatOpen: open }))
  })

  function openComponentPalette(): void {
    componentPaletteOpen.value = true
  }

  function closeComponentPalette(): void {
    componentPaletteOpen.value = false
  }

  watch(componentPaletteOpen, (open) => {
    if (typeof localStorage === "undefined") return
    const existing = localStorage.getItem(STORAGE_KEY)
    const value = existing ? (JSON.parse(existing) as Record<string, unknown>) : {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...value, componentPaletteOpen: open }))
  })

  return {
    activePanel,
    target,
    dialogLevel,
    openPanel,
    closePanel,
    aiChatOpen,
    openAiChat,
    closeAiChat,
    componentPaletteOpen,
    openComponentPalette,
    closeComponentPalette,
  }
})
