<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue"
import { storeToRefs } from "pinia"
import Listbox from "@seldon/components/parts/Listbox.vue"
import ListboxOption from "@seldon/components/elements/ListboxOption.vue"
import Hr from "@seldon/components/primitives/Hr.vue"
import {
  computeListPosition,
  type ListPosition,
} from "@seldon/editor/lib/menus/anchor-position"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"
import type { ComboboxOptionItem } from "./types"

/** Vertical gap between the trigger and the panel, and min room to open below. */
const PANEL_GAP = 4
const MIN_SPACE_BELOW = 240

/**
 * Controlled floating listbox on the generated `Listbox`/`ListboxOption` chrome.
 * The caller owns `open` and the `anchor`. Right-aligns a fixed-width panel to
 * the anchor, flips above when room is tight, and supports arrow/enter/escape
 * keyboard selection. Portals to `body` and re-stamps `data-theme`/`data-mode`
 * so it keeps the chrome theme. Powers the objects-sidebar Display picker and is
 * reusable for the properties sidebar.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    anchor: HTMLElement | null
    optionGroups: ComboboxOptionItem[][]
    value: string
    resolveIcon?: (value: string) => string
    width?: number
  }>(),
  { width: 200 },
)

const emit = defineEmits<{
  (event: "select", value: string): void
  (event: "close"): void
}>()

const { chromeTheme } = storeToRefs(useEditorConfigStore())
const resolvedMode = useResolvedInterfaceMode()

const panelRef = ref<HTMLElement | null>(null)
const position = ref<ListPosition>({ x: 0, y: 0, w: props.width })
const highlightedValue = ref<string | undefined>(undefined)

const flatOptions = computed<ComboboxOptionItem[]>(() =>
  props.optionGroups.flat().filter((option) => !option.hidden),
)

function place(): void {
  if (!props.anchor) return
  position.value = computeListPosition(
    props.anchor.getBoundingClientRect(),
    { width: window.innerWidth, height: window.innerHeight },
    {
      gap: PANEL_GAP,
      width: props.width,
      align: "end",
      minSpaceBelow: MIN_SPACE_BELOW,
    },
  )
}

const panelStyle = computed(() => ({
  position: "fixed" as const,
  zIndex: 60,
  width: `${position.value.w}px`,
  outline: "none",
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  transform: position.value.positionAbove ? "translateY(-100%)" : undefined,
}))

function iconSlot(option: ComboboxOptionItem): Record<string, unknown> {
  return { icon: props.resolveIcon?.(option.value) ?? "seldon-component" }
}

function labelSlot(option: ComboboxOptionItem): Record<string, unknown> {
  return { children: option.name }
}

function optionClass(option: ComboboxOptionItem): string | undefined {
  const classes: string[] = []
  if (option.value === props.value) classes.push("sdn-state-activated")
  if (option.value === highlightedValue.value) classes.push("sdn-state-hover")
  return classes.length > 0 ? classes.join(" ") : undefined
}

function moveHighlight(direction: 1 | -1): void {
  const options = flatOptions.value
  if (options.length === 0) return
  const current = options.findIndex(
    (option) => option.value === highlightedValue.value,
  )
  let next = current + direction
  if (next < 0) next = options.length - 1
  if (next >= options.length) next = 0
  highlightedValue.value = options[next]?.value
}

function select(value: string): void {
  emit("select", value)
  emit("close")
}

function onKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      moveHighlight(1)
      break
    case "ArrowUp":
      event.preventDefault()
      moveHighlight(-1)
      break
    case "Enter":
      event.preventDefault()
      if (highlightedValue.value) select(highlightedValue.value)
      break
    case "Escape":
    case "Tab":
      event.preventDefault()
      emit("close")
      break
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!props.open) return
  const target = event.target as Node
  if (panelRef.value?.contains(target)) return
  if (props.anchor?.contains(target)) return
  emit("close")
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    place()
    highlightedValue.value = props.value
    void nextTick(() => panelRef.value?.focus())
  },
)

watch(
  () => props.anchor,
  () => {
    if (props.open) place()
  },
)

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true)
  window.addEventListener("resize", place)
  window.addEventListener("scroll", place, true)
  if (props.open) {
    place()
    highlightedValue.value = props.value
    void nextTick(() => panelRef.value?.focus())
  }
})

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true)
  window.removeEventListener("resize", place)
  window.removeEventListener("scroll", place, true)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      :tabindex="-1"
      :style="panelStyle"
      :data-theme="chromeTheme"
      :data-mode="resolvedMode"
      @keydown="onKeydown"
    >
      <Listbox>
        <template
          v-for="(group, groupIndex) in optionGroups"
          :key="`group-${groupIndex}`"
        >
          <Hr v-if="groupIndex > 0" />
          <ListboxOption
            v-for="option in group"
            :key="option.value"
            :class="optionClass(option)"
            :aria-selected="option.value === value || undefined"
            :icon="iconSlot(option)"
            :text-label="labelSlot(option)"
            @click="select(option.value)"
            @pointerenter="highlightedValue = option.value"
          />
        </template>
      </Listbox>
    </div>
  </Teleport>
</template>
