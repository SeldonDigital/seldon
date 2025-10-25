"use client"

import { Button } from "@components/ui/Button"
import { useProjectImport } from "@lib/api/hooks/use-project-import"
import { useLocation } from "wouter"

export const ImportProjectButton = () => {
  const [_, navigate] = useLocation()

  const { mutate } = useProjectImport({
    onSuccess: (project) => {
      navigate(`/projects/${project.id}`)
    },
  })

  return (
    <Button
      onClick={() => mutate()}
      variant="secondary"
      data-testid="import-project-button"
    >
      Import project
    </Button>
  )
}
