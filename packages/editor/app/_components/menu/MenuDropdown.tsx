"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { CSSProperties, useState } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { MenuDropdown as MenuDropdownType, MenuItem } from "./types"

interface MenuDropdownProps {
  menu: MenuDropdownType
}

const HIGHLIGHT_BACKGROUND = "hsl(0 0% 100% / 0.1)"

export function MenuDropdown({ menu }: MenuDropdownProps) {
  const { appState } = useAppState()
  const [open, setOpen] = useState(false)
  const [isTriggerHovered, setIsTriggerHovered] = useState(false)

  // Check if this menu should be visible in the current app state
  if (menu.visibleIn && !menu.visibleIn.includes(appState)) {
    return null
  }

  // Check if any item in this menu is active
  const hasActiveItem = menu.items.some(
    (item) => item !== "separator" && item.active,
  )

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          style={{
            borderRadius: "var(--sdn-corners-tight)",
            padding: "0.5rem 0.75rem",
            fontSize: "var(--sdn-font-size-small)",
            color: "#F5F5F5",
            outline: "none",
            backgroundColor:
              open || isTriggerHovered ? HIGHLIGHT_BACKGROUND : undefined,
          }}
          onPointerEnter={() => setIsTriggerHovered(true)}
          onPointerLeave={() => setIsTriggerHovered(false)}
          data-testid={`menu-${menu.id}`}
        >
          {menu.label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        style={{
          zIndex: 50,
          minWidth: "220px",
          borderRadius: "0.375rem",
          border: "1px solid #262626",
          backgroundColor: "#333333",
          paddingTop: "var(--sdn-padding-tight)",
          paddingBottom: "var(--sdn-padding-tight)",
          color: "#F5F5F5",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
        sideOffset={5}
        align="start"
      >
        {menu.items.map((item, index) => {
          if (item === "separator") {
            return (
              <DropdownMenu.Separator
                key={index}
                style={{
                  margin: "0.25rem 0.75rem",
                  height: "1px",
                  backgroundColor: HIGHLIGHT_BACKGROUND,
                }}
              />
            )
          }

          // Filter out items not visible in current app state
          if (item.visibleIn && !item.visibleIn.includes(appState)) {
            return null
          }

          return (
            <DropdownItem
              key={item.id}
              item={item}
              hasActiveItem={hasActiveItem}
              onSelect={() => handleSelect(item.action)}
            />
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )

  // First we close the dropdown, then we call the action
  // this prevents running into this issue
  // https://github.com/radix-ui/primitives/issues/3317
  function handleSelect(action?: () => void) {
    setOpen(false)

    action?.()
  }
}

interface DropdownItemProps {
  item: MenuItem
  hasActiveItem: boolean
  onSelect: () => void
}

function DropdownItem({ item, hasActiveItem, onSelect }: DropdownItemProps) {
  const [isHighlighted, setIsHighlighted] = useState(false)

  const itemStyle: CSSProperties = {
    display: "flex",
    cursor: item.disabled ? undefined : "pointer",
    userSelect: "none",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.125rem",
    padding: "0.5rem 0.75rem",
    fontSize: "var(--sdn-font-size-small)",
    outline: "none",
    pointerEvents: item.disabled ? "none" : undefined,
    opacity: item.disabled ? 0.5 : undefined,
    backgroundColor: isHighlighted ? HIGHLIGHT_BACKGROUND : undefined,
  }

  return (
    <DropdownMenu.Item
      style={itemStyle}
      disabled={item.disabled}
      onSelect={onSelect}
      onPointerEnter={() => setIsHighlighted(true)}
      onPointerLeave={() => setIsHighlighted(false)}
      onFocus={() => setIsHighlighted(true)}
      onBlur={() => setIsHighlighted(false)}
      data-testid={`menu-item-${item.id}`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sdn-gap-compact)",
        }}
      >
        {item.active && (
          <span
            style={{
              color: "var(--sdn-swatch-seldon-blue)",
              fontWeight: "var(--sdn-font-weight-bold)",
              width: "0.75rem",
              textAlign: "right",
            }}
          >
            ✓
          </span>
        )}
        {!item.active && hasActiveItem && (
          <span style={{ width: "0.75rem" }} />
        )}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      </div>
      {item.shortcut && (
        <span
          style={{
            marginLeft: "1rem",
            fontSize: "var(--sdn-font-size-xsmall)",
            color: "#a3a3a3",
          }}
        >
          {item.shortcut}
        </span>
      )}
    </DropdownMenu.Item>
  )
}
