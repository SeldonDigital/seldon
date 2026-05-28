"use client"

import { cn } from "@lib/utils/cn"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { MenuDropdown as MenuDropdownType } from "./types"

interface MenuDropdownProps {
  menu: MenuDropdownType
}

export function MenuDropdown({ menu }: MenuDropdownProps) {
  const { appState } = useAppState()
  const [open, setOpen] = useState(false)

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
          className={cn(
            "rounded px-3 py-2 text-sm text-pearl",
            "hover:bg-white/10",
            "focus:outline-none",
            "data-[state=open]:bg-white/10",
          )}
          data-testid={`menu-${menu.id}`}
        >
          {menu.label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="z-50 min-w-[220px] rounded-md border border-neutral-800 bg-gray py-1 text-pearl shadow-md"
        sideOffset={5}
        align="start"
      >
        {menu.items.map((item, index) => {
          if (item === "separator") {
            return (
              <DropdownMenu.Separator
                key={index}
                className="mx-3 my-1 h-px bg-white/10"
              />
            )
          }

          // Filter out items not visible in current app state
          if (item.visibleIn && !item.visibleIn.includes(appState)) {
            return null
          }

          return (
            <DropdownMenu.Item
              key={item.id}
              className={cn(
                "flex cursor-pointer select-none items-center justify-between rounded-sm py-2 text-sm outline-none px-3",
                "hover:bg-background-hover focus:bg-background-hover",
                "data-[highlighted]:bg-white/10",
                item.disabled && "pointer-events-none opacity-50",
              )}
              disabled={item.disabled}
              onSelect={() => handleSelect(item.action)}
              data-testid={`menu-item-${item.id}`}
            >
              <div className="flex items-center gap-2">
                {item.active && (
                  <span className="text-blue font-bold w-3 text-right">✓</span>
                )}
                {!item.active && hasActiveItem && <span className="w-3" />}
                <span className="truncate">{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="ml-4 text-xs text-neutral-400">
                  {item.shortcut}
                </span>
              )}
            </DropdownMenu.Item>
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
