"use client"

import type { AgentConfig } from "@lib/ai/run-agent-chat"
import { type MenuEntry, VMMenu } from "@lib/menus"
import { WindowOverlay } from "@lib/overlays/WindowOverlay"
import type { ThinkingLevelOption } from "@seldon/ai"
import {
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useDraggableWindow } from "@lib/hooks/use-draggable-window"
import {
  type HariStatus,
  type HariTurn,
  useHari,
} from "@lib/hooks/use-ai-chat"
import { PanelHari } from "@seldon/components/modules/PanelHari"
import { HariTranscript } from "./HariTranscript.bespoke"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 480

/**
 * Gate for the Hari panel. Mounts the panel only while the "ai-chat" dialog is
 * active so it recenters on each open and its floating-panel hooks run only when
 * open, matching the other dialog view-models.
 */
export function VMHari() {
  const {
    isOpen,
    close,
    send,
    status,
    warm,
    turns,
    config,
    model,
    thinkingLevel,
    setModel,
    setThinkingLevel,
  } = useHari()

  if (!isOpen) return null

  return (
    <Hari
      close={close}
      send={send}
      status={status}
      warm={warm}
      turns={turns}
      config={config}
      model={model}
      thinkingLevel={thinkingLevel}
      setModel={setModel}
      setThinkingLevel={setThinkingLevel}
    />
  )
}

interface HariProps {
  close: () => void
  send: (message: string) => Promise<void>
  status: HariStatus
  warm: () => Promise<void>
  turns: HariTurn[]
  config: AgentConfig | null
  model?: string
  thinkingLevel?: ThinkingLevelOption
  setModel: (model: string) => void
  setThinkingLevel: (thinkingLevel: ThinkingLevelOption) => void
}

/**
 * View-model for the Hari panel. Renders the generated `PanelHari` shell inside
 * a non-modal floating window: the title bar drags the window, the close button
 * dismisses it, the transcript fills the `turns` frame, and the composer submits
 * on Enter or the send button. The model and thinking triggers open the shared
 * floating `VMMenu` anchored to the clicked button.
 */
function Hari({
  close,
  send,
  status,
  warm,
  turns,
  config,
  model,
  thinkingLevel,
  setModel,
  setThinkingLevel,
}: HariProps) {
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
  } = useDraggableWindow({
    initialPosition: {
      x: 0.5 * window.innerWidth - 0.5 * HARI_INITIAL_WIDTH,
      y: 0.5 * window.innerHeight - 0.5 * HARI_INITIAL_HEIGHT,
    },
    initialSize: { width: HARI_INITIAL_WIDTH, height: HARI_INITIAL_HEIGHT },
    handleClose: close,
  })

  const [draft, setDraft] = useState("")
  const [modelOpen, setModelOpen] = useState(false)
  const [thinkingOpen, setThinkingOpen] = useState(false)
  const modelAnchor = useRef<HTMLElement | null>(null)
  const thinkingAnchor = useRef<HTMLElement | null>(null)

  const isPending = status === "pending"
  const placeholder = isPending
    ? "Working..."
    : "Describe a change and press Enter"
  const controlsDisabled = config === null
  const modelValue = model ?? ""
  const thinkingValue = thinkingLevel ?? ""
  const modelButtonLabel = modelValue || "Default"
  const thinkingButtonLabel = thinkingValue || "Default"

  const submit = useCallback(() => {
    const value = draft.trim()
    if (!value) return
    setDraft("")
    void send(value)
  }, [draft, send])

  const onDraftChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) =>
      setDraft(event.currentTarget.value),
    [],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) return
      event.preventDefault()
      submit()
    },
    [submit],
  )

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const openModelMenu = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      modelAnchor.current = event.currentTarget
      setModelOpen((open) => !open)
    },
    [],
  )

  const openThinkingMenu = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      thinkingAnchor.current = event.currentTarget
      setThinkingOpen((open) => !open)
    },
    [],
  )

  const closeModelMenu = useCallback(() => setModelOpen(false), [])
  const closeThinkingMenu = useCallback(() => setThinkingOpen(false), [])

  const modelItems = useMemo<MenuEntry[]>(
    () =>
      (config?.models ?? []).map((value) => ({
        id: value,
        label: value,
        onSelect: () => {
          setModel(value)
          setModelOpen(false)
        },
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
        onSelect: () => {
          setThinkingLevel(value as ThinkingLevelOption)
          setThinkingOpen(false)
        },
        selected: value === thinkingValue,
        activeMarker: "bullet",
        testId: `ai-chat-thinking-${value}`,
      })),
    [config, thinkingValue, setThinkingLevel],
  )

  const transcript = useMemo<ReactNode>(
    () => <HariTranscript turns={turns} status={status} onRetry={send} />,
    [turns, status, send],
  )

  const barSlot = { onPointerDown: startDrag, style: styles.dragHandle }
  const titleSlot = { children: "AI Chat" }
  const closeSlot = { onClick: close }
  const seldonRefs = { turns: { children: transcript } }
  const textareaSlot = {
    value: draft,
    onChange: onDraftChange,
    onKeyDown: handleKeyDown,
    placeholder,
    disabled: isPending,
    autoFocus: true,
  }
  const sendSlot = { onClick: submit, disabled: isPending }
  const modelSlot = {
    onClick: openModelMenu,
    disabled: controlsDisabled,
    "data-testid": "ai-chat-model",
  }
  const modelLabelSlot = { children: modelButtonLabel }
  const thinkingSlot = {
    onClick: openThinkingMenu,
    disabled: controlsDisabled,
    "data-testid": "ai-chat-thinking",
  }
  const thinkingLabelSlot = { children: thinkingButtonLabel }

  return (
    <WindowOverlay
      onClose={close}
      testId="ai-chat-dialog"
      closeOnClickOutside={false}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={onResize}
      getRect={getRect}
      minWidth={minWidth}
      minHeight={minHeight}
    >
      <PanelHari
        style={styles.dialog}
        bar={barSlot}
        textTitle={titleSlot}
        buttonIconic={closeSlot}
        seldonRefs={seldonRefs}
        textarea={textareaSlot}
        buttonIconic2={sendSlot}
        buttonMenu={modelSlot}
        textLabel={modelLabelSlot}
        buttonMenu2={thinkingSlot}
        textLabel2={thinkingLabelSlot}
        chip={null}
        button={null}
      />
      <VMMenu
        open={modelOpen}
        anchorRef={modelAnchor}
        onClose={closeModelMenu}
        items={modelItems}
      />
      <VMMenu
        open={thinkingOpen}
        anchorRef={thinkingAnchor}
        onClose={closeThinkingMenu}
        items={thinkingItems}
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
  },
}
