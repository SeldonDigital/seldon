import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

interface DebugState {
  canvasProfiling: boolean
  setCanvasProfiling: (enabled: boolean) => void

  showNodeIds: boolean
  setShowNodeIds: (enabled: boolean) => void

  showNodeTypes: boolean
  setShowNodeTypes: (enabled: boolean) => void

  showPropertyTypes: boolean
  setShowPropertyTypes: (enabled: boolean) => void

  verboseLogging: boolean
  setVerboseLogging: (enabled: boolean) => void

  dispatchLogging: boolean
  setDispatchLogging: (enabled: boolean) => void

  workspaceLogging: boolean
  setWorkspaceLogging: (enabled: boolean) => void

  aiLogging: boolean
  setAiLogging: (enabled: boolean) => void

  showTools: boolean
  setShowTools: (enabled: boolean) => void

  showOutcome: boolean
  setShowOutcome: (enabled: boolean) => void

  noThink: boolean
  setNoThink: (enabled: boolean) => void
}

export const useDebugStore = create<DebugState>()(
  persist(
    (set) => ({
      canvasProfiling: false,
      setCanvasProfiling: (enabled) =>
        set((state) => ({ ...state, canvasProfiling: enabled })),

      showNodeIds: false,
      setShowNodeIds: (enabled) =>
        set((state) => ({ ...state, showNodeIds: enabled })),

      showNodeTypes: false,
      setShowNodeTypes: (enabled) =>
        set((state) => ({ ...state, showNodeTypes: enabled })),

      showPropertyTypes: false,
      setShowPropertyTypes: (enabled) =>
        set((state) => ({ ...state, showPropertyTypes: enabled })),

      verboseLogging: false,
      setVerboseLogging: (enabled) =>
        set((state) => ({ ...state, verboseLogging: enabled })),

      dispatchLogging: false,
      setDispatchLogging: (enabled) =>
        set((state) => ({ ...state, dispatchLogging: enabled })),

      workspaceLogging: false,
      setWorkspaceLogging: (enabled) =>
        set((state) => ({ ...state, workspaceLogging: enabled })),

      aiLogging: false,
      setAiLogging: (enabled) =>
        set((state) => ({ ...state, aiLogging: enabled })),

      showTools: false,
      setShowTools: (enabled) =>
        set((state) => ({ ...state, showTools: enabled })),

      showOutcome: false,
      setShowOutcome: (enabled) =>
        set((state) => ({ ...state, showOutcome: enabled })),

      noThink: false,
      setNoThink: (enabled) => set((state) => ({ ...state, noThink: enabled })),
    }),
    {
      name: "debug-mode",
      partialize: (state) => ({
        canvasProfiling: state.canvasProfiling,
        showNodeIds: state.showNodeIds,
        showNodeTypes: state.showNodeTypes,
        showPropertyTypes: state.showPropertyTypes,
        verboseLogging: state.verboseLogging,
        dispatchLogging: state.dispatchLogging,
        workspaceLogging: state.workspaceLogging,
        aiLogging: state.aiLogging,
        showTools: state.showTools,
        showOutcome: state.showOutcome,
        noThink: state.noThink,
      }),
    },
  ),
)

/** True when the "AI Logging" Dev-menu toggle is on. Read imperatively. */
export function isAiLoggingEnabled(): boolean {
  return useDebugStore.getState().aiLogging
}

export function useDebugMode() {
  const {
    canvasProfiling,
    setCanvasProfiling,
    showNodeIds,
    setShowNodeIds,
    showNodeTypes,
    setShowNodeTypes,
    showPropertyTypes,
    setShowPropertyTypes,
    verboseLogging,
    setVerboseLogging,
    dispatchLogging,
    setDispatchLogging,
    workspaceLogging,
    setWorkspaceLogging,
    aiLogging,
    setAiLogging,
    showTools,
    setShowTools,
    showOutcome,
    setShowOutcome,
    noThink,
    setNoThink,
  } = useDebugStore(
    useShallow((state) => ({
      canvasProfiling: state.canvasProfiling,
      setCanvasProfiling: state.setCanvasProfiling,
      showNodeIds: state.showNodeIds,
      setShowNodeIds: state.setShowNodeIds,
      showNodeTypes: state.showNodeTypes,
      setShowNodeTypes: state.setShowNodeTypes,
      showPropertyTypes: state.showPropertyTypes,
      setShowPropertyTypes: state.setShowPropertyTypes,
      verboseLogging: state.verboseLogging,
      setVerboseLogging: state.setVerboseLogging,
      dispatchLogging: state.dispatchLogging,
      setDispatchLogging: state.setDispatchLogging,
      workspaceLogging: state.workspaceLogging,
      setWorkspaceLogging: state.setWorkspaceLogging,
      aiLogging: state.aiLogging,
      setAiLogging: state.setAiLogging,
      showTools: state.showTools,
      setShowTools: state.setShowTools,
      showOutcome: state.showOutcome,
      setShowOutcome: state.setShowOutcome,
      noThink: state.noThink,
      setNoThink: state.setNoThink,
    })),
  )

  const toggleCanvasProfiling = useCallback(() => {
    setCanvasProfiling(!canvasProfiling)
  }, [setCanvasProfiling, canvasProfiling])

  const toggleShowNodeIds = useCallback(() => {
    setShowNodeIds(!showNodeIds)
  }, [setShowNodeIds, showNodeIds])

  const toggleShowNodeTypes = useCallback(() => {
    setShowNodeTypes(!showNodeTypes)
  }, [setShowNodeTypes, showNodeTypes])

  const toggleShowPropertyTypes = useCallback(() => {
    setShowPropertyTypes(!showPropertyTypes)
  }, [setShowPropertyTypes, showPropertyTypes])

  const toggleVerboseLogging = useCallback(() => {
    setVerboseLogging(!verboseLogging)
  }, [setVerboseLogging, verboseLogging])

  const toggleDispatchLogging = useCallback(() => {
    setDispatchLogging(!dispatchLogging)
  }, [setDispatchLogging, dispatchLogging])

  const toggleWorkspaceLogging = useCallback(() => {
    setWorkspaceLogging(!workspaceLogging)
  }, [setWorkspaceLogging, workspaceLogging])

  const toggleAiLogging = useCallback(() => {
    setAiLogging(!aiLogging)
  }, [setAiLogging, aiLogging])

  const toggleShowTools = useCallback(() => {
    setShowTools(!showTools)
  }, [setShowTools, showTools])

  const toggleShowOutcome = useCallback(() => {
    setShowOutcome(!showOutcome)
  }, [setShowOutcome, showOutcome])

  const toggleNoThink = useCallback(() => {
    setNoThink(!noThink)
  }, [setNoThink, noThink])

  return {
    canvasProfiling,
    toggleCanvasProfiling,

    showNodeIds,
    toggleShowNodeIds,

    showNodeTypes,
    toggleShowNodeTypes,

    showPropertyTypes,
    toggleShowPropertyTypes,

    verboseLogging,
    toggleVerboseLogging,

    dispatchLogging,
    toggleDispatchLogging,

    workspaceLogging,
    toggleWorkspaceLogging,

    aiLogging,
    toggleAiLogging,

    showTools,
    toggleShowTools,

    showOutcome,
    toggleShowOutcome,

    noThink,
    toggleNoThink,
  }
}
