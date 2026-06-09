"use client"

import { CSSProperties } from "react"
import { ButtonBarPrimary } from "@seldon/components/chrome/elements/ButtonBarPrimary"
import { FloatingPanel } from "@app/panels/FloatingPanel"
import { ImageDropzone } from "./ImageDropzone"
import { useImageUploadPanel } from "../hooks/use-upload-image-panel"

const styles: Record<string, CSSProperties> = {
  body: { display: "flex", height: "100%", flexDirection: "column" },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101011",
  },
  hiddenButtonIcon: { display: "none" },
}

/**
 * Panel for uploading images.
 */
export function ImageUploadPanel({ onClose }: { onClose: () => void }) {
  const { currentFile, onFileChange, fileInputRef, status, clear, save } =
    useImageUploadPanel()

  const mainContent =
    status === "success" ? (
      <div></div>
    ) : (
      <ImageDropzone
        onFileChange={onFileChange}
        currentFile={currentFile}
        fileInputRef={fileInputRef}
      />
    )

  const confirmLabel = status === "pending" ? "Uploading..." : "Use image"

  return (
    <FloatingPanel
      closeOnClickOutside
      handleClose={onClose}
      title="Choose image"
    >
      <div style={styles.body}>
        <main style={styles.main}>{mainContent}</main>

        <ButtonBarPrimary
          buttonProps={{
            onClick: clear,
            type: "button",
            disabled: !currentFile,
          }}
          buttonIconProps={{ style: styles.hiddenButtonIcon }}
          buttonLabelProps={{
            children: "Clear",
          }}
          buttonPrimary1Props={{
            onClick: save,
            type: "button",
            disabled: !currentFile,
          }}
          buttonPrimary1IconProps={{ style: styles.hiddenButtonIcon }}
          buttonPrimary1LabelProps={{
            children: confirmLabel,
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
