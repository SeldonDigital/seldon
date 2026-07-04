"use client"

import { CSSProperties, KeyboardEvent, useCallback } from "react"
import { DialogPalette } from "@seldon/components/modules/DialogPalette"
import { useAiChat } from "@lib/hooks/use-ai-chat"
import { FloatingPanel } from "@app/panels/FloatingPanel"

const styles: Record<string, CSSProperties> = {
  textarea: {
    width: "100%",
    height: "100%",
    minHeight: 120,
    resize: "none",
    border: "none",
    outline: "none",
    padding: 12,
    background: "transparent",
    color: "white",
    fontFamily: "inherit",
    fontSize: 14,
  },
}

/**
 * Minimal AI chat entry point. Renders a single textarea inside the palette.
 * Pressing Enter (without Shift) submits the text as a chat message; Shift+Enter
 * inserts a newline. Rendering the transcript and replies is deferred.
 */
export function AiChatPanel({ handleClose }: { handleClose: () => void }) {
  const { send, status } = useAiChat()

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

  return (
    <FloatingPanel
      handleClose={handleClose}
      title="AI Chat"
      initialWidth={420}
      initialHeight={220}
    >
      <DialogPalette bar={null}>
        <textarea
          autoFocus
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isPending}
          style={styles.textarea}
        />
      </DialogPalette>
    </FloatingPanel>
  )
}

const Controller = () => {
  const { isOpen, close } = useAiChat()

  if (!isOpen) return null

  return <AiChatPanel handleClose={close} />
}

AiChatPanel.Controller = Controller
