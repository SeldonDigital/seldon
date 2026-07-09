"use client"

import {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
} from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { DialogHari } from "@seldon/components/modules/DialogHari"
import {
  ResizeSide,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"
import { useAiChat } from "@lib/hooks/use-ai-chat"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"
import { useFloatingPanel } from "@app/panels/hooks/use-floating-panel"

const CHAT_INITIAL_WIDTH = 420
const CHAT_INITIAL_HEIGHT = 220

// The title bar owns the top edge for dragging, so the panel resizes from the
// side and bottom edges plus the two bottom corners.
const CHAT_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

/**
 * View-model for the AI chat panel. Owns chat state through `useAiChat` and the
 * drag, resize, and escape wiring through `useFloatingPanel`, then feeds the
 * generated `DialogHari` shell: the title bar drags, the close button dismisses,
 * and the content frame holds the message textarea. The surface portals to the
 * document body and re-applies the editor theme and mode, matching the other
 * dialogs. It stays non-modal with no backdrop so the canvas remains usable.
 */
export function AiChatPanel({ handleClose }: { handleClose: () => void }) {
  const { send, status, warm } = useAiChat()

  useEffect(() => {
    void warm()
  }, [warm])

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
      x: 0.5 * window.innerWidth - 0.5 * CHAT_INITIAL_WIDTH,
      y: 0.5 * window.innerHeight - 0.5 * CHAT_INITIAL_HEIGHT,
    },
    initialSize: { width: CHAT_INITIAL_WIDTH, height: CHAT_INITIAL_HEIGHT },
    handleClose,
  })

  // The portal mounts on document.body, outside the chrome root that scopes the
  // editor theme and mode, so re-apply both here to match the editor interface.
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

  const isPending = status === "pending"
  const placeholder = isPending
    ? "Working..."
    : "Describe a change and press Enter"

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) return
      event.preventDefault()
      const value = event.currentTarget.value
      event.currentTarget.value = ""
      void send(value)
    },
    [send],
  )

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const surfaceMotionStyle = { x, y, width, height, ...styles.surface }
  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: "AI Chat" }
  const closeButton = { onClick: handleClose }
  const content = (
    <textarea
      autoFocus
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={isPending}
      style={styles.textarea}
    />
  )
  const contentFrame = { style: styles.content, children: content }

  const resizeHandles = CHAT_RESIZE_SIDES.map((side) => {
    const { onPointerDown } = createResizeHandle({
      side,
      getRect,
      onResize,
      minWidth,
      minHeight,
      onStart: onResizeStart,
    })
    return (
      <div
        key={side}
        onPointerDown={onPointerDown}
        style={getResizeHandleStyle(side)}
      />
    )
  })

  return createPortal(
    <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
      <motion.div
        drag
        dragControls={moveControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={dragConstraints}
        style={surfaceMotionStyle}
      >
        <DialogHari
          data-testid="ai-chat-dialog"
          bar={barHandle}
          textTitle={dialogTitle}
          buttonIconic={closeButton}
          frame={contentFrame}
          style={styles.dialog}
        />
        {resizeHandles}
      </motion.div>
    </div>,
    document.body,
  )
}

const Controller = () => {
  const { isOpen, close } = useAiChat()

  if (!isOpen) return null

  return <AiChatPanel handleClose={close} />
}

AiChatPanel.Controller = Controller

// The scope only carries the theme/mode attributes; `display: contents` keeps
// it out of layout so the fixed surface positions as before.
const styles: Record<string, CSSProperties> = {
  scope: {
    display: "contents",
  },
  surface: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 40,
  },
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
  textarea: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    boxSizing: "border-box",
    resize: "none",
    border: "none",
    outline: "none",
    padding: 0,
    color: "var(--sdn-swatch-offBlack)",
    background: "transparent",
    fontFamily: "inherit",
    fontSize: 14,
  },
}
