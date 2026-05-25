"use client"

import { cn } from "@lib/utils/cn"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { MenuItem as MenuItemType } from "./types"

interface MenuItemProps {
  item: MenuItemType
  onSelect?: () => void
}

export function MenuItem({ item, onSelect }: MenuItemProps) {
  const { label, action, shortcut, disabled, active, icon } = item

  const handleSelect = () => {
    if (action) action()
    if (onSelect) onSelect()
  }

  return (
    <DropdownMenu.Item
      disabled={disabled}
      className={cn(
        "group relative flex h-8 select-none items-center px-2 text-sm text-white outline-none",
        "data-[disabled]:cursor-not-allowed data-[highlighted]:bg-white/10 data-[disabled]:opacity-50",
        active && "text-blue",
      )}
      onSelect={handleSelect}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-neutral-400">{shortcut}</span>
      )}
    </DropdownMenu.Item>
  )
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
}
