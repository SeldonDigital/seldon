"use client"

import { DropdownMenu, MenuEntry } from "@lib/menus"
import { useState } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { MenuDropdown as MenuDropdownType } from "./types"

interface MenuDropdownProps {
  menu: MenuDropdownType
}

const HIGHLIGHT_BACKGROUND = "hsl(0 0% 100% / 0.1)"

export function MenuDropdown({ menu }: MenuDropdownProps) {
  const { appState } = useAppState()
  const [isTriggerHovered, setIsTriggerHovered] = useState(false)

  // Check if this menu should be visible in the current app state
  if (menu.visibleIn && !menu.visibleIn.includes(appState)) {
    return null
  }

  const items = menu.items.flatMap<MenuEntry>((item) => {
    if (item === "separator") return ["separator"]
    if (item.visibleIn && !item.visibleIn.includes(appState)) return []
    return [
      {
        id: item.id,
        label: item.label,
        onSelect: item.action,
        disabled: item.disabled,
        active: item.active,
        activeMarker: item.activeMarker,
        shortcut: item.shortcut,
        icon: item.icon,
        testId: `menu-item-${item.id}`,
      },
    ]
  })

  return (
    <DropdownMenu
      items={items}
      align="start"
      minWidth="220px"
      renderTrigger={({ ref, open, triggerProps }) => (
        <button
          ref={ref}
          {...triggerProps}
          style={{
            borderRadius: "var(--sdn-corners-tight)",
            padding: "0.5rem 0.75rem",
            fontSize: "var(--sdn-font-size-xsmall)",
            color: "#F5F5F5",
            border: "none",
            outline: "none",
            cursor: "pointer",
            backgroundColor:
              open || isTriggerHovered ? HIGHLIGHT_BACKGROUND : "transparent",
          }}
          onPointerEnter={() => setIsTriggerHovered(true)}
          onPointerLeave={() => setIsTriggerHovered(false)}
          data-testid={`menu-${menu.id}`}
        >
          {menu.label}
        </button>
      )}
    />
  )
}
