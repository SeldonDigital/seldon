import { useState } from "react"
import { useObjectURL } from "@lib/hooks/use-object-url"
import { IconUpload } from "@seldon/components/custom-icons/Upload"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

export interface ImageDropzoneProps {
  onFileChange: (file: File | null) => void
  currentFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function ImageDropzone({
  onFileChange,
  currentFile,
  fileInputRef,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const previewUrl = useObjectURL(currentFile)
  const addToast = useAddToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onFileChange(file)
    }
  }

  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      onFileChange(file)
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(isDragging
            ? {
                color: "var(--sdn-swatch-seldon-blue)",
                border: "2px solid var(--sdn-swatch-seldon-blue)",
              }
            : { color: "#F5F5F5" }),
          ...(currentFile
            ? { position: "relative" }
            : { gap: "var(--sdn-gap-tight)" }),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        {previewUrl ? (
          <div style={{ position: "absolute", inset: "1rem" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={() => {
                // Handle image loading error
                onFileChange(null)
                addToast("Invalid image file. Please select a valid image.")
              }}
            />
          </div>
        ) : (
          <>
            <IconUpload style={{ fontSize: "1.125rem" }} />
            <p style={{ fontSize: "var(--sdn-font-size-small)" }}>
              {isDragging ? "Drop image here..." : "Select or drop image…"}
            </p>
          </>
        )}
      </div>
    </>
  )
}
