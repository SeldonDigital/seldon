"use client"

import { Button } from "@components/ui/Button"
import { useProjectCreate } from "@lib/api/hooks/use-project-create"
import { QueryKeys } from "@lib/api/query-keys"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useLocation } from "wouter"

export const NewProjectButton = () => {
  const [_, navigate] = useLocation()
  const queryClient = useQueryClient()

  // This is a workaround to avoid the flash of the new project state in the overview page just before when the user is redirected to the editor.
  const { mutateAsync: createProject } = useProjectCreate({
    invalidateQueries: false,
  })

  const onClick = useCallback(async () => {
    const project = await createProject()

    navigate(`/projects/${project.data.id}`)
    queryClient.invalidateQueries({ queryKey: QueryKeys.projects })
  }, [createProject, queryClient])

  return (
    <Button
      variant="primary"
      onClick={onClick}
      data-testid="new-project-button"
      as="button"
    >
      New Project
    </Button>
  )
}
