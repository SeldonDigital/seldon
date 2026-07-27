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
import Menu from "@seldon/components/parts/Menu.vue"
import MenuItem from "@seldon/components/elements/MenuItem.vue"
import Hr from "@seldon/components/primitives/Hr.vue"
import {
  computeMenuPosition,
  type MenuPosition,
} from "@seldon/editor/lib/menus/anchor-position"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"
import type { MenuAlign, MenuEntry, MenuItem as MenuItemModel } from "./types"

/**
 * Controlled floating menu built on the generated `Menu`/`MenuItem` chrome. The
 * caller owns `open` and the `anchor` element. Owns positioning, roving-focus
 * keyboard navigation, outside-pointer and Escape close, focus restore, and the
 * leading marker column. Portals to `body` and re-stamps `data-theme`/`data-mode`
 * so the menu keeps the chrome theme outside the layout tree. Mirrors the React
 * `MenuController` controlled mode.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    anchor: HTMLElement | null
    items: MenuEntry[]
    align?: MenuAlign
    minWidth?: string
  }>(),
  { align: "start", minWidth: "180px" },
)

const emit = defineEmits<{ (event: "close"): void }>()

const { chromeTheme } = storeToRefs(useEditorConfigStore())
const resolvedMode = useResolvedInterfaceMode()

const menuRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const position = ref<MenuPosition>({})
let closedBySelect = false
let wasOpen = false

const enabledIndexes = computed(() =>
  props.items.reduce<number[]>((acc, item, index) => {
    if (item !== "separator" && !item.disabled) acc.push(index)
    return acc
  }, []),
)

function isMarked(item: MenuItemModel): boolean {
  return item.selected ?? Boolean(item.active)
}

const showMarkerColumn = computed(() =>
  props.items.some((item) => item !== "separator" && isMarked(item)),
)

/**
 * Leading marker slot props for an item. Marked items render a check (or radio
 * dot for `bullet` sets), tinted when also activated; unmarked items render the
 * same glyph hidden so labels stay aligned. Null drops the column entirely.
 */
function markerIcon(item: MenuItemModel): Record<string, unknown> | null {
  if (!showMarkerColumn.value) return null
  const glyph =
    item.activeMarker === "bullet"
      ? "material-radioButtonChecked"
      : "material-check"
  if (isMarked(item)) {
    return {
      icon: glyph,
      "aria-hidden": "true",
      className: item.active ? "sdn-state-activated" : undefined,
    }
  }
  return {
    icon: glyph,
    "aria-hidden": "true",
    style: { visibility: "hidden" },
  }
}

function labelSlot(item: MenuItemModel): Record<string, unknown> {
  return {
    children: item.label,
    "aria-disabled": item.disabled ? "true" : undefined,
    className: item.active ? "sdn-state-activated" : undefined,
    style: item.labelStyle,
  }
}

function shortcutSlot(item: MenuItemModel): Record<string, unknown> | null {
  return item.shortcut ? { children: item.shortcut } : null
}

const containerStyle = computed(() => {
  const px = (value: number | undefined) =>
    value === undefined ? undefined : `${value}px`
  return {
    position: "fixed" as const,
    zIndex: 50,
    outline: "none",
    minWidth: props.minWidth,
    top: px(position.value.top),
    bottom: px(position.value.bottom),
    left: px(position.value.left),
    right: px(position.value.right),
  }
})

function place(): void {
  if (!props.anchor) return
  position.value = computeMenuPosition(
    props.anchor.getBoundingClientRect(),
    { width: window.innerWidth, height: window.innerHeight },
    { align: props.align },
  )
}

function focusActive(): void {
  const container = menuRef.value
  if (!container) return
  if (activeIndex.value >= 0) {
    container
      .querySelector<HTMLElement>(`[data-menu-index="${activeIndex.value}"]`)
      ?.focus()
  } else {
    container.focus()
  }
}

function focusReturnTarget(element: HTMLElement | null): void {
  if (!element?.isConnected) return
  if (element.tabIndex < 0 && !element.hasAttribute("tabindex")) {
    element.tabIndex = -1
  }
  element.focus({ preventScroll: true })
}

function moveActive(direction: 1 | -1): void {
  const indexes = enabledIndexes.value
  if (indexes.length === 0) return
  const current = indexes.indexOf(activeIndex.value)
  let next = current + direction
  if (next < 0) next = indexes.length - 1
  if (next >= indexes.length) next = 0
  activeIndex.value = indexes[next]
}

function onKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      moveActive(1)
      break
    case "ArrowUp":
      event.preventDefault()
      moveActive(-1)
      break
    case "Home":
      event.preventDefault()
      activeIndex.value = enabledIndexes.value[0] ?? -1
      break
    case "End":
      event.preventDefault()
      activeIndex.value =
        enabledIndexes.value[enabledIndexes.value.length - 1] ?? -1
      break
    case "Escape":
      event.preventDefault()
      emit("close")
      break
    case "Tab":
      emit("close")
      break
  }
}

function handleSelect(item: MenuItemModel): void {
  if (item.disabled) return
  closedBySelect = true
  emit("close")
  item.onSelect?.()
  requestAnimationFrame(() => {
    focusReturnTarget(props.anchor)
    closedBySelect = false
  })
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!props.open) return
  const target = event.target as Node
  if (menuRef.value?.contains(target)) return
  if (props.anchor?.contains(target)) return
  emit("close")
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      place()
      activeIndex.value = enabledIndexes.value[0] ?? -1
      void nextTick(focusActive)
    } else if (wasOpen && !closedBySelect) {
      focusReturnTarget(props.anchor)
    }
    wasOpen = open
  },
)

// Switching directly between open menus keeps `open` true while the anchor and
// items change, so re-place and re-highlight off the new trigger.
watch(
  () => props.anchor,
  () => {
    if (!props.open) return
    place()
    activeIndex.value = enabledIndexes.value[0] ?? -1
    void nextTick(focusActive)
  },
)

watch(activeIndex, () => {
  if (props.open) void nextTick(focusActive)
})

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true)
  window.addEventListener("resize", place)
  window.addEventListener("scroll", place, true)
  if (props.open) {
    place()
    activeIndex.value = enabledIndexes.value[0] ?? -1
    wasOpen = true
    void nextTick(focusActive)
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
      ref="menuRef"
      :tabindex="-1"
      :style="containerStyle"
      :data-theme="chromeTheme"
      :data-mode="resolvedMode"
      @keydown="onKeydown"
    >
      <Menu aria-orientation="vertical" :style="{ minWidth }">
        <template
          v-for="(item, index) in items"
          :key="item === 'separator' ? `separator-${index}` : item.id"
        >
          <Hr v-if="item === 'separator'" />
          <MenuItem
            v-else
            type="button"
            :data-menu-index="index"
            :data-testid="item.testId"
            :disabled="item.disabled"
            :aria-disabled="item.disabled || undefined"
            :tabindex="index === activeIndex ? 0 : -1"
            :icon="markerIcon(item)"
            :text-label="labelSlot(item)"
            :text-label2="shortcutSlot(item)"
            @click="handleSelect(item)"
            @pointerenter="!item.disabled && (activeIndex = index)"
          />
        </template>
      </Menu>
    </div>
  </Teleport>
</template>
