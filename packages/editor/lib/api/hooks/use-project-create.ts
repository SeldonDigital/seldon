import { useAddToast } from "@components/toaster/use-add-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "#shared/client.js"
import type { NewProjectResponse, Project } from "#shared/project.type.js"

import { MutationKeys } from "../mutation-keys"
import { QueryKeys } from "../query-keys"

export function useProjectCreate({
  onSuccess,
  onError,
  invalidateQueries = true,
}: {
  onSuccess?: (project: Project) => void
  onError?: (error: Error) => void
  invalidateQueries?: boolean
} = {}) {
  const queryClient = useQueryClient()
  const addToast = useAddToast()

  return useMutation({
    mutationKey: MutationKeys.createProject,
    mutationFn: async () => {
      return api.project.create()
    },
    onSuccess: (response: NewProjectResponse) => {
      if (invalidateQueries)
        queryClient.invalidateQueries({ queryKey: QueryKeys.projects })

      onSuccess?.(response.data)
    },
    onError: (error) => {
      addToast(error.message)
      onError?.(error)
    },
  })
}
