import { Input } from "@components/ui/Input"
import { useProjectUpdate } from "@lib/api/hooks/use-project-update"
import { cn, cnMerge } from "@lib/utils/cn"
import { useState } from "react"

import { ProjectListItem } from "#shared/project.type.js"

import { useFocusOnMount } from "./hooks/use-focus-on-mount"

type ProjectTitleAndRenameProps = {
  project: ProjectListItem
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const ProjectTitleAndRename = ({
  project,
  isEditing,
  setIsEditing,
}: ProjectTitleAndRenameProps) => {
  const [title, setTitle] = useState(project.name)
  const inputRef = useFocusOnMount(isEditing)
  const { mutateAsync: updateProject, isPending } = useProjectUpdate()

  // Save project title
  const saveNewTitle = async (event: React.FormEvent) => {
    event.preventDefault()

    if (title.length === 0) {
      setTitle(project.name)
    } else {
      await updateProject({
        id: project.id,
        input: { name: title },
      })
    }

    setIsEditing(false)
  }

  const handleBlur = () => {
    setTitle(project.name)
    setIsEditing(false)
  }

  return (
    <div className="relative flex h-6 items-center">
      <form
        onSubmit={saveNewTitle}
        className={cnMerge(
          "pointer-events-none absolute inset-0 flex w-full -translate-x-2 items-center justify-between gap-2 opacity-0 transition-all duration-100",
          isEditing && "pointer-events-auto translate-x-0 opacity-100",
        )}
      >
        <div
          className={cn(
            "flex-grow",
            isPending && "pointer-events-none opacity-50",
          )}
        >
          <Input
            ref={inputRef}
            value={title}
            placeholder="Project Name"
            onChange={(e) => setTitle(e.target.value)}
            validate={(value) => value.trim().length > 0}
            autoFocus
            onFocus={(e) => e.target.select()}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveNewTitle(e)
              if (e.key === "Escape") handleBlur()
            }}
          />
        </div>
      </form>
      <h3
        className={cnMerge(
          "w-full translate-x-0 cursor-text truncate text-sm font-semibold opacity-100 transition-all duration-100",
          isEditing && "translate-x-2 opacity-0",
        )}
        onClick={() => setIsEditing(true)}
      >
        {title}
      </h3>
    </div>
  )
}
