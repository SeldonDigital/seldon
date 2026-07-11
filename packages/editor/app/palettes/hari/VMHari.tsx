"use client"

import type { AgentConfig } from "@lib/ai/run-agent-chat"
import type { ThinkingLevelOption } from "@seldon/ai"
import {
  CSSProperties,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react"
import { HariStatus, useHari } from "@lib/hooks/use-ai-chat"
import { VMPanelPalette } from "@app/palettes/VMPanelPalette"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 260

/**
 * Gate for the Hari panel. Mounts the panel only while the "ai-chat" dialog
 * is active so it recenters on each open and its floating-panel hooks run only
 * when open, matching the other dialog view-models.
 */
export function VMHari() {
  const {
    isOpen,
    close,
    send,
    status,
    warm,
    config,
    model,
    thinkingLevel,
    setModel,
    setThinkingLevel,
  } = useHari()

  if (!isOpen) return null

  return (
    <Hari
      onClose={close}
      send={send}
      status={status}
      warm={warm}
      config={config}
      model={model}
      thinkingLevel={thinkingLevel}
      setModel={setModel}
      setThinkingLevel={setThinkingLevel}
    />
  )
}

interface HariProps {
  onClose: () => void
  send: (message: string) => Promise<void>
  status: HariStatus
  warm: () => Promise<void>
  config: AgentConfig | null
  model?: string
  thinkingLevel?: ThinkingLevelOption
  setModel: (model: string) => void
  setThinkingLevel: (thinkingLevel: ThinkingLevelOption) => void
}

/**
 * View-model for the Hari panel. Warms the agent on open, exposes the session
 * config controls, and submits the textarea on Enter, then feeds its title and
 * content to the shared `VMPanelPalette`. The panel stays non-modal so the
 * canvas remains usable. The controls are plain selects for now, to be reskinned
 * with Seldon components later.
 */
function Hari({
  onClose,
  send,
  status,
  warm,
  config,
  model,
  thinkingLevel,
  setModel,
  setThinkingLevel,
}: HariProps) {
  useEffect(() => {
    void warm()
  }, [warm])

  const isPending = status === "pending"
  const placeholder = isPending
    ? "Working..."
    : "Describe a change and press Enter"

  const controlsDisabled = config === null
  const modelValue = model ?? ""
  const thinkingValue = thinkingLevel ?? ""

  const modelOptions = useMemo(
    () =>
      (config?.models ?? []).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      )),
    [config],
  )

  const thinkingOptions = useMemo(
    () =>
      (config?.thinkingLevels ?? []).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      )),
    [config],
  )

  const handleModelChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setModel(event.target.value)
    },
    [setModel],
  )

  const handleThinkingChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setThinkingLevel(event.target.value as ThinkingLevelOption)
    },
    [setThinkingLevel],
  )

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
      <div style={styles.controls}>
        <label style={styles.control}>
          <span style={styles.controlLabel}>Model</span>
          <select
            value={modelValue}
            onChange={handleModelChange}
            disabled={controlsDisabled}
            style={styles.select}
          >
            {modelOptions}
          </select>
        </label>
        <label style={styles.control}>
          <span style={styles.controlLabel}>Thinking</span>
          <select
            value={thinkingValue}
            onChange={handleThinkingChange}
            disabled={controlsDisabled}
            style={styles.select}
          >
            {thinkingOptions}
          </select>
        </label>
      </div>
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
  controls: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
  },
  control: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  controlLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "var(--sdn-swatch-gray)",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: 12,
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
