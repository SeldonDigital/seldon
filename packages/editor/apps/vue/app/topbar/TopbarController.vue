<script setup lang="ts">
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import BarTopbar from "@seldon/components/parts/BarTopbar.vue"
import MenuController from "@app/menus/MenuController.vue"
import type { MenuAlign, MenuEntry } from "@app/menus/types"
import { useAppState, type AppState } from "@app/editor/use-app-state"
import {
  useEditorConfigStore,
  type InterfaceMode,
} from "@app/editor/editor-config-store"
import { useExportStatusStore } from "@app/io/export-status-store"
import { getChromeThemes } from "./chrome-themes"
import { useMenuConfig } from "./hooks/use-menu-config"
import { useTopbarGradientAnimation } from "./hooks/use-topbar-gradient-animation"
import { TOPBAR_GRADIENT_CLASS } from "./seldon-gradient"
import type { MenuDropdown } from "./menus/types"

/** Menu id for the chrome-theme dropdown, distinct from the config menus. */
const CHROME_THEME_MENU_ID = "chrome-theme"

/** Menu id for the interface light/dark mode dropdown. */
const INTERFACE_MODE_MENU_ID = "interface-mode"

/** Interface mode options, in menu order. */
const INTERFACE_MODES: { id: InterfaceMode; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
]

type SlotObject = Record<string, unknown> | null
interface MenuSlot {
  button: SlotObject
  label: SlotObject
}
const EMPTY_SLOT: MenuSlot = { button: null, label: null }

const menuConfig = useMenuConfig()
const { appState } = useAppState()
const config = useEditorConfigStore()
const { chromeTheme, interfaceMode } = storeToRefs(config)
const exportStatus = useExportStatusStore()

const chromeThemes = getChromeThemes()

const openMenuId = ref<string | null>(null)
const anchor = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)

const gradientRef = useTopbarGradientAnimation()

function closeMenu(): void {
  openMenuId.value = null
}

function handleTriggerClick(id: string, element: HTMLElement): void {
  anchor.value = element
  openMenuId.value = openMenuId.value === id ? null : id
}

function handleTriggerEnter(id: string, element: HTMLElement): void {
  if (openMenuId.value === null) return
  anchor.value = element
  openMenuId.value = id
}

// Alt+Shift+click anywhere on the logo frame (cube + wordmark) toggles the
// export rainbow, a hidden gesture for previewing the animation without running
// an export. A plain click is inert. Vue has no `seldonRefs`, so the gesture is
// delegated on the header against the baked `data-seldon-ref="logo"` marker.
function handleHeaderClick(event: MouseEvent): void {
  if (!event.altKey || !event.shiftKey) return
  const target = event.target as HTMLElement | null
  if (!target?.closest('[data-seldon-ref="logo"]')) return
  exportStatus.setExporting(!exportStatus.isExporting)
}

/**
 * Maps a topbar menu's items into the `MenuEntry` list the floating
 * `MenuController` consumes, dropping items hidden in the current app state.
 */
function toMenuEntries(menu: MenuDropdown, state: AppState): MenuEntry[] {
  return menu.items.flatMap<MenuEntry>((item) => {
    if (item === "separator") return ["separator"]
    if (item.visibleIn && !item.visibleIn.includes(state)) return []
    return [
      {
        id: item.id,
        label: item.label,
        onSelect: item.action,
        disabled: item.disabled ?? item.enabled === false,
        active: item.active,
        activeMarker: item.activeMarker,
        shortcut: item.shortcut,
        icon: item.icon,
        testId: `menu-item-${item.id}`,
      },
    ]
  })
}

/** Builds a right-side dropdown's `MenuEntry` list, marking the active option. */
function buildDropdownItems<T extends string>(
  options: { id: T; label: string }[],
  activeId: T,
  onSelect: (id: T) => void,
  testIdPrefix: string,
): MenuEntry[] {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    onSelect: () => onSelect(option.id),
    active: option.id === activeId,
    activeMarker: option.id === activeId ? "bullet" : undefined,
    testId: `${testIdPrefix}-${option.id}`,
  }))
}

const menuSlots = computed<MenuSlot[]>(() =>
  [0, 1, 2, 3, 4, 5].map((index) => {
    const menu = menuConfig.value[index]
    if (!menu) return EMPTY_SLOT
    if (menu.visibleIn && !menu.visibleIn.includes(appState.value))
      return EMPTY_SLOT
    return {
      button: {
        "data-testid": `menu-${menu.id}`,
        "aria-haspopup": "menu",
        "aria-expanded": openMenuId.value === menu.id,
        onClick: (event: MouseEvent) =>
          handleTriggerClick(menu.id, event.currentTarget as HTMLElement),
        onPointerenter: (event: PointerEvent) =>
          handleTriggerEnter(menu.id, event.currentTarget as HTMLElement),
      },
      label: { children: menu.label },
    }
  }),
)

