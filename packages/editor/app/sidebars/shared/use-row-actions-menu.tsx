"use client"

import { Menu, MenuAlign, MenuEntry } from "@lib/menus"
import { ICONIC_BUTTON_ATTR } from "../helpers/iconic-button"
import { ReactNode, Ref, useRef, useState } from "react"
import { ButtonIconicProps } from "@seldon/components/elements/ButtonIconic"
import { IconProps } from "@seldon/components/primitives/Icon"

interface UseRowActionsMenuOptions {
  align?: MenuAlign
  /** Tints the trigger icon to match the row contents (e.g. blue when selected). */
  color?: string
  "aria-label"?: string
}

export interface RowActionsMenuSlots {
  /**
   * Trailing iconic-button slot props for a generated row. The `ref` rides
   * along as a regular prop and reaches the underlying button element.
   */
  buttonIconic: ButtonIconicProps & { ref: Ref<HTMLButtonElement> }
  /** Trigger icon slot props paired with the button slot. */
  icon: IconProps
  /** Floating menu node. Render it as a sibling of the row. */
  menu: ReactNode
}

/**
 * Headless "..." actions menu for sidebar rows. Returns slot props that drive
 * a generated row's trailing iconic-button slot plus the floating menu node,
 * so no hand-written markup mimics generated styling. When there are no
 * actions the trigger keeps its footprint but hides the icon and ignores
 * interaction, mirroring how the reset button was previously hidden.
 */
export function useRowActionsMenu(
  items: MenuEntry[],
  options?: UseRowActionsMenuOptions,
): RowActionsMenuSlots {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const hasActions = items.length > 0
  const ariaLabel = options?.["aria-label"] ?? "Row actions"

  const buttonIconic = {
    ref: triggerRef,
    type: "button" as const,
    [ICONIC_BUTTON_ATTR]: true,
    "aria-label": ariaLabel,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-hidden": hasActions ? undefined : true,
    tabIndex: hasActions ? undefined : -1,
    onClick: (event) => {
      event.stopPropagation()
      setOpen((current) => !current)
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        setOpen(true)
      }
    },
    style: {
      position: "relative",
      zIndex: 10,
      ...(hasActions ? null : { pointerEvents: "none" }),
    },
  } as RowActionsMenuSlots["buttonIconic"]

  const icon: IconProps = {
    icon: "seldon-more",
    style: {
      opacity: hasActions ? 1 : 0,
      ...(options?.color ? { color: options.color } : {}),
    },
  }

  const menu = (
    <Menu
      open={open}
      anchorRef={triggerRef}
      onClose={() => setOpen(false)}
      items={items}
      align={options?.align ?? "end"}
    />
  )

  return { buttonIconic, icon, menu }
}
