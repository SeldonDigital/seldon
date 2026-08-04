"use client"

import { useAppState } from "@app/editor/hooks/use-app-state"
import { useExportStatusStore } from "@app/io/export-status-store"
import { MenuController } from "@app/menus"
import { Frame } from "@seldon/components/frames/Frame"
import { BarTopbar } from "@seldon/components/parts/BarTopbar"
import { useCallback, useMemo, useRef, useState } from "react"

import { useMenuConfig } from "./hooks/use-menu-config"
import { useTopbarGradientAnimation } from "./hooks/use-topbar-gradient-animation"
import { TOPBAR_GRADIENT_CLASS } from "./seldon-gradient"

import type { MenuDropdown } from "./menus/types"
import type { AppState } from "@app/editor/hooks/use-app-state"
import type { MenuEntry } from "@app/menus"
import type { ButtonSimpleProps } from "@seldon/components/elements/ButtonSimple"
import type { BarTopbarProps } from "@seldon/components/parts/BarTopbar"
import type { ImageProps } from "@seldon/components/primitives/Image"
import type { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { CSSProperties, MouseEvent, PointerEvent } from "react"

/**
 * Maps a topbar menu's items into the framework-agnostic `MenuEntry` list the
 * floating `MenuController` consumes, dropping items hidden in the current app state.
 */
function toMenuEntries(menu: MenuDropdown, appState: AppState): MenuEntry[] {
  return menu.items.flatMap<MenuEntry>((item) => {
    if (item === "separator") return ["separator"]
    if (item.visibleIn && !item.visibleIn.includes(appState)) return []

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

/** The trigger and label props for one visible config menu. */
interface MenuTrigger {
  button: ButtonSimpleProps
  label: TextLabelProps
}

/** Turns a config menu's slots on when the menu is visible, off when it is not. */
function slotFor(trigger: MenuTrigger | null) {
  return trigger === null ? null : {}
}

/**
 * View-model for the topbar. Feeds the generated `BarTopbar` view: it injects
 * the logo/wordmark images and maps each menu from `useMenuConfig` onto a
 * `buttonSimple` trigger slot, then overlays a single controlled floating
 * `MenuController` anchored to whichever trigger is open. The rainbow gradient
 * strip is a custom overlay because the view has no slot for it.
 */
export function TopbarController() {
  const menuConfig = useMenuConfig()
  const { appState } = useAppState()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)

  const gradientRef = useTopbarGradientAnimation()

  // Alt+Shift+click anywhere on the logo frame (cube + wordmark) toggles the
  // export rainbow, a hidden gesture for previewing the animation without
  // running an export. A plain click is inert.
  const handleLogoClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!event.altKey || !event.shiftKey) return
    const { isExporting, setExporting } = useExportStatusStore.getState()

    setExporting(!isExporting)
  }, [])

  const closeMenu = useCallback(() => setOpenMenuId(null), [])

  const handleTriggerClick = useCallback((id: string, el: HTMLElement) => {
    anchorRef.current = el
    setOpenMenuId((current) => (current === id ? null : id))
  }, [])

  const handleTriggerEnter = useCallback(
    (id: string, el: HTMLElement) => {
      if (openMenuId === null) return
      anchorRef.current = el
      setOpenMenuId(id)
    },
    [openMenuId],
  )

  const buildTrigger = useCallback(
    (menuId: string): MenuTrigger | null => {
      const menu = menuConfig.find((entry) => entry.id === menuId)

      if (!menu) return null

      if (menu.visibleIn && !menu.visibleIn.includes(appState)) {
        return null
      }

      const button = {
        "data-testid": `menu-${menu.id}`,
        "aria-haspopup": "menu",
        "aria-expanded": openMenuId === menu.id,
        onClick: (event: MouseEvent<HTMLButtonElement>) =>
          handleTriggerClick(menu.id, event.currentTarget),
        onPointerEnter: (event: PointerEvent<HTMLButtonElement>) =>
          handleTriggerEnter(menu.id, event.currentTarget),
      } as ButtonSimpleProps

      return { button, label: { children: menu.label } }
    },
    [menuConfig, appState, openMenuId, handleTriggerClick, handleTriggerEnter],
  )

  // Each config menu is looked up by its id, so reordering the menus cannot land
  // one menu's handlers on another menu's button. A menu hidden in the current
  // app state resolves to null.
  const triggers = useMemo(
    () => ({
      file: buildTrigger("file"),
      edit: buildTrigger("edit"),
      view: buildTrigger("view"),
      component: buildTrigger("component"),
      hari: buildTrigger("hari"),
      window: buildTrigger("window"),
      dev: buildTrigger("dev"),
    }),
    [buildTrigger],
  )

  const openMenuItems = useMemo<MenuEntry[]>(() => {
    const menu = menuConfig.find((entry) => entry.id === openMenuId)

    return menu ? toMenuEntries(menu, appState) : []
  }, [menuConfig, openMenuId, appState])

  const menuKey = openMenuId ?? "closed"

  // Every value and handler reaches its slot by the slot's baked `data-seldon-ref`
  // name, so moving or reordering a node in the design keeps this wiring intact.
  const seldonRefs = useMemo<SeldonRefs>(
    () => ({
      logo: { onClick: handleLogoClick },
      logoMark: { ...logoProps },
      logoWordmark: { ...wordmarkProps },

      menuFile: { ...triggers.file?.button },
      menuFileLabel: { ...triggers.file?.label },
      menuEdit: { ...triggers.edit?.button },
      menuEditLabel: { ...triggers.edit?.label },
      menuView: { ...triggers.view?.button },
      menuViewLabel: { ...triggers.view?.label },
      menuComponent: { ...triggers.component?.button },
      menuComponentLabel: { ...triggers.component?.label },
      menuHari: { ...triggers.hari?.button },
      menuHariLabel: { ...triggers.hari?.label },
      menuWindow: { ...triggers.window?.button },
      menuWindowLabel: { ...triggers.window?.label },
      menuDev: { ...triggers.dev?.button },
      menuDevLabel: { ...triggers.dev?.label },
    }),
    [handleLogoClick, triggers],
  )

  // BarTopbar gates its opt-in slots on a prop being present, so every slot the
  // refs above drive is turned on here. A hidden menu passes `null` instead,
  // which collapses its trigger and label.
  const slots = useMemo<Partial<BarTopbarProps>>(
    () => ({
      image: {},
      image2: {},

      buttonSimple: slotFor(triggers.file),
      textLabel: slotFor(triggers.file),
      buttonSimple2: slotFor(triggers.edit),
      textLabel2: slotFor(triggers.edit),
      buttonSimple3: slotFor(triggers.view),
      textLabel3: slotFor(triggers.view),
      buttonSimple4: slotFor(triggers.component),
      textLabel4: slotFor(triggers.component),
      buttonSimple5: slotFor(triggers.hari),
      textLabel5: slotFor(triggers.hari),
      buttonSimple6: slotFor(triggers.window),
      textLabel6: slotFor(triggers.window),
      buttonSimple7: slotFor(triggers.dev),
      textLabel7: slotFor(triggers.dev),
    }),
    [triggers],
  )

  return (
    <Frame wrapperElement="header" style={styles.header}>
      <BarTopbar data-testid="topbar" {...slots} seldonRefs={seldonRefs} />
      <MenuController
        key={menuKey}
        open={openMenuId !== null}
        anchorRef={anchorRef}
        onClose={closeMenu}
        items={openMenuItems}
        align="start"
        minWidth="220px"
      />
      <Frame ref={gradientRef} className={TOPBAR_GRADIENT_CLASS} />
    </Frame>
  )
}

const logoProps: ImageProps = {
  src: "/logo.svg",
  alt: "Seldon",
}

const wordmarkProps: ImageProps = {
  src: "/wordmark-light.svg",
  alt: "Seldon",
}

const styles: Record<string, CSSProperties> = {
  header: {
    position: "relative",
    zIndex: 10,
    flexShrink: 0,
  },
}
