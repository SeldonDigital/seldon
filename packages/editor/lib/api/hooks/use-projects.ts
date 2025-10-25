import { ApiProjectAllResponse, api } from "@lib/api/client"
import { QueryKeys } from "@lib/api/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useProjects(initialData?: ApiProjectAllResponse) {
  return useQuery({
    queryKey: QueryKeys.projects,
    queryFn: async () => {
      const response = await api.project.all()
      return response.data
    },
    initialData: initialData?.data,
  })
}
