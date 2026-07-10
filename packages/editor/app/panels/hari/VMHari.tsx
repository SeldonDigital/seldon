"use client"

import { CSSProperties, KeyboardEvent, useCallback, useEffect } from "react"
import { HariStatus, useHari } from "@lib/hooks/use-ai-chat"
import { VMPanelPalette } from "@app/panels/VMPanelPalette"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 220

/**
 * Gate for the Hari panel. Mounts the panel only while the "ai-chat" dialog
 * is active so it recenters on each open and its floating-panel hooks run only
 * when open, matching the other dialog view-models.
 */
export function VMHari() {
  const { isOpen, close, send, status, warm } = useHari()

  if (!isOpen) return null

  return <Hari onClose={close} send={send} status={status} warm={warm} />
}

interface HariProps {
  onClose: () => void
  send: (message: string) => Promise<void>
  status: HariStatus
  warm: () => Promise<void>
}

/**
 * View-model for the Hari panel. Warms the agent on open and submits the
 * textarea on Enter, then feeds its title and content to the shared
 * `VMPanelPalette`. The panel stays non-modal so the canvas remains usable.
 */
function Hari({ onClose, send, status, warm }: HariProps) {
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
    <VMPanelPalette
      title="AI Chat"
      testId="ai-chat-dialog"
      initialWidth={HARI_INITIAL_WIDTH}
      initialHeight={HARI_INITIAL_HEIGHT}
      onClose={onClose}
    >
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isPending}
        style={styles.textarea}
      />
    </VMPanelPalette>
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
