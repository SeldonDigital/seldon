import { CSSProperties, useState } from "react"
import { useObjectURL } from "@lib/hooks/use-object-url"
import {
  DropzoneSurface,
  ImagePreview,
  Text,
} from "@seldon/components/custom-components"
import { IconMaterialUpload } from "@seldon/components/icons"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import {
  DROPZONE_DRAG_ACCENT,
  DROPZONE_DRAG_BORDER,
  DROPZONE_GAP,
  DROPZONE_TEXT_SIZE,
} from "./image-dropzone.bespoke"

export interface ImageDropzoneProps {
  onFileChange: (file: File | null) => void
  currentFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const styles: Record<string, CSSProperties> = {
  uploadIcon: { fontSize: "1.125rem" },
  uploadText: { fontSize: DROPZONE_TEXT_SIZE },
}

const dropzoneBaseStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

function getDropzoneStyle(
  isDragging: boolean,
  hasFile: boolean,
): CSSProperties {
  return {
    ...dropzoneBaseStyle,
    ...(isDragging
      ? {
          color: DROPZONE_DRAG_ACCENT,
          border: DROPZONE_DRAG_BORDER,
        }
      : { color: "var(--sdn-swatch-white)" }),
    ...(hasFile ? { position: "relative" } : { gap: DROPZONE_GAP }),
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

  const dropText = isDragging ? "Drop image here..." : "Select or drop image…"

  const content = previewUrl ? (
    <ImagePreview src={previewUrl} onError={handleImageError} />
  ) : (
    <>
      <IconMaterialUpload style={styles.uploadIcon} />
      <Text style={styles.uploadText}>{dropText}</Text>
    </>
  )

  return (
    <DropzoneSurface
      fileInputRef={fileInputRef}
      onFileChange={handleFileSelect}
      style={getDropzoneStyle(isDragging, Boolean(currentFile))}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleDropZoneClick}
    >
      {content}
    </DropzoneSurface>
  )
}
