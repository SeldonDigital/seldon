import {
  MenuEntry as MenuEntryBase,
  MenuItem as MenuItemBase,
} from "@seldon/editor/lib/menus/types"
import { CSSProperties, ReactNode } from "react"

export type {
  MenuItemId,
  MenuAlign,
  ComboboxOptionItem,
  ComboboxOptionItems,
} from "@seldon/editor/lib/menus/types"

/** React binding of the shared menu item: icon is a node, label style is CSS. */
export type MenuItem = MenuItemBase<ReactNode, CSSProperties>

/** An entry in a menu list: either an item or a divider. */
export type MenuEntry = MenuEntryBase<ReactNode, CSSProperties>

/**
 * How an option's leading icon renders: a theme icon id the generated `Icon`
 * slot can host, or an arbitrary node for dynamic icons the slot cannot.
 */
export type OptionIconRender =
  | { kind: "iconId"; icon: string }
  | { kind: "node"; node: ReactNode }
