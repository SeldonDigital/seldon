"use client"

import { cn } from "@lib/utils/cn"
import { MenuDropdown } from "./MenuDropdown"
import { MenuConfig } from "./types"

interface MenuBarProps {
  menus: MenuConfig
  className?: string
}

export function Menu({ menus, className }: MenuBarProps) {
  return (
    <>
      <div className={cn("flex items-center gap-2 bg-background", className)}>
        {menus.map((menu) => (
          <MenuDropdown key={menu.id} menu={menu} />
        ))}
      </div>
    </>
  )
}
