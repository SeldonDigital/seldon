"use client"

import { useAddToast } from "@components/toaster/use-add-toast"
import { selectFile } from "@lib/utils/select-file"
import { INITIAL_WORKSPACE } from "@lib/workspace/use-history"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sentenceCase } from "change-case"

import { Workspace } from "@seldon/core"
import { coreReducer } from "@seldon/core/workspace/reducers/core/reducer"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

import { api } from "#shared/client.js"
import { Project } from "#shared/project.type.js"

import { QueryKeys } from "../query-keys"
import { useProjectUpdate } from "./use-project-update"

export const useProjectImport = ({
  onSuccess,
}: {
  onSuccess: (project: Project) => void
}) => {
  const queryClient = useQueryClient()
  const addToast = useAddToast()
  const { mutateAsync: updateProject } = useProjectUpdate()

  return useMutation({
    mutationFn: async () => {
      const result = await selectFile()
      if (!result.success) throw new Error("File selection cancelled")

      const filename = result.file.name
      const text = await result.file.text()

      let validatedWorkspace: Workspace

      try {
        const workspace = workspaceService.parseWorkspace(text)
        // Pass the workspace through our reducer to make sure there are
        // no errors in it and that and migrations have been applied.
        validatedWorkspace = coreReducer(INITIAL_WORKSPACE, {
          type: "set_workspace",
          payload: { workspace },
        })
      } catch {
        throw new Error(
          "Import failed. Please select a valid Seldon project JSON file.",
        )
      }

      const { data: project } = await api.project.create()

      await updateProject({
        id: project.id,
        input: {
          name: sentenceCase(filename.replace(".json", "")),
          tree: validatedWorkspace,
        },
      })

      return project
    },
    onSuccess: (project) => {
      onSuccess(project)
      queryClient.refetchQueries({ queryKey: QueryKeys.projects })
    },
    onError: (error) => {
      if (error.message) {
        addToast(error.message)
      }
    },
  })
}
