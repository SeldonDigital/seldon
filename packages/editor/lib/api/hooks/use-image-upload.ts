import { useCallback, useState } from "react"
import { convertBlobToBase64 } from "@lib/utils/convert-blob-to-base64"

type UploadStatus = "idle" | "pending" | "success" | "error"

/**
 * Local editor image upload: reads the file in the browser and returns a data URL
 * suitable for `source` / `background.image` workspace properties. No remote API.
 */
export function useImageUpload() {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setStatus("idle")
    setError(null)
  }, [])

  const mutateAsync = useCallback(async (imageData: Blob | File) => {
    setStatus("pending")
    setError(null)
    try {
      const url = await convertBlobToBase64(imageData)
      setStatus("success")
      return { url }
    } catch (cause) {
      const err =
        cause instanceof Error ? cause : new Error("Failed to read image file")
      setError(err)
      setStatus("error")
      throw err
    }
  }, [])

  return {
    mutateAsync,
    status,
    error,
    reset,
  }
}
