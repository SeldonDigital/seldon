<script setup lang="ts">
import { useAppState } from "@app/editor/use-app-state"
import { useExportStatusStore } from "@app/io/export-status-store"
import MenuController from "@app/menus/MenuController.vue"
import BarTopbar from "@seldon/components/parts/BarTopbar.vue"
import { computed, ref } from "vue"

import { useMenuConfig } from "./hooks/use-menu-config"
import { useTopbarGradientAnimation } from "./hooks/use-topbar-gradient-animation"
import { TOPBAR_GRADIENT_CLASS } from "./seldon-gradient"

import type { MenuDropdown } from "./menus/types"
import type { AppState } from "@app/editor/use-app-state"
import type { MenuEntry } from "@app/menus/types"

type SlotObject = Record<string, unknown> | null

/** The trigger and label props for one visible config menu. */
interface MenuTrigger {
  button: Record<string, unknown>
  label: Record<string, unknown>
}

/** Turns a config menu's slots on when the menu is visible, off when it is not. */
function slotFor(trigger: MenuTrigger | null): SlotObject {
  return trigger === null ? null : {}
}

const menuConfig = useMenuConfig()
const { appState } = useAppState()
const exportStatus = useExportStatusStore()

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
// an export. A plain click is inert.
function handleLogoClick(event: MouseEvent): void {
  if (!event.altKey || !event.shiftKey) return
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

function buildTrigger(menuId: string): MenuTrigger | null {
  const menu = menuConfig.value.find((entry) => entry.id === menuId)
  if (!menu) return null
  if (menu.visibleIn && !menu.visibleIn.includes(appState.value)) return null

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
}

// Each config menu is looked up by its id, so reordering the menus cannot land
// one menu's handlers on another menu's button. A menu hidden in the current
// app state resolves to null.
const triggers = computed(() => ({
  file: buildTrigger("file"),
  edit: buildTrigger("edit"),
  view: buildTrigger("view"),
  component: buildTrigger("component"),
  hari: buildTrigger("hari"),
  window: buildTrigger("window"),
  dev: buildTrigger("dev"),
}))

const openMenuItems = computed<MenuEntry[]>(() => {
  const menu = menuConfig.value.find((entry) => entry.id === openMenuId.value)
  return menu ? toMenuEntries(menu, appState.value) : []
})

const menuOpen = computed(() => openMenuId.value !== null)

const logoProps = { src: "/logo.svg", alt: "Seldon" }
const wordmarkProps = { src: "/wordmark-light.svg", alt: "Seldon" }
const emptySlot = {}

// Every value and handler reaches its slot by the slot's baked `data-seldon-ref`
// name, so moving or reordering a node in the design keeps this wiring intact.
const seldonRefs = computed<Record<string, Record<string, unknown>>>(() => ({
  logo: { onClick: handleLogoClick },
  logoMark: { ...logoProps },
  logoWordmark: { ...wordmarkProps },

  menuFile: { ...triggers.value.file?.button },
  menuFileLabel: { ...triggers.value.file?.label },
  menuEdit: { ...triggers.value.edit?.button },
  menuEditLabel: { ...triggers.value.edit?.label },
  menuView: { ...triggers.value.view?.button },
  menuViewLabel: { ...triggers.value.view?.label },
  menuComponent: { ...triggers.value.component?.button },
  menuComponentLabel: { ...triggers.value.component?.label },
  menuHari: { ...triggers.value.hari?.button },
  menuHariLabel: { ...triggers.value.hari?.label },
  menuWindow: { ...triggers.value.window?.button },
  menuWindowLabel: { ...triggers.value.window?.label },
  menuDev: { ...triggers.value.dev?.button },
  menuDevLabel: { ...triggers.value.dev?.label },
}))

// BarTopbar gates its opt-in slots on a prop being present, so every slot the
// refs above drive is turned on here. A hidden menu passes `null` instead, which
// collapses its trigger and label.
const slots = computed<Record<string, SlotObject>>(() => ({
  image: {},
  image2: {},

  buttonSimple: slotFor(triggers.value.file),
  textLabel: slotFor(triggers.value.file),
  buttonSimple2: slotFor(triggers.value.edit),
  textLabel2: slotFor(triggers.value.edit),
  buttonSimple3: slotFor(triggers.value.view),
  textLabel3: slotFor(triggers.value.view),
  buttonSimple4: slotFor(triggers.value.component),
  textLabel4: slotFor(triggers.value.component),
  buttonSimple5: slotFor(triggers.value.hari),
  textLabel5: slotFor(triggers.value.hari),
  buttonSimple6: slotFor(triggers.value.window),
  textLabel6: slotFor(triggers.value.window),
  buttonSimple7: slotFor(triggers.value.dev),
  textLabel7: slotFor(triggers.value.dev),
}))
</script>

<template>
  <header ref="header" class="topbar-header">
    <BarTopbar data-testid="topbar" v-bind="slots" :seldon-refs="seldonRefs" />
    <MenuController
      :open="menuOpen"
      :anchor="anchor"
      :items="openMenuItems"
      align="start"
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
