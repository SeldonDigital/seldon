"use client"

import { WindowOverlay } from "@app/overlays/WindowOverlay.bespoke"
import {
  CSSProperties,
  PointerEvent,
  RefObject,
  useCallback,
  useMemo,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDraggableWindow } from "@app/menus/hooks/use-draggable-window"
import { useImageUploadPanel } from "./hooks/use-upload-image-panel"
import { PanelDialog } from "@seldon/components/modules/PanelDialog"
import { IconProps } from "@seldon/components/primitives/Icon"
import { ResizeSide } from "@seldon/components/utils/resize"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { ImageDropzone } from "./ImageDropzone"

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
export function ImageUploadController() {
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
 * View-model for the image upload dialog. Feeds the generated `PanelDialog`
 * shell with the search field hidden: the title bar drags, the content frame
 * holds the dropzone, and the footer buttons clear, cancel, and upload. The
 * shell is a complete modal surface, so it renders inside a modal
 * `WindowOverlay`, a backdrop-backed portal that drags from the title bar and
 * resizes from the left, right, and bottom edges plus the bottom corners.
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
  } = useDraggableWindow({
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

  const clearButton = { onClick: onClear }
  const clearLabel = { children: "Clear" }
  const cancelIcon: IconProps = { icon: "material-close" }
  const cancelLabel = { children: "Cancel" }
  const confirmLabel = { children: confirmText }
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: onClose },
    dialogConfirm: { onClick: onSave },
  }

  return (
    <WindowOverlay
      modal
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
      <PanelDialog
        data-testid="image-upload-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={null}
        button={clearButton}
        textLabel={clearLabel}
        button4={{}}
        icon6={cancelIcon}
        textLabel4={cancelLabel}
        button5={{}}
        textLabel5={confirmLabel}
        seldonRefs={seldonRefs}
        style={styles.dialog}
      />
    </WindowOverlay>
  )
}

const styles: Record<string, CSSProperties> = {
  dialog: {
    width: "100%",
    height: "100%",
  },
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
  content: {
    flex: 1,
    minHeight: 0,
    display: "flex",
  },
}
