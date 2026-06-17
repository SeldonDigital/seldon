import { create } from "zustand"

interface WorkspaceSyncStatusState {
  isDirty: boolean
}

const useStore = create<WorkspaceSyncStatusState>()(() => ({
  isDirty: false,
}))

export function setIsLocalWorkspaceDirty(isDirty: boolean) {
  useStore.setState({ isDirty })
}

export function useWorkspaceSyncStatus(_workspaceId?: string) {
  return useStore((state) => state.isDirty)
}
