import { useProjectId } from "@lib/project/hooks/use-project-id"

import { useProject } from "./use-project"

export function useCurrentProject() {
  const { projectId } = useProjectId()

  return useProject(projectId)
}
