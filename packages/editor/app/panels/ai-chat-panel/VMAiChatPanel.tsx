"use client"

import { CSSProperties, KeyboardEvent, useCallback, useEffect } from "react"
import { AiChatStatus, useAiChat } from "@lib/hooks/use-ai-chat"
import { VMHariPanel } from "@app/panels/VMHariPanel"

const CHAT_INITIAL_WIDTH = 420
const CHAT_INITIAL_HEIGHT = 220

/**
 * Gate for the AI chat panel. Mounts the panel only while the "ai-chat" dialog
 * is active so it recenters on each open and its floating-panel hooks run only
 * when open, matching the other dialog view-models.
 */
export function VMAiChatPanel() {
  const { isOpen, close, send, status, warm } = useAiChat()

  if (!isOpen) return null

  return <AiChatPanel onClose={close} send={send} status={status} warm={warm} />
}

interface AiChatPanelProps {
  onClose: () => void
  send: (message: string) => Promise<void>
  status: AiChatStatus
  warm: () => Promise<void>
}

/**
 * View-model for the AI chat panel. Warms the agent on open and submits the
 * textarea on Enter, then feeds its title and content to the shared
 * `VMHariPanel`. The panel stays non-modal so the canvas remains usable.
 */
function AiChatPanel({ onClose, send, status, warm }: AiChatPanelProps) {
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
    <VMHariPanel
      title="AI Chat"
      testId="ai-chat-dialog"
      initialWidth={CHAT_INITIAL_WIDTH}
      initialHeight={CHAT_INITIAL_HEIGHT}
      onClose={onClose}
    >
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isPending}
        style={styles.textarea}
      />
    </VMHariPanel>
  )
}

const styles: Record<string, CSSProperties> = {
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
