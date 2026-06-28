import { CSSProperties, ReactNode } from "react"

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
  /** Renders the activated accent color (blue tint) on the label. */
  active?: boolean
  /**
   * Renders the leading marker for the chosen item in a radio or checkbox set.
   * Independent of `active` so an item can be tinted without a marker, or
   * marked without a tint. When omitted, the marker follows `active`.
   */
  selected?: boolean
  /** Marker glyph when marked. Defaults to a check; `"bullet"` for radio sets. */
  activeMarker?: "check" | "bullet"
  /** Extra style applied to the item label, e.g. an accent text color. */
  labelStyle?: CSSProperties
  shortcut?: string
  icon?: ReactNode
  /** Optional value for the rendered item's `data-testid`. */
  testId?: string
}

/** An entry in a menu list: either an item or a divider. */
export type MenuEntry = MenuItem | "separator"

/** Horizontal alignment of the menu against its trigger. */
export type MenuAlign = "start" | "end"
