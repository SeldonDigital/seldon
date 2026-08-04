"use client"

import { useHari } from "@app/ai/use-ai-chat"
import { useDebugMode } from "@app/editor/hooks/use-debug-mode"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { MenuController } from "@app/menus"
import { FloatingPanel } from "@app/windows/FloatingPanel"
import { useSelectionScope } from "@app/workspace/hooks/use-selection-scope"
import { PanelPalette } from "@seldon/components/modules/PanelPalette"
import { BarHari } from "@seldon/components/parts/BarHari"
import { BarHariModels } from "@seldon/components/parts/BarHariModels"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { HariTranscript } from "./HariTranscript"

import type { HariStatus, HariTurn } from "@app/ai/use-ai-chat"
import type { MenuEntry } from "@app/menus"
import type { FloatingPanelApi } from "@app/windows/FloatingPanel"
import type { SelectionScope } from "@app/workspace/hooks/use-selection-scope"
import type { ThinkingLevelOption, ThinkingMenuOption } from "@seldon/ai"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { AgentConfig } from "@seldon/editor/lib/ai/run-agent-chat"
import type {
  CSSProperties,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react"

import "./hari.css"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 480

/** Class that renders a header ButtonToggle in its activated (on) state. */
const ACTIVE_TOGGLE_CLASS = "sdn-state-activated"

const COMPOSER_PLACEHOLDER = "Describe what you want to do..."

/** Turns on an opt-in generated slot without setting any props on it. */
const EMPTY_SLOT = {}

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
  setModel: (model: string) => void
  setThinkingLevel: (thinkingLevel: ThinkingLevelOption) => void
  model?: string
  thinkingLevel?: ThinkingLevelOption
}

