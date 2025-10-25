import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAddToast } from "@components/toaster/use-add-toast"
import { ApiProject, api } from "../client"
import { QueryKeys } from "../query-keys"

export function useProjectUpdate() {
  const queryClient = useQueryClient()
  const addToast = useAddToast()

  return useMutation({
    mutationFn: api.project.update,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        [...QueryKeys.projects, variables.id],
        (old: ApiProject) => {
          return {
            ...old,
            ...variables.input,
          }
        },
      )
    },
    onError: () => {
      addToast("Something went wrong with saving the project.")
    },
  })
}
