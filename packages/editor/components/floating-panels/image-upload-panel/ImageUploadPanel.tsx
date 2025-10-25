"use client"

import { ButtonBarPrimary } from "@components/seldon/elements/ButtonBarPrimary"
import { FloatingPanel } from "@components/ui/floating-panel/FloatingPanel"
import { ImageDropzone } from "./ImageDropzone"
import { useImageUploadPanel } from "./use-upload-image-panel"

/**
 * Panel for uploading images.
 */
export function ImageUploadPanel({ onClose }: { onClose: () => void }) {
  const { currentFile, onFileChange, fileInputRef, status, clear, save } =
    useImageUploadPanel()

  return (
    <FloatingPanel
      closeOnClickOutside
      handleClose={onClose}
      title="Choose image"
    >
      <div className="flex h-full flex-col">
        <main className="flex-1 flex items-center justify-center bg-tldraw-background">
          {status === "success" ? (
            <div></div>
          ) : (
            <ImageDropzone
              onFileChange={onFileChange}
              currentFile={currentFile}
              fileInputRef={fileInputRef}
            />
          )}
        </main>

        <ButtonBarPrimary
          buttonProps={{
            onClick: clear,
            type: "button",
            disabled: !currentFile,
          }}
          buttonIconProps={{
            style: {
              display: "none",
            },
          }}
          buttonLabelProps={{
            children: "Clear",
          }}
          buttonPrimary1Props={{
            onClick: save,
            type: "button",
            disabled: !currentFile,
          }}
          buttonPrimary1IconProps={{
            style: {
              display: "none",
            },
          }}
          buttonPrimary1LabelProps={{
            children: status === "pending" ? "Uploading..." : "Use image",
          }}
        />
      </div>
    </FloatingPanel>
  )
}

const Controller = () => {
  const { isOpen, close } = useImageUploadPanel()

  if (!isOpen) return null

  return <ImageUploadPanel onClose={close} />
}

ImageUploadPanel.Controller = Controller