/**
 * View-model for the Hari panel. Renders the shared `PanelPalette` shell inside
 * a `FloatingPanel`: `BarHari` fills the top bar (title and debug toggles), the
 * transcript fills the contents zone, and `BarHariModels` fills the bottom bar
 * (composer, model and thinking menus, scope chip, and send). The palette's
 * option button clears the chat and its close button dismisses the panel. The
 * model and thinking triggers open the shared floating `MenuController` anchored
 * to the clicked button.
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
  const { hariPanelRect, setHariPanelRect } = useEditorConfig()

  const { showTools, toggleShowTools, showOutcome, toggleShowOutcome, noThink, toggleNoThink } =
    useDebugMode()

  const [draft, setDraft] = useState("")
  const [modelOpen, setModelOpen] = useState(false)
  const [thinkingOpen, setThinkingOpen] = useState(false)
  const modelAnchor = useRef<HTMLElement | null>(null)
  const thinkingAnchor = useRef<HTMLElement | null>(null)
  const transcriptRef = useRef<HTMLElement | null>(null)
  const pinnedToBottomRef = useRef(true)

  const isPending = status === "pending"
  const controlsDisabled = config === null
  const modelValue = model ?? ""
  const thinkingValue = thinkingLevel ?? ""
  const modelButtonLabel = modelValue || "Default"
  const modelThinking = config?.thinkingByModel?.[modelValue]
  const thinkingOptions = modelThinking?.options ?? []
  // A non-thinking model has no menu, and Clamp locks the menu for the turn.
  const thinkingDisabled = controlsDisabled || noThink || thinkingOptions.length === 0
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
    (event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.currentTarget.value),
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

  const openModelMenu = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
    modelAnchor.current = event.currentTarget
    setModelOpen((open) => !open)
  }, [])

  const openThinkingMenu = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
    thinkingAnchor.current = event.currentTarget
    setThinkingOpen((open) => !open)
  }, [])

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

  // Every value and handler reaches its slot by the slot's baked
  // `data-seldon-ref` name, so moving or reordering a node in the design keeps
  // this wiring intact. The drag handle needs the window's `startDrag`, so the
  // refs are built per render from the panel api. `sdn-state-activated` renders a
  // toggle in its on state.
  const renderPalette = (api: FloatingPanelApi) => {
    const seldonRefs: SeldonRefs = {
      paletteTopBar: { onPointerDown: api.startDrag, style: styles.dragHandle },
      paletteOption: {
        onClick: onReset,
        title: "Clear",
        "data-testid": "ai-chat-reset",
      },
      paletteClose: { onClick: close, "data-testid": "ai-chat-close" },

      hariToggleOutcome: {
        onClick: toggleShowOutcome,
        className: showOutcome ? ACTIVE_TOGGLE_CLASS : undefined,
        "aria-pressed": showOutcome,
        title: "Show Outcome",
        "data-testid": "ai-chat-outcome",
      },
      hariToggleTools: {
        onClick: toggleShowTools,
        className: showTools ? ACTIVE_TOGGLE_CLASS : undefined,
        "aria-pressed": showTools,
        title: "Show Tools",
        "data-testid": "ai-chat-tools",
      },
      hariToggleClamp: {
        onClick: toggleNoThink,
        className: noThink ? ACTIVE_TOGGLE_CLASS : undefined,
        "aria-pressed": noThink,
        title: "Clamp Thinking",
        "data-testid": "ai-chat-clamp",
      },

      hariInput: {
        value: draft,
        onChange: onDraftChange,
        onKeyDown: handleKeyDown,
        placeholder: COMPOSER_PLACEHOLDER,
        autoFocus: true,
      },

      hariModel: {
        onClick: openModelMenu,
        disabled: controlsDisabled,
        "data-testid": "ai-chat-model",
      },
      hariModelLabel: { children: modelButtonLabel },
      hariThinking: {
        onClick: openThinkingMenu,
        disabled: thinkingDisabled,
        "data-testid": "ai-chat-thinking",
      },
      hariThinkingLabel: { children: thinkingButtonLabel },
      hariSelectionLabel: { children: SCOPE_LABELS[scope] },
      hariSend: { onClick: isPending ? stop : submit },
      // An empty override leaves the send arrow the design bakes in.
      hariSendIcon: isPending ? { icon: "material-stop" } : {},
    }

    const topBar = (
      <BarHari
        textTitle={EMPTY_SLOT}
        buttonToggle2={EMPTY_SLOT}
        buttonToggle3={EMPTY_SLOT}
        seldonRefs={seldonRefs}
      />
    )

    const bottomBar = (
      <BarHariModels
        textarea={EMPTY_SLOT}
        buttonMenu={EMPTY_SLOT}
        textLabel={EMPTY_SLOT}
        buttonMenu2={EMPTY_SLOT}
        textLabel2={EMPTY_SLOT}
        chip={EMPTY_SLOT}
        textLabel3={EMPTY_SLOT}
        buttonIconic={EMPTY_SLOT}
        seldonRefs={seldonRefs}
      />
    )

    const topBarSlot = { children: topBar }
    const contentsSlot = {
      style: styles.transcript,
      children: transcript,
      ref: transcriptRef,
      onScroll: onTranscriptScroll,
    }
    const bottomBarSlot = { children: bottomBar }

    return (
      <>
        <PanelPalette
          style={styles.dialog}
          seldonRefs={seldonRefs}
          buttonIconic={EMPTY_SLOT}
          buttonIconic2={EMPTY_SLOT}
          frame2={topBarSlot}
          frame3={contentsSlot}
          frame5={bottomBarSlot}
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
      </>
    )
  }

  return (
    <FloatingPanel
      initialWidth={HARI_INITIAL_WIDTH}
      initialHeight={HARI_INITIAL_HEIGHT}
      onClose={close}
      paletteId="hari"
      testId="ai-chat-dialog"
      rect={hariPanelRect}
      onRectChange={setHariPanelRect}
    >
      {renderPalette}
    </FloatingPanel>
  )
}

const styles: Record<string, CSSProperties> = {
  dialog: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  transcript: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
  },
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
}
