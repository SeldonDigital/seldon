import { useAddToast } from "@components/toaster/use-add-toast"
import { useProjectId } from "@lib/project/hooks/use-project-id"
import { useMutation } from "@tanstack/react-query"

import { api } from "#shared/client.js"

export function useImageUpload() {
  const addToast = useAddToast()

  const { projectId } = useProjectId()

  return useMutation({
    mutationFn: (imageData: Blob) => {
      return api.upload.create({
        projectId,
        imageData,
      })
    },
    onError: (error) => {
      addToast(error.message)
    },
  })
}
