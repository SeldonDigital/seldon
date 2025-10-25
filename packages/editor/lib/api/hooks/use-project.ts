import { ApiProject, api } from "@lib/api/client"
import { QueryKeys } from "@lib/api/query-keys"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function useProject(projectId?: string) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: [...QueryKeys.projects, projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required")
      }
      const response = await api.project.get(projectId)

      return response.data
    },
    initialData: () => {
      const projects: ApiProject[] | undefined = queryClient.getQueryData(
        QueryKeys.projects,
      )

      return projects?.find((project) => project.id === projectId)
    },
    enabled: !!projectId,
  })
}
