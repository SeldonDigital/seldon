import { ReactNode } from "react"
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

/**
 * How a combobox option's icon binds to the generated `ListboxOption`. An
 * `iconId` flows through the option icon slot; a `node` is a dynamic element the
 * string-based icon slot cannot host, so it renders through the option children.
 */
export type OptionIconRender =
  | { kind: "iconId"; icon: string }
  | { kind: "node"; node: ReactNode }
