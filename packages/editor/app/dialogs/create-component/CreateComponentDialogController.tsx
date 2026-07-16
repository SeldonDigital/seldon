"use client"

import { WindowOverlay } from "@lib/overlays/WindowOverlay.bespoke"
import { CSSProperties, PointerEvent, useCallback, useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDraggableWindow } from "@lib/hooks/use-draggable-window"
import { PanelDialog } from "@seldon/components/modules/PanelDialog"
import { ResizeSide } from "@seldon/components/utils/resize"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { CreateComponentForm } from "./CreateComponentForm.bespoke"
import { useCreateComponentPanel } from "./hooks/use-create-component-panel"

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
 * Gate for the Create Component dialog. Mounts the dialog only while the
 * "create-component" panel is active so it recenters on each open, matching the
 * catalog dialogs.
 */
export function CreateComponentDialogController() {
  const panel = useCreateComponentPanel()

  if (!panel.isOpen) return null

  return <CreateComponentDialog {...panel} />
}

type CreateComponentDialogProps = ReturnType<typeof useCreateComponentPanel>

/**
 * View-model for the Create Component dialog. Feeds the generated `PanelDialog`
 * shell with the search field hidden: the title bar drags, the content frame
 * holds the authored component form, and the footer buttons cancel and create.
 */
function CreateComponentDialog({
  name,
  setName,
  rootKind,
  setRootKind,
  level,
  setLevel,
  intent,
  setIntent,
  tags,
  setTags,
  nameError,
  canSubmit,
  save,
  close,
}: CreateComponentDialogProps) {
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
    handleClose: close,
    closeOnEscape: false,
  })

  useHotkeys("esc", close)

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const content = useMemo(
    () => (
      <CreateComponentForm
        name={name}
        setName={setName}
        rootKind={rootKind}
        setRootKind={setRootKind}
        level={level}
        setLevel={setLevel}
        intent={intent}
        setIntent={setIntent}
        tags={tags}
        setTags={setTags}
        nameError={nameError}
      />
    ),
    [
      name,
      setName,
      rootKind,
      setRootKind,
      level,
      setLevel,
      intent,
      setIntent,
      tags,
      setTags,
      nameError,
    ],
  )

  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: "Create component" }
  const cancelLabel = { children: "Cancel" }
  const confirmLabel = { children: "Create component" }
  const confirmStyle = canSubmit ? undefined : styles.disabled
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: close },
    dialogConfirm: {
      onClick: save,
      "aria-disabled": !canSubmit,
      style: confirmStyle,
    },
  }

  return (
    <WindowOverlay
      modal
      onClose={close}
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
        data-testid="create-component-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={null}
        button4={{}}
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
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}
