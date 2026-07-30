<script setup lang="ts">
// View-model for the Hari panel. Renders the generated `PanelHari` shell inside a
// non-modal floating window: the title bar drags the window, the close button
// dismisses it, the transcript fills the `hariTurns` frame, and the composer
// submits on Enter or the send button. The model and thinking triggers open the
// shared floating `MenuController` anchored to the clicked button.
//
// Every value and handler reaches its slot by the slot's baked `data-seldon-ref`
// name, so moving or reordering a node in the design keeps this wiring intact.
// Vue port of the React `Hari` body.
import { useAiChatStore } from "@app/ai/ai-chat-store"
import { useAiChat } from "@app/ai/use-ai-chat"
import { useDebugStore } from "@app/editor/debug-store"
import { usePanelStore } from "@app/editor/panel-store"
import MenuController from "@app/menus/MenuController.vue"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import { useSelectionScope } from "@app/workspace/use-selection-scope"
import PanelHari from "@seldon/components/modules/PanelHari.vue"
import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, ref, watch } from "vue"

import HariTranscript from "./HariTranscript.vue"

import type { MenuEntry } from "@app/menus/types"
import type { SelectionScope } from "@app/workspace/use-selection-scope"
import type { ThinkingMenuOption } from "@seldon/ai"
import type { CSSProperties } from "vue"

import "./hari.css"

const HARI_INITIAL_WIDTH = 420
const HARI_INITIAL_HEIGHT = 480

/** Distance from the bottom, in pixels, still counted as pinned to the bottom. */
const PINNED_THRESHOLD = 40

/** Class that renders a header ButtonToggle in its activated (on) state. */
const ACTIVE_TOGGLE_CLASS = "sdn-state-activated"

const COMPOSER_PLACEHOLDER = "Describe what you want to do..."

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
 * The button label for a thinking value: the matching option label when the value
 * is in the menu, an empty value as "Default", else the titled value.
 */
function levelLabel(options: ThinkingMenuOption[], value: string): string {
  const option = options.find((entry) => entry.value === value)

  if (option) return option.label
  if (!value) return "Default"

  return value[0]!.toUpperCase() + value.slice(1)
}

const styles: Record<string, CSSProperties> = {
  dialog: { width: "100%", height: "100%" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
}

const panel = usePanelStore()
const store = useAiChatStore()
const debug = useDebugStore()
const { send, stop, warm, reset } = useAiChat()

const { turns, status, model, thinkingLevel, config } = storeToRefs(store)
const { showTools, showOutcome, noThink } = storeToRefs(debug)
const scope = useSelectionScope()

function close(): void {
  panel.closePanel()
}

const viewport = getWindowInnerSize()
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
    x: 0.5 * viewport.width - 0.5 * HARI_INITIAL_WIDTH,
    y: 0.5 * viewport.height - 0.5 * HARI_INITIAL_HEIGHT,
  },
  initialSize: { width: HARI_INITIAL_WIDTH, height: HARI_INITIAL_HEIGHT },
  handleClose: close,
})

const draft = ref("")
const modelOpen = ref(false)
const thinkingOpen = ref(false)
const modelAnchor = ref<HTMLElement | null>(null)
const thinkingAnchor = ref<HTMLElement | null>(null)
const surface = ref<HTMLElement | null>(null)
const pinnedToBottom = ref(true)

onMounted(() => {
  void warm()
})

const isPending = computed(() => status.value === "pending")
const controlsDisabled = computed(() => config.value === null)
const modelValue = computed(() => model.value ?? "")
const thinkingValue = computed(() => thinkingLevel.value ?? "")
const modelButtonLabel = computed(() => modelValue.value || "Default")
const thinkingOptions = computed(
  () => config.value?.thinkingByModel?.[modelValue.value]?.options ?? [],
)

// A non-thinking model has no menu, and Clamp locks the menu for the turn.
const thinkingDisabled = computed(
  () => controlsDisabled.value || noThink.value || thinkingOptions.value.length === 0,
)

// The button shows the label of the active level, falling back to a titled value.
// Clamp overrides the turn, so it shows the level Clamp resolves to for the active
// model instead.
const thinkingButtonLabel = computed(() => {
  if (!noThink.value) return levelLabel(thinkingOptions.value, thinkingValue.value)
  const clampedLevel = config.value?.clampedLevels?.[modelValue.value] ?? "off"

  return levelLabel(thinkingOptions.value, clampedLevel)
})

function setSurface(element: HTMLElement | null): void {
  surface.value = element
}

/** The transcript scroller, found by the ref name the design bakes onto it. */
function transcriptElement(): HTMLElement | null {
  return surface.value?.querySelector<HTMLElement>('[data-seldon-ref="hariTurns"]') ?? null
}

function submit(): void {
  if (isPending.value) return
  const value = draft.value.trim()

  if (!value) return
  draft.value = ""
  pinnedToBottom.value = true
  void send(value)
}

function onDraftInput(event: Event): void {
  draft.value = (event.target as HTMLTextAreaElement).value
}

function onComposerKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" || event.shiftKey) return
  event.preventDefault()
  submit()
}

// Track whether the transcript is scrolled to (or near) the bottom, so streaming
// only auto-scrolls when the user has not scrolled up to read back.
function onTranscriptScroll(): void {
  const element = transcriptElement()

  if (!element) return
  const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight

  pinnedToBottom.value = distanceFromBottom < PINNED_THRESHOLD
}

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}

