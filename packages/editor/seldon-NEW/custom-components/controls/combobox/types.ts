import { HSL } from "@seldon/core"

/**
 * A single combobox option. `hidden` and `disabled` are optional render flags;
 * `color` carries a swatch for color-valued options.
 */
export type ComboboxOptionItem = {
  value: string
  name: string
  hidden?: boolean
  disabled?: boolean
  color?: HSL
}

/** Combobox options as either a flat list or grouped sections. */
export type ComboboxOptionItems = ComboboxOptionItem[] | ComboboxOptionItem[][]
