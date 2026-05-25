import { cn } from "@lib/utils/cn"
import { useState } from "react"
import { useObjectURL } from "@lib/hooks/use-object-url"
import { IconUpload } from "@components/icons/Upload"
import { useAddToast } from "@components/toaster/use-add-toast"

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
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div
        className={cn(
          "w-full h-full cursor-pointer flex items-center justify-center",
          isDragging ? "text-blue border-2 border-blue" : "text-pearl",
          currentFile ? "relative" : "gap-1",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        {previewUrl ? (
          <div className="absolute inset-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => {
                // Handle image loading error
                onFileChange(null)
                addToast("Invalid image file. Please select a valid image.")
              }}
            />
          </div>
        ) : (
          <>
            <IconUpload className="text-lg" />
            <p className="text-sm">
              {isDragging ? "Drop image here..." : "Select or drop image…"}
            </p>
          </>
        )}
      </div>
    </>
  )
}
