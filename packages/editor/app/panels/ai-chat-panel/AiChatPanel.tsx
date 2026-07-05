"use client"

import { CSSProperties, KeyboardEvent, useCallback, useEffect } from "react"
import { useAiChat } from "@lib/hooks/use-ai-chat"
import { FloatingPanel } from "@app/panels/FloatingPanel"

const styles: Record<string, CSSProperties> = {
  textarea: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    boxSizing: "border-box",
    resize: "none",
    border: "none",
    outline: "none",
    padding: 12,
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
  const { send, status, warm } = useAiChat()

  useEffect(() => {
    void warm()
  }, [warm])

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
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isPending}
        style={styles.textarea}
      />
    </FloatingPanel>
  )
}

const Controller = () => {
  const { isOpen, close } = useAiChat()

  if (!isOpen) return null

  return <AiChatPanel handleClose={close} />
}

AiChatPanel.Controller = Controller
