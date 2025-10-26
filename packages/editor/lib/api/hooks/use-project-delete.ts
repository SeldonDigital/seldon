import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "#shared/client.js"

import { QueryKeys } from "../query-keys"

export function useProjectDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.project.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects })
    },
  })
}
