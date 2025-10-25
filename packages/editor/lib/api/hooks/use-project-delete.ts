import { QueryKeys } from "@lib/api/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../client"

export function useProjectDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.project.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects })
    },
  })
}
