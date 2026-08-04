<script setup lang="ts">
// View-model for the Hari palette body. Renders the shared `PanelPalette` shell:
// `BarHari` fills the top bar (title and debug toggles), the transcript fills the
// contents zone, and `BarHariModels` fills the bottom bar (composer, model and
// thinking menus, scope chip, and send). The palette's option button clears the
// chat and its close button dismisses the panel. The model and thinking triggers
// open the shared floating `MenuController` anchored to the clicked button. The
// enclosing `FloatingPanel` owns the window; it hands down `startDrag` for the
// title bar. Vue port of the React `Hari` body.
//
// Every value and handler reaches its slot by the slot's baked `data-seldon-ref`
// name, so moving or reordering a node in the design keeps this wiring intact.
import { useAiChatStore } from "@app/ai/ai-chat-store"
import { useAiChat } from "@app/ai/use-ai-chat"
import { useDebugStore } from "@app/editor/debug-store"
import MenuController from "@app/menus/MenuController.vue"
import { useSelectionScope } from "@app/workspace/use-selection-scope"
import PanelPalette from "@seldon/components/modules/PanelPalette.vue"
import BarHari from "@seldon/components/parts/BarHari.vue"
import BarHariModels from "@seldon/components/parts/BarHariModels.vue"
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, ref, watch } from "vue"

import HariTranscript from "./HariTranscript.vue"

import type { MenuEntry } from "@app/menus/types"
import type { SelectionScope } from "@app/workspace/use-selection-scope"
import type { ThinkingMenuOption } from "@seldon/ai"
import type { CSSProperties, ComponentPublicInstance } from "vue"

import "./hari.css"

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
  dialog: { width: "100%", height: "100%", display: "flex", flexDirection: "column" },
  transcript: { flex: 1, minHeight: 0, overflowY: "auto" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
}

const props = defineProps<{
  startDrag: (event: PointerEvent) => void
  onClose: () => void
}>()

const store = useAiChatStore()
const debug = useDebugStore()
const { send, stop, warm, reset } = useAiChat()

const { turns, status, model, thinkingLevel, config } = storeToRefs(store)
const { showTools, showOutcome, noThink } = storeToRefs(debug)
const scope = useSelectionScope()

const draft = ref("")
const modelOpen = ref(false)
const thinkingOpen = ref(false)
const modelAnchor = ref<HTMLElement | null>(null)
const thinkingAnchor = ref<HTMLElement | null>(null)
const panelRef = ref<ComponentPublicInstance | null>(null)
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

/** The transcript scroller, found by the ref name the design bakes onto it. */
function transcriptElement(): HTMLElement | null {
  const root = panelRef.value?.$el as HTMLElement | undefined

  return root?.querySelector<HTMLElement>('[data-seldon-ref="paletteContents"]') ?? null
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
  paletteTopBar: { onPointerdown: props.startDrag, style: styles.dragHandle },
  paletteOption: {
    onClick: onReset,
    title: "Clear",
    "data-testid": "ai-chat-reset",
  },
  paletteOptionIcon: { icon: "seldon-reset" },
  paletteClose: { onClick: props.onClose, "data-testid": "ai-chat-close" },

  hariToggleOutcome: {
    onClick: debug.toggleShowOutcome,
    className: showOutcome.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showOutcome.value,
    title: "Show Outcome",
    "data-testid": "ai-chat-outcome",
  },
  hariToggleTools: {
    onClick: debug.toggleShowTools,
    className: showTools.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": showTools.value,
    title: "Show Tools",
    "data-testid": "ai-chat-tools",
  },
  hariToggleClamp: {
    onClick: debug.toggleNoThink,
    className: noThink.value ? ACTIVE_TOGGLE_CLASS : undefined,
    "aria-pressed": noThink.value,
    title: "Clamp Thinking",
    "data-testid": "ai-chat-clamp",
  },

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

// Enable each opt-in slot the refs above drive. Bare `{}` enablers turn a slot on
// without setting props; the design supplies its own copy.
const emptySlot = {}
const contentsSlot = { style: styles.transcript, onScroll: onTranscriptScroll }
const dialogStyle = styles.dialog
</script>

<template>
  <PanelPalette
    ref="panelRef"
    :style="dialogStyle"
    :seldon-refs="seldonRefs"
    :button-iconic="emptySlot"
    :button-iconic2="emptySlot"
    :frame3="contentsSlot"
  >
    <template #paletteTopBarSlot>
      <BarHari
        :text-title="emptySlot"
        :button-toggle2="emptySlot"
        :button-toggle3="emptySlot"
        :seldon-refs="seldonRefs"
      />
    </template>

    <template #paletteContents>
      <HariTranscript :turns="turns" :on-retry="send" />
    </template>

    <template #paletteBottomBarSlot>
      <BarHariModels
        :textarea="emptySlot"
        :button-menu="emptySlot"
        :text-label="emptySlot"
        :button-menu2="emptySlot"
        :text-label2="emptySlot"
        :chip="emptySlot"
        :text-label3="emptySlot"
        :button-iconic="emptySlot"
        :seldon-refs="seldonRefs"
      />
    </template>
  </PanelPalette>

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
</template>
