"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { CSSProperties, useState } from "react"
import { MenuItem as MenuItemType } from "./types"

interface MenuItemProps {
  item: MenuItemType
  onSelect?: () => void
}

export function MenuItem({ item, onSelect }: MenuItemProps) {
  const { label, action, shortcut, disabled, active, icon } = item
  const [isHighlighted, setIsHighlighted] = useState(false)

  const handleSelect = () => {
    if (action) action()
    if (onSelect) onSelect()
  }

  const itemStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    height: "2rem",
    userSelect: "none",
    alignItems: "center",
    paddingLeft: "var(--sdn-padding-compact)",
    paddingRight: "var(--sdn-padding-compact)",
    fontSize: "var(--sdn-font-size-small)",
    color: active
      ? "var(--sdn-swatch-seldon-blue)"
      : "var(--sdn-swatch-white)",
    outline: "none",
    cursor: disabled ? "not-allowed" : undefined,
    opacity: disabled ? 0.5 : undefined,
    backgroundColor:
      isHighlighted && !disabled ? "hsl(0 0% 100% / 0.1)" : undefined,
  }

  return (
    <DropdownMenu.Item
      disabled={disabled}
      style={itemStyle}
      onSelect={handleSelect}
      onPointerEnter={() => setIsHighlighted(true)}
      onPointerLeave={() => setIsHighlighted(false)}
      onFocus={() => setIsHighlighted(true)}
      onBlur={() => setIsHighlighted(false)}
    >
      {icon && (
        <span style={{ marginRight: "var(--sdn-margin-compact)" }}>{icon}</span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: "var(--sdn-font-size-xsmall)",
            color: "#a3a3a3",
          }}
        >
          {shortcut}
        </span>
      )}
    </DropdownMenu.Item>
  )
}

export function MenuSeparator() {
  return (
    <DropdownMenu.Separator
      style={{
        margin: "0.25rem 0",
        height: "1px",
        backgroundColor: "hsl(0 0% 100% / 0.1)",
      }}
    />
  )
}
