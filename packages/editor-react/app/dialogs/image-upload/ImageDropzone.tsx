import { CSSProperties, useState } from "react"
import { useObjectURL } from "@app/hooks/use-object-url"
import { Frame } from "@seldon/components/frames/Frame"
import { IconMaterialUpload } from "@seldon/components/icons"
import { Text } from "@seldon/components/primitives/Text"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { DropzoneSurface } from "./DropzoneSurface"
import { ImagePreview } from "./ImagePreview"

export interface ImageDropzoneProps {
  onFileChange: (file: File | null) => void
  currentFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

function getDropzoneStyle(
  isDragging: boolean,
  hasFile: boolean,
): CSSProperties {
  return {
    ...dropzoneStyle,
    ...(isDragging
      ? {
          color: "var(--sdn-swatch-primary)",
          border: "2px solid var(--sdn-swatch-primary)",
        }
      : {}),
    ...(hasFile ? { position: "relative" } : {}),
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
  const dropzoneStyle = getDropzoneStyle(isDragging, Boolean(currentFile))

  const content = previewUrl ? (
    <ImagePreview src={previewUrl} onError={handleImageError} />
  ) : (
    <Frame wrapperElement="div" style={styles.prompt}>
      <IconMaterialUpload style={styles.uploadIcon} />
      <Text style={styles.uploadText}>{dropText}</Text>
    </Frame>
  )

  return (
    <DropzoneSurface
      fileInputRef={fileInputRef}
      onFileChange={handleFileSelect}
      style={dropzoneStyle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleDropZoneClick}
    >
      {content}
    </DropzoneSurface>
  )
}

const styles: Record<string, CSSProperties> = {
  uploadIcon: { fontSize: "var(--sdn-font-size-medium)" },
  uploadText: { fontSize: "var(--sdn-font-size-small)" },
  prompt: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--sdn-gaps-tight)",
  },
}

const dropzoneStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}
