"use client"

import { MenuAlign, MenuEntry, VMMenu } from "@lib/menus"
import { getChromeThemes } from "@lib/theme/chrome-themes"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
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
import {
  InterfaceMode,
  useEditorConfig,
} from "@lib/hooks/use-editor-config"
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
  const { workspace } = useWorkspace()
  const chromeThemes = useMemo(() => getChromeThemes(workspace), [workspace])
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

  const themeMenuItems = useMemo<MenuEntry[]>(() => {
    return chromeThemes.map((theme) => ({
      id: theme.slug,
      label: theme.label,
      onSelect: () => setChromeTheme(theme.slug),
      active: theme.slug === chromeTheme,
      activeMarker: theme.slug === chromeTheme ? "bullet" : undefined,
      testId: `chrome-theme-${theme.slug}`,
    }))
  }, [chromeThemes, chromeTheme, setChromeTheme])

  const activeThemeLabel = useMemo(() => {
    const active = chromeThemes.find((theme) => theme.slug === chromeTheme)
    return active?.label ?? chromeTheme
  }, [chromeThemes, chromeTheme])

  const themeButton = useMemo<ButtonMenuProps>(
    () =>
      ({
        "data-testid": `menu-${CHROME_THEME_MENU_ID}`,
        "aria-haspopup": "menu",
        "aria-expanded": openMenuId === CHROME_THEME_MENU_ID,
        onClick: (event: MouseEvent<HTMLButtonElement>) =>
          handleTriggerClick(CHROME_THEME_MENU_ID, event.currentTarget),
      }) as ButtonMenuProps,
    [openMenuId, handleTriggerClick],
  )

  const themeLabel = useMemo<TextLabelProps>(
    () => ({ children: activeThemeLabel }),
    [activeThemeLabel],
  )

  const modeMenuItems = useMemo<MenuEntry[]>(() => {
    return INTERFACE_MODES.map((mode) => ({
      id: mode.id,
      label: mode.label,
      onSelect: () => setInterfaceMode(mode.id),
      active: mode.id === interfaceMode,
      activeMarker: mode.id === interfaceMode ? "bullet" : undefined,
      testId: `interface-mode-${mode.id}`,
    }))
  }, [interfaceMode, setInterfaceMode])

  const activeModeLabel = useMemo(() => {
    const active = INTERFACE_MODES.find((mode) => mode.id === interfaceMode)
    return active?.label ?? "System"
  }, [interfaceMode])

  const modeButton = useMemo<ButtonMenuProps>(
    () =>
      ({
        "data-testid": `menu-${INTERFACE_MODE_MENU_ID}`,
        "aria-haspopup": "menu",
        "aria-expanded": openMenuId === INTERFACE_MODE_MENU_ID,
        onClick: (event: MouseEvent<HTMLButtonElement>) =>
          handleTriggerClick(INTERFACE_MODE_MENU_ID, event.currentTarget),
      }) as ButtonMenuProps,
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
    openMenuId === CHROME_THEME_MENU_ID ||
    openMenuId === INTERFACE_MODE_MENU_ID
      ? "end"
      : "start"

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
        key={openMenuId ?? "closed"}
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
