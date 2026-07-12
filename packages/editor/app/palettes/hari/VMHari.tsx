"use client"

import type { AgentConfig } from "@lib/ai/run-agent-chat"
import { MenuEntry, VMMenu } from "@lib/menus"
import type { ThinkingLevelOption } from "@seldon/ai"
import {
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react"
import { HariStatus, useHari } from "@lib/hooks/use-ai-chat"
import { ButtonMenu } from "@seldon/components/elements/ButtonMenu"
import { Frame } from "@seldon/components/frames/Frame"
import { Text } from "@seldon/components/primitives/Text"
import { VMPanelPalette } from "@app/palettes/VMPanelPalette"
import { HariComposer } from "./HariComposer.bespoke"

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
 * canvas remains usable. The model and thinking controls are `ButtonMenu`
 * triggers backed by the shared floating `VMMenu`.
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
  const modelButtonLabel = modelValue || "Default"
  const thinkingButtonLabel = thinkingValue || "Default"

  const modelItems = useMemo<MenuEntry[]>(
    () =>
      (config?.models ?? []).map((value) => ({
        id: value,
        label: value,
        onSelect: () => setModel(value),
        selected: value === modelValue,
        activeMarker: "bullet",
        testId: `ai-chat-model-${value}`,
      })),
    [config, modelValue, setModel],
  )

  const thinkingItems = useMemo<MenuEntry[]>(
    () =>
      (config?.thinkingLevels ?? []).map((value) => ({
        id: value,
        label: value,
        onSelect: () => setThinkingLevel(value as ThinkingLevelOption),
        selected: value === thinkingValue,
        activeMarker: "bullet",
        testId: `ai-chat-thinking-${value}`,
      })),
    [config, thinkingValue, setThinkingLevel],
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
      <Frame style={styles.controls}>
        <Frame style={styles.control}>
          <Text htmlElement="label" style={styles.controlLabel}>
            Model
          </Text>
          <VMMenu
            items={modelItems}
            renderTrigger={({ ref, triggerProps }) => (
              <ButtonMenu
                ref={ref}
                type="button"
                {...triggerProps}
                disabled={controlsDisabled}
                style={styles.trigger}
                data-testid="ai-chat-model"
                textLabel={{ children: modelButtonLabel }}
              />
            )}
          />
        </Frame>
        <Frame style={styles.control}>
          <Text htmlElement="label" style={styles.controlLabel}>
            Thinking
          </Text>
          <VMMenu
            items={thinkingItems}
            renderTrigger={({ ref, triggerProps }) => (
              <ButtonMenu
                ref={ref}
                type="button"
                {...triggerProps}
                disabled={controlsDisabled}
                style={styles.trigger}
                data-testid="ai-chat-thinking"
                textLabel={{ children: thinkingButtonLabel }}
              />
            )}
          />
        </Frame>
      </Frame>
      <HariComposer
        placeholder={placeholder}
        disabled={isPending}
        onKeyDown={handleKeyDown}
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
  trigger: {
    width: "100%",
  },
}
