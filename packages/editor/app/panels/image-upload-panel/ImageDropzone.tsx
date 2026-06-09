import { CSSProperties, useState } from "react"
import { useObjectURL } from "@lib/hooks/use-object-url"
import { IconSeldonUpload } from "@seldon/components/icons"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

export interface ImageDropzoneProps {
  onFileChange: (file: File | null) => void
  currentFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const styles: Record<string, CSSProperties> = {
  hiddenInput: { display: "none" },
  previewWrapper: { position: "absolute", inset: "1rem" },
  previewImage: { width: "100%", height: "100%", objectFit: "contain" },
  uploadIcon: { fontSize: "1.125rem" },
  uploadText: { fontSize: "var(--sdn-font-size-small)" },
}

const dropzoneBaseStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

function getDropzoneStyle(isDragging: boolean, hasFile: boolean): CSSProperties {
  return {
    ...dropzoneBaseStyle,
    ...(isDragging
      ? {
          color: "var(--sdn-swatch-seldon-blue)",
          border: "2px solid var(--sdn-swatch-seldon-blue)",
        }
      : { color: "#F5F5F5" }),
    ...(hasFile ? { position: "relative" } : { gap: "var(--sdn-gap-tight)" }),
  }
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

  const handleImageError = () => {
    onFileChange(null)
    addToast("Invalid image file. Please select a valid image.")
  }

  const dropText = isDragging
    ? "Drop image here..."
    : "Select or drop image…"

  const content = previewUrl ? (
    <div style={styles.previewWrapper}>
      <img
        src={previewUrl}
        alt="Preview"
        style={styles.previewImage}
        onError={handleImageError}
      />
    </div>
  ) : (
    <>
      <IconSeldonUpload style={styles.uploadIcon} />
      <p style={styles.uploadText}>{dropText}</p>
    </>
  )

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={styles.hiddenInput}
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div
        style={getDropzoneStyle(isDragging, Boolean(currentFile))}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        {content}
      </div>
    </>
  )
}
