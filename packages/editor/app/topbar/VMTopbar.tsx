"use client"

import { MenuAlign, MenuEntry, VMMenu } from "@lib/menus"
import { getChromeThemes } from "@lib/chrome/chrome-themes"
import {
  CSSProperties,
  MouseEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { AppState, useAppState } from "@lib/hooks/use-app-state"
import { InterfaceMode, useEditorConfig } from "@lib/hooks/use-editor-config"
import { useMenuConfig } from "./hooks/use-menu-config"
import { ButtonMenuProps } from "@seldon/components/elements/ButtonMenu"
import { ButtonSimpleProps } from "@seldon/components/elements/ButtonSimple"
import { BarTopbar } from "@seldon/components/parts/BarTopbar"
import { ImageProps } from "@seldon/components/primitives/Image"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { seldonGradientStyle } from "./VMTopbar.bespoke"
import { MenuDropdown } from "./menus/types"

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
    onClick: (event: MouseEvent<HTMLButtonElement>) =>
      onTriggerClick(menuId, event.currentTarget),
  } as ButtonMenuProps
}

/**
 * Maps a topbar menu's items into the framework-agnostic `MenuEntry` list the
 * floating `VMMenu` consumes, dropping items hidden in the current app state.
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

interface MenuSlot {
  button: ButtonSimpleProps | null
  label: TextLabelProps | null
}

const EMPTY_SLOT: MenuSlot = { button: null, label: null }

/**
 * View-model for the topbar. Feeds the generated `BarTopbar` view: it injects
 * the logo/wordmark images and maps each menu from `useMenuConfig` onto a
 * `buttonSimple` trigger slot, then overlays a single controlled floating
 * `VMMenu` anchored to whichever trigger is open. The right-side slots hold the
 * chrome-theme and interface-mode dropdowns, and the rainbow gradient strip is a
 * custom overlay because the view has no slot for it.
 */
export function VMTopbar() {
  const menuConfig = useMenuConfig()
  const { appState } = useAppState()
  const { chromeTheme, setChromeTheme, interfaceMode, setInterfaceMode } =
    useEditorConfig()
  const chromeThemes = useMemo(() => getChromeThemes(), [])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)

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

  const menuSlots = useMemo<MenuSlot[]>(() => {
    return [0, 1, 2, 3, 4].map((index) => {
      const menu = menuConfig[index]
      if (!menu) return EMPTY_SLOT
      if (menu.visibleIn && !menu.visibleIn.includes(appState))
        return EMPTY_SLOT

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
    })
  }, [menuConfig, appState, openMenuId, handleTriggerClick, handleTriggerEnter])

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
    () =>
      buildMenuTrigger(CHROME_THEME_MENU_ID, openMenuId, handleTriggerClick),
    [openMenuId, handleTriggerClick],
  )

  const themeLabel = useMemo<TextLabelProps>(
    () => ({ children: activeThemeLabel }),
    [activeThemeLabel],
  )

  const modeMenuItems = useMemo<MenuEntry[]>(
    () =>
      buildDropdownItems(
        INTERFACE_MODES,
        interfaceMode,
        setInterfaceMode,
        INTERFACE_MODE_MENU_ID,
      ),
    [interfaceMode, setInterfaceMode],
  )

  const activeModeLabel = useMemo(() => {
    const active = INTERFACE_MODES.find((mode) => mode.id === interfaceMode)
    return active?.label ?? "System"
  }, [interfaceMode])

  const modeButton = useMemo<ButtonMenuProps>(
    () =>
      buildMenuTrigger(INTERFACE_MODE_MENU_ID, openMenuId, handleTriggerClick),
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
    openMenuId === CHROME_THEME_MENU_ID || openMenuId === INTERFACE_MODE_MENU_ID
      ? "end"
      : "start"

  const menuKey = openMenuId ?? "closed"

  return (
    <header style={styles.header}>
      <BarTopbar
        data-testid="topbar"
        image={logoProps}
        image2={wordmarkProps}
        buttonSimple={menuSlots[0].button}
        textLabel={menuSlots[0].label}
        buttonSimple2={menuSlots[1].button}
        textLabel2={menuSlots[1].label}
        buttonSimple3={menuSlots[2].button}
        textLabel3={menuSlots[2].label}
        buttonSimple4={menuSlots[3].button}
        textLabel4={menuSlots[3].label}
        buttonSimple5={menuSlots[4].button}
        textLabel5={menuSlots[4].label}
        buttonMenu={themeButton}
        textLabel6={themeLabel}
        buttonMenu2={modeButton}
        textLabel7={modeLabel}
      />
      <VMMenu
        key={menuKey}
        open={openMenuId !== null}
        anchorRef={anchorRef}
        onClose={closeMenu}
        items={openMenuItems}
        align={menuAlign}
        minWidth="220px"
      />
      <div style={seldonGradientStyle} />
    </header>
  )
}

const logoProps: ImageProps = {
  src: "/logo.svg",
  alt: "Seldon",
}

const wordmarkProps: ImageProps = {
  src: "/word-mark.svg",
  alt: "Seldon",
}

const styles: Record<string, CSSProperties> = {
  header: {
    position: "relative",
    zIndex: 10,
    flexShrink: 0,
  },
}
