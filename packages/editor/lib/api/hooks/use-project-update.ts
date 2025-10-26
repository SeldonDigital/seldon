import { useAddToast } from "@components/toaster/use-add-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "#shared/client.js"
import { Project } from "#shared/project.type.js"

import { QueryKeys } from "../query-keys"

export function useProjectUpdate() {
  const queryClient = useQueryClient()
  const addToast = useAddToast()

  return useMutation({
    mutationFn: api.project.update,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        [...QueryKeys.projects, variables.id],
        (old: Project) => {
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
