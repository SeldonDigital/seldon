"use client"

import type { AgentConfig } from "@seldon/editor/lib/ai/run-agent-chat"
import { MenuController, type MenuEntry } from "@app/menus"
import { WindowOverlay } from "@app/overlays/WindowOverlay.bespoke"
import type { ThinkingLevelOption, ThinkingMenuOption } from "@seldon/ai"
import {
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  type SelectionScope,
  useSelectionScope,
} from "@app/workspace/hooks/use-selection-scope"
import { type HariStatus, type HariTurn, useHari } from "@app/ai/use-ai-chat"
import { useDebugMode } from "@app/editor/hooks/use-debug-mode"
import { useDraggableWindow } from "@app/menus/hooks/use-draggable-window"
import { PanelHari } from "@seldon/components/modules/PanelHari"
import { HariTranscript } from "./HariTranscript"
import "./hari.css"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 480

/** Class that renders a header ButtonToggle in its activated (on) state. */
const ACTIVE_TOGGLE_CLASS = "sdn-state-activated"

/**
 * The button label for a thinking value: the matching option label when the
 * value is in the menu, an empty value as "Default", else the titled value.
 */
function levelLabel(options: ThinkingMenuOption[], value: string): string {
  const option = options.find((entry) => entry.value === value)
  if (option) return option.label
  if (!value) return "Default"
  return value[0]!.toUpperCase() + value.slice(1)
}

/** Capital-case labels for the scope chip, one per selection kind. */
const SCOPE_LABELS: Record<SelectionScope, string> = {
  workspace: "Workspace",
  board: "Board",
  variant: "Variant",
  instance: "Instance",
  theme: "Theme",
  fontCollection: "Font Collection",
  iconSet: "Icon Set",
  media: "Media",
}

/**
 * Gate for the Hari panel. Mounts the panel only while the "ai-chat" dialog is
 * active so it recenters on each open and its floating-panel hooks run only when
 * open, matching the other dialog view-models.
 */
