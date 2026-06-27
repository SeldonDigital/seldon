"use client"

import { Menu, MenuAlign, MenuEntry } from "@lib/menus"
import {
  CSSProperties,
  ReactNode,
  Ref,
  RefObject,
  useRef,
  useState,
} from "react"
import { ButtonIconicProps } from "@seldon/components/elements/ButtonIconic"
import { IconProps } from "@seldon/components/primitives/Icon"
import { ICONIC_BUTTON_ATTR } from "../helpers/iconic-button"

interface UseRowActionsMenuOptions {
  align?: MenuAlign
  /** Tints the trigger icon to match the row contents (e.g. blue when selected). */
  color?: string
  "aria-label"?: string
  /** Receives focus after a menu action when the trigger may be removed. */
  focusTargetRef?: RefObject<HTMLElement | null>
}

const PLACEHOLDER_BUTTON_STYLE: CSSProperties = {
  visibility: "hidden",
  pointerEvents: "none",
  flexShrink: 0,
}

const PLACEHOLDER_ICON_STYLE: CSSProperties = {
  visibility: "hidden",
}

export interface RowActionsMenuSlots {
  hasActions: boolean
  /**
   * Trailing iconic-button slot props for a generated row. Always defined so
   * generated rows keep a stable footprint. Inactive rows receive a disabled,
   * inert placeholder; active rows receive the real menu trigger.
   */
  buttonIconic: ButtonIconicProps & { ref?: Ref<HTMLButtonElement> }
  /** Trigger icon slot props paired with the button slot. Always defined. */
  icon: IconProps
  /** Floating menu node. Render it as a sibling of the row. */
  menu: ReactNode
}

/**
 * Headless "..." actions menu for sidebar rows. Returns slot props that drive
 * a generated row's trailing iconic-button slot plus the floating menu node,
 * so no hand-written markup mimics generated styling. When there are no
 * actions the slot stays reserved with a non-interactive placeholder.
 */
export function useRowActionsMenu(
  items: MenuEntry[],
  options?: UseRowActionsMenuOptions,
): RowActionsMenuSlots {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const hasActions = items.length > 0
  const ariaLabel = options?.["aria-label"] ?? "Row actions"

  const icon: IconProps = {
    icon: "seldon-more",
    style: {
      ...(hasActions ? {} : PLACEHOLDER_ICON_STYLE),
      ...(options?.color ? { color: options.color } : {}),
    },
  }

  const buttonIconic = (
    hasActions
      ? {
          ref: triggerRef,
          type: "button" as const,
          [ICONIC_BUTTON_ATTR]: true,
          "aria-label": ariaLabel,
          "aria-haspopup": "menu" as const,
          "aria-expanded": open,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            setOpen((current) => !current)
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)
            }
          },
          style: {
            position: "relative",
            zIndex: 10,
          },
        }
      : {
          type: "button" as const,
          disabled: true,
          tabIndex: -1,
          inert: true,
          style: PLACEHOLDER_BUTTON_STYLE,
        }
  ) as RowActionsMenuSlots["buttonIconic"]

  const closeMenu = () => setOpen(false)
  const menuAlign = options?.align ?? "end"
  const menu = hasActions ? (
    <Menu
      open={open}
      anchorRef={triggerRef}
      focusTargetRef={options?.focusTargetRef}
      onClose={closeMenu}
      items={items}
      align={menuAlign}
    />
  ) : null

  return { hasActions, buttonIconic, icon, menu }
}
