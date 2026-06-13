import { ReactNode } from "react"

export type MenuItemId = string

/**
 * A single actionable row in a menu. Framework-agnostic: consumers map their
 * own item shapes onto this and run side effects through `onSelect`.
 */
export interface MenuItem {
  id: MenuItemId
  label: string
  onSelect?: () => void
  disabled?: boolean
  /** Renders the active marker and accent color for toggled items. */
  active?: boolean
  /** Marker shown when `active`. Defaults to a check; `"bullet"` for radio sets. */
  activeMarker?: "check" | "bullet"
  shortcut?: string
  icon?: ReactNode
  /** Optional value for the rendered item's `data-testid`. */
  testId?: string
}

/** An entry in a menu list: either an item or a divider. */
export type MenuEntry = MenuItem | "separator"

/** Horizontal alignment of the menu against its trigger. */
export type MenuAlign = "start" | "end"