export function HariController() {
  const {
    isOpen,
    close,
    send,
    stop,
    status,
    warm,
    turns,
    reset,
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
      stop={stop}
      status={status}
      warm={warm}
      turns={turns}
      reset={reset}
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
  stop: () => void
  status: HariStatus
  warm: () => Promise<void>
  turns: HariTurn[]
  reset: () => void
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
 * floating `MenuController` anchored to the clicked button.
 */
function Hari({
  close,
  send,
  stop,
  status,
  warm,
  turns,
  reset,
  config,
  model,
  thinkingLevel,
  setModel,
  setThinkingLevel,
}: HariProps) {
  useEffect(() => {
    void warm()
  }, [warm])

  const scope = useSelectionScope()

  const {
    showTools,
    toggleShowTools,
    showOutcome,
    toggleShowOutcome,
    noThink,
    toggleNoThink,
  } = useDebugMode()

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
  const transcriptRef = useRef<HTMLElement | null>(null)
  const pinnedToBottomRef = useRef(true)

  const isPending = status === "pending"
  const placeholder = "Describe what you want to do..."
  const controlsDisabled = config === null
  const modelValue = model ?? ""
  const thinkingValue = thinkingLevel ?? ""
  const modelButtonLabel = modelValue || "Default"
  const modelThinking = config?.thinkingByModel?.[modelValue]
  const thinkingOptions = modelThinking?.options ?? []
  // A non-thinking model has no menu, and Clamp locks the menu for the turn.
  const thinkingDisabled =
    controlsDisabled || noThink || thinkingOptions.length === 0
  // The button shows the label of the active level, falling back to a titled
  // value. Clamp overrides the turn, so it shows the level Clamp resolves to for
  // the active model instead.
  const clampedLevel = config?.clampedLevels?.[modelValue] ?? "off"
  const thinkingButtonLabel = noThink
    ? levelLabel(thinkingOptions, clampedLevel)
    : levelLabel(thinkingOptions, thinkingValue)

  const submit = useCallback(() => {
    if (isPending) return
    const value = draft.trim()
    if (!value) return
    setDraft("")
    pinnedToBottomRef.current = true
    void send(value)
  }, [draft, send, isPending])

  // Track whether the transcript is scrolled to (or near) the bottom, so
  // streaming only auto-scrolls when the user has not scrolled up to read back.
  const onTranscriptScroll = useCallback(() => {
    const el = transcriptRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    pinnedToBottomRef.current = distanceFromBottom < 40
  }, [])

  // Keep the transcript pinned to the bottom as streamed turns grow, unless the
  // user has scrolled up. Runs before paint so the content never flashes mid-scroll.
  useLayoutEffect(() => {
    const el = transcriptRef.current
    if (!el || !pinnedToBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [turns])

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

  const onReset = useCallback(() => {
    if (!window.confirm("Clear this chat and start a new session?")) return
    reset()
    setDraft("")
    setModelOpen(false)
    setThinkingOpen(false)
  }, [reset])

  const modelItems = useMemo<MenuEntry[]>(
    () =>
      (config?.models ?? []).map((value) => ({
        id: value,
        label: value,
        onSelect: () => {
          setModel(value)
          // Reset the level when it is not in the new model's menu, so switching
          // to a model with different thinking never leaves a stale selection.
          const next = config?.thinkingByModel?.[value]
          if (next && !next.options.some((o) => o.value === thinkingValue)) {
            setThinkingLevel(next.default)
          }
          setModelOpen(false)
        },
        selected: value === modelValue,
        activeMarker: "bullet",
        testId: `ai-chat-model-${value}`,
      })),
    [config, modelValue, thinkingValue, setModel, setThinkingLevel],
  )

  const thinkingItems = useMemo<MenuEntry[]>(
    () =>
      thinkingOptions.map((option) => ({
        id: option.value,
        label: option.label,
        onSelect: () => {
          setThinkingLevel(option.value)
          setThinkingOpen(false)
        },
        selected: option.value === thinkingValue,
        activeMarker: "bullet",
        testId: `ai-chat-thinking-${option.value}`,
      })),
    [thinkingOptions, thinkingValue, setThinkingLevel],
  )

  const transcript = useMemo<ReactNode>(
    () => <HariTranscript turns={turns} onRetry={send} />,
    [turns, send],
  )

  // PanelHari gates each slot on its prop being present, so every wired slot is
  // passed here. The slots' baked `data-seldon-ref` names (hariClamp, hariTools,
  // hariOutcome, hariClose, turns, hariInput, hariModel, hariThinking,
  // hariSelection, hariSend) ride their sdn defaults and stay on the rendered DOM
  // as stable anchors. `sdn-state-activated` renders a toggle in its on state.
  const barSlot = { onPointerDown: startDrag, style: styles.dragHandle }
  const titleSlot = { children: "Hari" }
  const clampToggleSlot = {
    onClick: toggleNoThink,
    className: noThink ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": noThink,
    title: "Clamp Thinking",
    "data-testid": "ai-chat-clamp",
  }
  const toolsToggleSlot = {
    onClick: toggleShowTools,
    className: showTools ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showTools,
    title: "Show Tools",
    "data-testid": "ai-chat-tools",
  }
  const outcomeToggleSlot = {
    onClick: toggleShowOutcome,
    className: showOutcome ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showOutcome,
    title: "Show Outcome",
    "data-testid": "ai-chat-outcome",
  }
  const resetSlot = {
    onClick: onReset,
    title: "Clear",
    "data-testid": "ai-chat-reset",
  }
  const closeSlot = { onClick: close }
  const transcriptSlot = {
    children: transcript,
    ref: transcriptRef,
    onScroll: onTranscriptScroll,
  }
  const inputSlot = {
    value: draft,
    onChange: onDraftChange,
    onKeyDown: handleKeyDown,
    placeholder,
    autoFocus: true,
  }
  const modelSlot = {
    onClick: openModelMenu,
    disabled: controlsDisabled,
    "data-testid": "ai-chat-model",
  }
  const modelLabelSlot = { children: modelButtonLabel }
  const thinkingSlot = {
    onClick: openThinkingMenu,
    disabled: thinkingDisabled,
    "data-testid": "ai-chat-thinking",
  }
  const thinkingLabelSlot = { children: thinkingButtonLabel }
  const basisChipSlot = {}
  const basisLabelSlot = { children: SCOPE_LABELS[scope] }
  const sendSlot = { onClick: isPending ? stop : submit }
  const sendIconSlot = isPending
    ? { icon: "material-stop" as const }
    : undefined

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
        buttonToggle={outcomeToggleSlot}
        buttonToggle2={toolsToggleSlot}
        buttonToggle3={clampToggleSlot}
        buttonIconic={resetSlot}
        buttonIconic2={closeSlot}
        frame2={transcriptSlot}
        textarea={inputSlot}
        buttonMenu={modelSlot}
        textLabel={modelLabelSlot}
        buttonMenu2={thinkingSlot}
        textLabel2={thinkingLabelSlot}
        chip={basisChipSlot}
        textLabel3={basisLabelSlot}
        buttonIconic3={sendSlot}
        icon8={sendIconSlot}
      />
      <MenuController
        open={modelOpen}
        anchorRef={modelAnchor}
        onClose={closeModelMenu}
        items={modelItems}
      />
      <MenuController
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
    userSelect: "none",
    touchAction: "none",
  },
}
