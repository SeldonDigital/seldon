import { HSL } from "@seldon/core"

export type MenuItemId = string

/**
 * A single actionable row in a menu. The icon and label-style slots are typed
 * by the consuming framework: the shared shape stays view-neutral, and each
 * editor binds `TIcon`/`TLabelStyle` to its own node and style types.
 */
export interface MenuItem<TIcon = never, TLabelStyle = never> {
  id: MenuItemId
  label: string
  onSelect?: () => void
  disabled?: boolean
  active?: boolean
  /**
   * Renders the leading marker for the chosen item in a radio or checkbox set.
   * Independent of `active` so an item can be tinted without a marker, or
   * marked without a tint. When omitted, the marker follows `active`.
   */
  selected?: boolean
  activeMarker?: "check" | "bullet"
  /** Extra style applied to the item label, e.g. an accent text color. */
  labelStyle?: TLabelStyle
  shortcut?: string
  icon?: TIcon
  testId?: string
}

/** An entry in a menu list: either an item or a divider. */
export type MenuEntry<TIcon = never, TLabelStyle = never> =
  | MenuItem<TIcon, TLabelStyle>
  | "separator"

/** Horizontal alignment of the menu against its trigger. */
export type MenuAlign = "start" | "end"

/** A single selectable option in a combobox list. */
export type ComboboxOptionItem = {
  value: string
  name: string
  hidden?: boolean
  disabled?: boolean
  color?: HSL
}

/** A flat option list, or a list of sections. */
export type ComboboxOptionItems = ComboboxOptionItem[] | ComboboxOptionItem[][]
