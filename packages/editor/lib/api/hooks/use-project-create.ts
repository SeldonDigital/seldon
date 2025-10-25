import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAddToast } from "@components/toaster/use-add-toast"
import { ApiProjectCreateResponse, api } from "../client"
import { MutationKeys } from "../mutation-keys"
import { QueryKeys } from "../query-keys"

export function useProjectCreate({
  onSuccess,
  onError,
  invalidateQueries = true,
}: {
  onSuccess?: (project: ApiProjectCreateResponse["data"]) => void
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
    onSuccess: (response: ApiProjectCreateResponse) => {
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
