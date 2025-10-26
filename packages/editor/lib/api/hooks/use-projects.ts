import { QueryKeys } from "@lib/api/query-keys"
import { useQuery } from "@tanstack/react-query"

import { api } from "#shared/client.js"
import { type ProjectAllResponse } from "#shared/project.type.js"

export function useProjects(initialData?: ProjectAllResponse) {
  return useQuery({
    queryKey: QueryKeys.projects,
    queryFn: async () => {
      const response = await api.project.all()
      return response.data
    },
    initialData: initialData?.data,
  })
}
