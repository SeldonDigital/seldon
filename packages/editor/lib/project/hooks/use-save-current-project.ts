"use client"

import { useMutation } from "@tanstack/react-query"
import { useProjectUpdate } from "@lib/api/hooks/use-project-update"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"
import { useProjectId } from "./use-project-id"
import { setIsLocalWorkspaceDirty } from "./use-workspace-sync-status"

export function useSaveCurrentProject() {
  const { workspace } = useWorkspace()
  const { projectId } = useProjectId()
  const addToast = useAddToast()
  const { mutateAsync: updateProject } = useProjectUpdate()

  const { mutateAsync: saveCurrentProject } = useMutation({
    mutationFn: async () => {
      setIsLocalWorkspaceDirty(false)

      await updateProject({
        id: projectId,
        input: {
          tree: workspace,
        },
      })
    },
    onError: () => {
      setIsLocalWorkspaceDirty(true)
      addToast("Something went wrong with saving the project.")
    },
  })

  return { saveCurrentProject }
}
