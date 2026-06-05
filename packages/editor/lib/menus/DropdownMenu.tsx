"use client"

import { ReactNode, RefObject, useRef, useState } from "react"
import { Menu } from "./Menu"
import { MenuAlign, MenuEntry } from "./types"

export interface DropdownTriggerProps {
  "aria-haspopup": "menu"
  "aria-expanded": boolean
  onClick: (event: React.MouseEvent) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

export interface DropdownRenderTriggerArgs {
  ref: RefObject<HTMLButtonElement | null>
  open: boolean
  toggle: () => void
  triggerProps: DropdownTriggerProps
}

interface DropdownMenuProps {
  items: MenuEntry[]
  renderTrigger: (args: DropdownRenderTriggerArgs) => ReactNode
  align?: MenuAlign
  minWidth?: string
}

/**
 * Owns open state for a single dropdown and wires a trigger to the floating
 * `Menu`. `renderTrigger` lets callers supply any trigger element (text label,
 * icon button) while sharing one menu implementation.
 */
export function DropdownMenu({
  items,
  renderTrigger,
  align,
  minWidth,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const toggle = () => setOpen((current) => !current)

  const triggerProps: DropdownTriggerProps = {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: (event) => {
      event.stopPropagation()
      toggle()
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        setOpen(true)
      }
    },
  }

  return (
    <>
      {renderTrigger({ ref: triggerRef, open, toggle, triggerProps })}
      <Menu
        open={open}
        anchorRef={triggerRef}
        onClose={() => setOpen(false)}
        items={items}
        align={align}
        minWidth={minWidth}
      />
    </>
  )
}
