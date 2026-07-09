"use client"

import { CSSProperties, PointerEvent, RefObject, useCallback, useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useFloatingPanel } from "@app/panels/hooks/use-floating-panel"
import { DialogCatalog } from "@seldon/components/modules/DialogCatalog"
import { ResizeSide } from "@seldon/components/utils/resize"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { DialogOverlay } from "../DialogOverlay"
import { ImageDropzone } from "./ImageDropzone"
import { useImageUploadPanel } from "./hooks/use-upload-image-panel"

// The title bar owns the top edge for dragging, so the dialog resizes from the
// side and bottom edges plus the two bottom corners.
const DIALOG_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

/**
 * Gate for the image upload dialog. Mounts the dialog only while the
 * "image-upload" dialog is active so it recenters on each open, matching the
 * catalog dialogs.
 */
export function VMImageUploadDialog() {
  const {
    isOpen,
    currentFile,
    onFileChange,
    fileInputRef,
    status,
    clear,
    save,
    close,
  } = useImageUploadPanel()

  if (!isOpen) return null

  return (
    <ImageUploadDialog
      currentFile={currentFile}
      onFileChange={onFileChange}
      fileInputRef={fileInputRef}
      status={status}
      onClear={clear}
      onSave={save}
      onClose={close}
    />
  )
}

interface ImageUploadDialogProps {
  currentFile: File | null
  onFileChange: (file: File | null) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  status: string
  onClear: () => void
  onSave: () => void
  onClose: () => void
}

/**
 * View-model for the image upload dialog. Feeds the generated `DialogCatalog`
 * shell with the search field hidden: the title bar drags, the content frame
 * holds the dropzone, and the cancel/confirm buttons clear and upload. The
 * shell is a complete modal surface, so it renders inside `DialogOverlay`, a
 * backdrop-backed portal that drags from the title bar and resizes from the
 * left, right, and bottom edges plus the bottom corners.
 */
function ImageUploadDialog({
  currentFile,
  onFileChange,
  fileInputRef,
  status,
  onClear,
  onSave,
  onClose,
}: ImageUploadDialogProps) {
  const {
    x,
    y,
    width,
    height,
    onResizeStart,
    onResize,
    getRect,
    moveControls,
    dragConstraints,
    minWidth,
    minHeight,
  } = useFloatingPanel({
    initialPosition: {
      x: 0.5 * window.innerWidth - 0.5 * PANEL_INITIAL_WIDTH,
      y: 0.5 * window.innerHeight - 0.5 * PANEL_INITIAL_HEIGHT,
    },
    initialSize: { width: PANEL_INITIAL_WIDTH, height: PANEL_INITIAL_HEIGHT },
    handleClose: onClose,
    closeOnEscape: false,
  })

  useHotkeys("esc", onClose)

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const content = useMemo(
    () =>
      status === "success" ? null : (
        <ImageDropzone
          onFileChange={onFileChange}
          currentFile={currentFile}
          fileInputRef={fileInputRef}
        />
      ),
    [status, onFileChange, currentFile, fileInputRef],
  )

  const confirmText = status === "pending" ? "Uploading..." : "Use image"

  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: "Choose image" }
  const clearLabel = { children: "Clear" }
  const confirmLabel = { children: confirmText }
  // Suppress the shell's third BarButtons slot, matching the catalog dialogs.
  // The cancel/confirm icons ride the shell defaults; only the labels and
  // click handlers differ. Buttons stay enabled and no-op without a file.
  const barButtons = { button3: null }
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: onClear },
    dialogConfirm: { onClick: onSave },
  }

  return (
    <DialogOverlay
      onClose={onClose}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={onResize}
      getRect={getRect}
      resizeSides={DIALOG_RESIZE_SIDES}
      minWidth={minWidth}
      minHeight={minHeight}
    >
      <DialogCatalog
        data-testid="image-upload-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={null}
        barButtons={barButtons}
        textLabel={clearLabel}
        textLabel2={confirmLabel}
        seldonRefs={seldonRefs}
        style={styles.dialog}
      />
    </DialogOverlay>
  )
}

const styles: Record<string, CSSProperties> = {
  dialog: {
    width: "100%",
    height: "100%",
  },
  dragHandle: {
    cursor: "grab",
  },
  content: {
    flex: 1,
    minHeight: 0,
    display: "flex",
  },
}
