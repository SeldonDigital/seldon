import { defineStore } from "pinia"
import { ref, watch } from "vue"

const STORAGE_KEY = "debug-mode"

type PersistedDebug = {
  canvasProfiling: boolean
  showNodeIds: boolean
  showNodeTypes: boolean
  showPropertyTypes: boolean
  verboseLogging: boolean
  dispatchLogging: boolean
  workspaceLogging: boolean
  aiLogging: boolean
  showTools: boolean
  showOutcome: boolean
  noThink: boolean
}

function loadPersisted(): Partial<PersistedDebug> {
  if (typeof localStorage === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<PersistedDebug>) : {}
  } catch {
    return {}
  }
}

/**
 * Developer toggles for the Dev menu, mirroring the React `use-debug-mode`
 * store: canvas profiling, node/property overlay ids and types, the logging
 * flags, and the AI chat debug toggles. Persisted to localStorage under the
 * same key as React so both editors share their Dev-menu state shape.
 */
export const useDebugStore = defineStore("debug", () => {
  const persisted = loadPersisted()

  const canvasProfiling = ref(persisted.canvasProfiling ?? false)
  const showNodeIds = ref(persisted.showNodeIds ?? false)
  const showNodeTypes = ref(persisted.showNodeTypes ?? false)
  const showPropertyTypes = ref(persisted.showPropertyTypes ?? false)
  const verboseLogging = ref(persisted.verboseLogging ?? false)
  const dispatchLogging = ref(persisted.dispatchLogging ?? false)
  const workspaceLogging = ref(persisted.workspaceLogging ?? false)
  const aiLogging = ref(persisted.aiLogging ?? false)
  const showTools = ref(persisted.showTools ?? false)
  const showOutcome = ref(persisted.showOutcome ?? false)
  const noThink = ref(persisted.noThink ?? false)

  function setDispatchLogging(value: boolean): void {
    dispatchLogging.value = value
  }

  function toggleCanvasProfiling(): void {
    canvasProfiling.value = !canvasProfiling.value
  }
  function toggleShowNodeIds(): void {
    showNodeIds.value = !showNodeIds.value
  }
  function toggleShowNodeTypes(): void {
    showNodeTypes.value = !showNodeTypes.value
  }
  function toggleShowPropertyTypes(): void {
    showPropertyTypes.value = !showPropertyTypes.value
  }
  function toggleVerboseLogging(): void {
    verboseLogging.value = !verboseLogging.value
  }
  function toggleDispatchLogging(): void {
    dispatchLogging.value = !dispatchLogging.value
  }
  function toggleWorkspaceLogging(): void {
    workspaceLogging.value = !workspaceLogging.value
  }
  function toggleAiLogging(): void {
    aiLogging.value = !aiLogging.value
  }
  function toggleShowTools(): void {
    showTools.value = !showTools.value
  }
  function toggleShowOutcome(): void {
    showOutcome.value = !showOutcome.value
  }
  function toggleNoThink(): void {
    noThink.value = !noThink.value
  }

  watch(
    [
      canvasProfiling,
      showNodeIds,
      showNodeTypes,
      showPropertyTypes,
      verboseLogging,
      dispatchLogging,
      workspaceLogging,
      aiLogging,
      showTools,
      showOutcome,
      noThink,
    ],
    () => {
      if (typeof localStorage === "undefined") return
      const snapshot: PersistedDebug = {
        canvasProfiling: canvasProfiling.value,
        showNodeIds: showNodeIds.value,
        showNodeTypes: showNodeTypes.value,
        showPropertyTypes: showPropertyTypes.value,
        verboseLogging: verboseLogging.value,
        dispatchLogging: dispatchLogging.value,
        workspaceLogging: workspaceLogging.value,
        aiLogging: aiLogging.value,
        showTools: showTools.value,
        showOutcome: showOutcome.value,
        noThink: noThink.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: false },
  )

  return {
    canvasProfiling,
    showNodeIds,
    showNodeTypes,
    showPropertyTypes,
    verboseLogging,
    dispatchLogging,
    workspaceLogging,
    aiLogging,
    showTools,
    showOutcome,
    noThink,
    setDispatchLogging,
    toggleCanvasProfiling,
    toggleShowNodeIds,
    toggleShowNodeTypes,
    toggleShowPropertyTypes,
    toggleVerboseLogging,
    toggleDispatchLogging,
    toggleWorkspaceLogging,
    toggleAiLogging,
    toggleShowTools,
    toggleShowOutcome,
    toggleNoThink,
  }
})

/** True when the "AI Logging" Dev-menu toggle is on. Read imperatively. */
export function isAiLoggingEnabled(): boolean {
  return useDebugStore().aiLogging
}
