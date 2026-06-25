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
      }),
    },
  ),
)

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
  }
}
