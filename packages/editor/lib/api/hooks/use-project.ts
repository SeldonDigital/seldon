import { QueryKeys } from "@lib/api/query-keys"
import { useQuery } from "@tanstack/react-query"

import { api } from "#shared/client.js"

export function useProject(projectId: string) {
  return useQuery({
    queryKey: [...QueryKeys.projects, projectId],
    queryFn: async () => {
      const response = await api.project.get(projectId)

      return response.data
    },
  })
}
