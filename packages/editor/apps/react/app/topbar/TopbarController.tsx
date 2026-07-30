"use client"

import { useAppState } from "@app/editor/hooks/use-app-state"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useExportStatusStore } from "@app/io/export-status-store"
import { MenuController } from "@app/menus"
import { Frame } from "@seldon/components/frames/Frame"
import { BarTopbar } from "@seldon/components/parts/BarTopbar"
import { useCallback, useMemo, useRef, useState } from "react"

import { getChromeThemes } from "./chrome-themes"
import { useMenuConfig } from "./hooks/use-menu-config"
import { useTopbarGradientAnimation } from "./hooks/use-topbar-gradient-animation"
import { TOPBAR_GRADIENT_CLASS } from "./seldon-gradient"

import type { MenuDropdown } from "./menus/types"
import type { AppState } from "@app/editor/hooks/use-app-state"
import type { InterfaceMode } from "@app/editor/hooks/use-editor-config"
import type { MenuAlign, MenuEntry } from "@app/menus"
import type { ButtonMenuProps } from "@seldon/components/elements/ButtonMenu"
import type { ButtonSimpleProps } from "@seldon/components/elements/ButtonSimple"
import type { BarTopbarProps } from "@seldon/components/parts/BarTopbar"
import type { ImageProps } from "@seldon/components/primitives/Image"
import type { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { CSSProperties, MouseEvent, PointerEvent } from "react"

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

/**
 * Builds the `MenuEntry` list for a right-side dropdown (chrome theme or mode),
 * marking the active option with a bullet.
 */
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

/** Builds a right-side dropdown trigger wired to open or close its menu. */
function buildMenuTrigger(
  menuId: string,
  openMenuId: string | null,
  onTriggerClick: (menuId: string, anchor: HTMLElement) => void,
): ButtonMenuProps {
  return {
    "data-testid": `menu-${menuId}`,
    "aria-haspopup": "menu",
    "aria-expanded": openMenuId === menuId,
    onClick: (event: MouseEvent<HTMLButtonElement>) => onTriggerClick(menuId, event.currentTarget),
  } as ButtonMenuProps
}

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
 * `MenuController` anchored to whichever trigger is open. The right-side slots hold the
 * chrome-theme and interface-mode dropdowns, and the rainbow gradient strip is a
 * custom overlay because the view has no slot for it.
 */
export function TopbarController() {
  const menuConfig = useMenuConfig()
  const { appState } = useAppState()
  const { chromeTheme, setChromeTheme, interfaceMode, setInterfaceMode } = useEditorConfig()
  const chromeThemes = useMemo(() => getChromeThemes(), [])
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
      component: buildTrigger("component"),
      hari: buildTrigger("hari"),
      view: buildTrigger("view"),
      dev: buildTrigger("dev"),
    }),
    [buildTrigger],
  )

  const themeMenuItems = useMemo<MenuEntry[]>(
    () =>
      buildDropdownItems(
        chromeThemes.map((theme) => ({ id: theme.slug, label: theme.label })),
        chromeTheme,
        setChromeTheme,
        CHROME_THEME_MENU_ID,
      ),
    [chromeThemes, chromeTheme, setChromeTheme],
  )

  const activeThemeLabel = useMemo(() => {
    const active = chromeThemes.find((theme) => theme.slug === chromeTheme)

    return active?.label ?? chromeTheme
  }, [chromeThemes, chromeTheme])

  const themeButton = useMemo<ButtonMenuProps>(
    () => buildMenuTrigger(CHROME_THEME_MENU_ID, openMenuId, handleTriggerClick),
    [openMenuId, handleTriggerClick],
  )

  const themeLabel = useMemo<TextLabelProps>(
    () => ({ children: activeThemeLabel }),
    [activeThemeLabel],
  )

  const modeMenuItems = useMemo<MenuEntry[]>(
    () =>
      buildDropdownItems(INTERFACE_MODES, interfaceMode, setInterfaceMode, INTERFACE_MODE_MENU_ID),
    [interfaceMode, setInterfaceMode],
  )

  const activeModeLabel = useMemo(() => {
    const active = INTERFACE_MODES.find((mode) => mode.id === interfaceMode)

    return active?.label ?? "System"
  }, [interfaceMode])

  const modeButton = useMemo<ButtonMenuProps>(
    () => buildMenuTrigger(INTERFACE_MODE_MENU_ID, openMenuId, handleTriggerClick),
    [openMenuId, handleTriggerClick],
  )

  const modeLabel = useMemo<TextLabelProps>(
    () => ({ children: activeModeLabel }),
    [activeModeLabel],
  )

  const openMenuItems = useMemo<MenuEntry[]>(() => {
    if (openMenuId === CHROME_THEME_MENU_ID) return themeMenuItems
    if (openMenuId === INTERFACE_MODE_MENU_ID) return modeMenuItems
    const menu = menuConfig.find((entry) => entry.id === openMenuId)

    return menu ? toMenuEntries(menu, appState) : []
  }, [menuConfig, openMenuId, appState, themeMenuItems, modeMenuItems])

  // The theme and mode triggers sit at the right edge, so their menus align to
  // the trigger's right and open leftward. The left-side config menus align to
  // their left.
  const menuAlign: MenuAlign =
    openMenuId === CHROME_THEME_MENU_ID || openMenuId === INTERFACE_MODE_MENU_ID ? "end" : "start"

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
      menuComponent: { ...triggers.component?.button },
      menuComponentLabel: { ...triggers.component?.label },
      menuHari: { ...triggers.hari?.button },
      menuHariLabel: { ...triggers.hari?.label },
      menuView: { ...triggers.view?.button },
      menuViewLabel: { ...triggers.view?.label },
      menuDev: { ...triggers.dev?.button },
      menuDevLabel: { ...triggers.dev?.label },

      menuTheme: { ...themeButton },
      menuThemeLabel: { ...themeLabel },
      menuMode: { ...modeButton },
      menuModeLabel: { ...modeLabel },
    }),
    [handleLogoClick, triggers, themeButton, themeLabel, modeButton, modeLabel],
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
      buttonSimple3: slotFor(triggers.component),
      textLabel3: slotFor(triggers.component),
      buttonSimple4: slotFor(triggers.hari),
      textLabel4: slotFor(triggers.hari),
      buttonSimple5: slotFor(triggers.view),
      textLabel5: slotFor(triggers.view),
      buttonSimple6: slotFor(triggers.dev),
      textLabel6: slotFor(triggers.dev),

      buttonMenu: {},
      textLabel7: {},
      buttonMenu2: {},
      textLabel8: {},
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
        align={menuAlign}
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