function openModelMenu(event: MouseEvent): void {
  modelAnchor.value = event.currentTarget as HTMLElement
  modelOpen.value = !modelOpen.value
}

function openThinkingMenu(event: MouseEvent): void {
  thinkingAnchor.value = event.currentTarget as HTMLElement
  thinkingOpen.value = !thinkingOpen.value
}

function closeModelMenu(): void {
  modelOpen.value = false
}

function closeThinkingMenu(): void {
  thinkingOpen.value = false
}

function onReset(): void {
  if (!window.confirm("Clear this chat and start a new session?")) return
  reset()
  draft.value = ""
  modelOpen.value = false
  thinkingOpen.value = false
}

function selectModel(value: string): void {
  store.setModel(value)
  // Reset the level when it is not in the new model's menu, so switching to a
  // model with different thinking never leaves a stale selection.
  const next = config.value?.thinkingByModel?.[value]

  if (next && !next.options.some((option) => option.value === thinkingValue.value)) {
    store.setThinkingLevel(next.default)
  }

  modelOpen.value = false
}

const modelItems = computed<MenuEntry[]>(() =>
  (config.value?.models ?? []).map((value) => ({
    id: value,
    label: value,
    onSelect: () => selectModel(value),
    selected: value === modelValue.value,
    activeMarker: "bullet",
    testId: `ai-chat-model-${value}`,
  })),
)

const thinkingItems = computed<MenuEntry[]>(() =>
  thinkingOptions.value.map((option) => ({
    id: option.value,
    label: option.label,
    onSelect: () => {
      store.setThinkingLevel(option.value)
      thinkingOpen.value = false
    },
    selected: option.value === thinkingValue.value,
    activeMarker: "bullet",
    testId: `ai-chat-thinking-${option.value}`,
  })),
)

// Keep the transcript pinned to the bottom as streamed turns grow, unless the
// user has scrolled up.
watch(
  turns,
  () => {
    if (!pinnedToBottom.value) return

    void nextTick(() => {
      const element = transcriptElement()

      if (element) element.scrollTop = element.scrollHeight
    })
  },
  { deep: true },
)

const seldonRefs = computed(() => ({
  hariBar: { onPointerdown: startDrag, style: styles.dragHandle },
  hariOutcome: {
    onClick: debug.toggleShowOutcome,
    className: showOutcome.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showOutcome.value,
    title: "Show Outcome",
    "data-testid": "ai-chat-outcome",
  },
  hariTools: {
    onClick: debug.toggleShowTools,
    className: showTools.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showTools.value,
    title: "Show Tools",
    "data-testid": "ai-chat-tools",
  },
  hariClamp: {
    onClick: debug.toggleNoThink,
    className: noThink.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": noThink.value,
    title: "Clamp Thinking",
    "data-testid": "ai-chat-clamp",
  },
  hariReset: {
    onClick: onReset,
    title: "Clear",
    "data-testid": "ai-chat-reset",
  },
  hariClose: { onClick: close },

  hariTurns: { onScroll: onTranscriptScroll },

  hariInput: {
    value: draft.value,
    onInput: onDraftInput,
    onKeydown: onComposerKeydown,
    placeholder: COMPOSER_PLACEHOLDER,
    autofocus: true,
  },

  hariModel: {
    onClick: openModelMenu,
    disabled: controlsDisabled.value,
    "data-testid": "ai-chat-model",
  },
  hariModelLabel: { children: modelButtonLabel.value },
  hariThinking: {
    onClick: openThinkingMenu,
    disabled: thinkingDisabled.value,
    "data-testid": "ai-chat-thinking",
  },
  hariThinkingLabel: { children: thinkingButtonLabel.value },
  hariSelectionLabel: { children: SCOPE_LABELS[scope.value] },
  hariSend: { onClick: isPending.value ? stop : submit },
  // An empty override leaves the send arrow the design bakes in.
  hariSendIcon: isPending.value ? { icon: "material-stop" } : {},
}))

// PanelHari gates its opt-in slots on a prop being present, so each one the refs
// above drive is turned on here. The design supplies its own copy.
const slots = {
  textTitle: {},
  buttonToggle: {},
  buttonToggle2: {},
  buttonToggle3: {},
  buttonIconic2: {},

  textarea: {},

  buttonMenu: {},
  textLabel: {},
  buttonMenu2: {},
  textLabel2: {},
  chip: {},
  textLabel3: {},
  buttonIconic3: {},
}

const dialogStyle = styles.dialog
</script>

<template>
  <WindowSurface
    :on-close="close"
    :surface-ref="setSurface"
    test-id="ai-chat-dialog"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :move-controls="moveControls"
    :drag-constraints="dragConstraints"
    :on-resize-start="onResizeStart"
    :on-resize="onResize"
    :get-rect="getRect"
    :min-width="minWidth"
    :min-height="minHeight"
  >
    <PanelHari v-bind="slots" :style="dialogStyle" :seldon-refs="seldonRefs">
      <template #hariTurns>
        <HariTranscript :turns="turns" :on-retry="send" />
      </template>
    </PanelHari>

    <MenuController
      :open="modelOpen"
      :anchor="modelAnchor"
      :items="modelItems"
      @close="closeModelMenu"
    />
    <MenuController
      :open="thinkingOpen"
      :anchor="thinkingAnchor"
      :items="thinkingItems"
      @close="closeThinkingMenu"
    />
  </WindowSurface>
</template>