const themeMenuItems = computed<MenuEntry[]>(() =>
  buildDropdownItems(
    chromeThemes.map((theme) => ({ id: theme.slug, label: theme.label })),
    chromeTheme.value,
    config.setChromeTheme,
    CHROME_THEME_MENU_ID,
  ),
)

const activeThemeLabel = computed(() => {
  const active = chromeThemes.find((theme) => theme.slug === chromeTheme.value)
  return active?.label ?? chromeTheme.value
})

const themeButton = computed<SlotObject>(() => ({
  "data-testid": `menu-${CHROME_THEME_MENU_ID}`,
  "aria-haspopup": "menu",
  "aria-expanded": openMenuId.value === CHROME_THEME_MENU_ID,
  onClick: (event: MouseEvent) =>
    handleTriggerClick(CHROME_THEME_MENU_ID, event.currentTarget as HTMLElement),
}))

const themeLabel = computed<SlotObject>(() => ({ children: activeThemeLabel.value }))

const modeMenuItems = computed<MenuEntry[]>(() =>
  buildDropdownItems(
    INTERFACE_MODES,
    interfaceMode.value,
    config.setInterfaceMode,
    INTERFACE_MODE_MENU_ID,
  ),
)

const activeModeLabel = computed(() => {
  const active = INTERFACE_MODES.find((mode) => mode.id === interfaceMode.value)
  return active?.label ?? "System"
})

const modeButton = computed<SlotObject>(() => ({
  "data-testid": `menu-${INTERFACE_MODE_MENU_ID}`,
  "aria-haspopup": "menu",
  "aria-expanded": openMenuId.value === INTERFACE_MODE_MENU_ID,
  onClick: (event: MouseEvent) =>
    handleTriggerClick(INTERFACE_MODE_MENU_ID, event.currentTarget as HTMLElement),
}))

const modeLabel = computed<SlotObject>(() => ({ children: activeModeLabel.value }))

const openMenuItems = computed<MenuEntry[]>(() => {
  if (openMenuId.value === CHROME_THEME_MENU_ID) return themeMenuItems.value
  if (openMenuId.value === INTERFACE_MODE_MENU_ID) return modeMenuItems.value
  const menu = menuConfig.value.find((entry) => entry.id === openMenuId.value)
  return menu ? toMenuEntries(menu, appState.value) : []
})

// The theme and mode triggers sit at the right edge, so their menus align to
// the trigger's right and open leftward. The left-side config menus align left.
const menuAlign = computed<MenuAlign>(() =>
  openMenuId.value === CHROME_THEME_MENU_ID ||
  openMenuId.value === INTERFACE_MODE_MENU_ID
    ? "end"
    : "start",
)

const menuOpen = computed(() => openMenuId.value !== null)

const logoProps = { src: "/logo.svg", alt: "Seldon" }
const wordmarkProps = { src: "/wordmark-light.svg", alt: "Seldon" }
const emptySlot = {}
</script>

<template>
  <header ref="header" class="topbar-header" @click="handleHeaderClick">
    <BarTopbar
      data-testid="topbar"
      :frame="emptySlot"
      :frame2="emptySlot"
      :image="logoProps"
      :image2="wordmarkProps"
      :frame3="emptySlot"
      :button-simple="menuSlots[0].button"
      :text-label="menuSlots[0].label"
      :button-simple2="menuSlots[1].button"
      :text-label2="menuSlots[1].label"
      :button-simple3="menuSlots[2].button"
      :text-label3="menuSlots[2].label"
      :button-simple4="menuSlots[3].button"
      :text-label4="menuSlots[3].label"
      :button-simple5="menuSlots[4].button"
      :text-label5="menuSlots[4].label"
      :button-simple6="menuSlots[5].button"
      :text-label6="menuSlots[5].label"
      :frame4="emptySlot"
      :button-menu="themeButton"
      :text-label7="themeLabel"
      :icon="emptySlot"
      :button-menu2="modeButton"
      :text-label8="modeLabel"
      :icon2="emptySlot"
    />
    <MenuController
      :open="menuOpen"
      :anchor="anchor"
      :items="openMenuItems"
      :align="menuAlign"
      min-width="220px"
      @close="closeMenu"
    />
    <div ref="gradientRef" :class="TOPBAR_GRADIENT_CLASS" />
  </header>
</template>

<style scoped>
.topbar-header {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}
</style>
