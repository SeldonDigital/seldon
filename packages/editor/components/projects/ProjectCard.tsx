"use client"

import { useProjectDelete } from "@lib/api/hooks/use-project-delete"
import { useState } from "react"

import { type ProjectListItem } from "#shared/project.type.js"

import { Card } from "./Card"
import { RelativeTime } from "./RelativeTime"
import { ProjectTitleAndRename } from "./project-title-and-rename/ProjectTitleAndRename"

type Props = {
  project: ProjectListItem
  testId?: string
}

export function ProjectCard({ project, testId }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useProjectDelete()

  const dropdownMenuItems = [
    {
      label: "Rename",
      action: () => {
        setIsEditing(true)
      },
      testId: "rename-button",
    },
    {
      label: "Delete",
      action: async () => {
        const confirmed = confirm(
          "Are you sure you want to delete this project?",
        )
        if (!confirmed) return

        await deleteProject(project.id)
      },
      testId: "delete-button",
    },
  ]

  return (
    <Card
      title={
        <ProjectTitleAndRename
          project={project}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      }
      subtitle={<RelativeTime date={project.updatedAt} />}
      dropdownMenuItems={dropdownMenuItems}
      to={`/projects/${project.id}`}
      isLoading={isDeleting}
      testId={testId}
      data-project-id={project.id}
    />
  )
}
