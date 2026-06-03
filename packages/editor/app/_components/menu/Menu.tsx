"use client"

import { MenuDropdown } from "./MenuDropdown"
import { MenuConfig } from "./types"

interface MenuBarProps {
  menus: MenuConfig
  className?: string
}

export function Menu({ menus, className }: MenuBarProps) {
  return (
    <>
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--color-background)",
        }}
      >
        {menus.map((menu) => (
          <MenuDropdown key={menu.id} menu={menu} />
        ))}
      </div>
    </>
  )
}
