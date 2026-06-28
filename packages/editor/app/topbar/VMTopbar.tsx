"use client"

import {
  CSSProperties,
  MouseEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { MenuEntry, VMMenu } from "@lib/menus"
import { AppState, useAppState } from "@lib/hooks/use-app-state"
import { BarTopbar } from "@seldon/components/parts/BarTopbar"
import { ButtonSimpleProps } from "@seldon/components/elements/ButtonSimple"
import { ImageProps } from "@seldon/components/primitives/Image"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { useMenuConfig } from "./hooks/use-menu-config"
import { MenuDropdown } from "./menus/types"

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
 * `VMMenu` anchored to whichever trigger is open. The right-side theme/mode
 * dropdowns are hidden, and the rainbow gradient strip is a custom overlay
 * because the view has no slot for it.
 */
export function VMTopbar() {
  const menuConfig = useMenuConfig()
  const { appState } = useAppState()
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
      if (menu.visibleIn && !menu.visibleIn.includes(appState)) return EMPTY_SLOT

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

  const openMenuItems = useMemo<MenuEntry[]>(() => {
    const menu = menuConfig.find((entry) => entry.id === openMenuId)
    return menu ? toMenuEntries(menu, appState) : []
  }, [menuConfig, openMenuId, appState])

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
        buttonMenu={null}
        buttonMenu2={null}
      />
      <VMMenu
        open={openMenuId !== null}
        anchorRef={anchorRef}
        onClose={closeMenu}
        items={openMenuItems}
        align="start"
        minWidth="220px"
      />
      <div style={styles.gradient} />
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
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "1px",
    width: "100%",
    backgroundImage:
      "linear-gradient(90deg, var(--sdn-swatch-seldon-red) 0%, var(--sdn-swatch-seldon-yellow) 20%, var(--sdn-swatch-seldon-green) 40%, var(--sdn-swatch-seldon-blue) 70%, var(--sdn-swatch-seldon-red) 100%)",
  },
}
