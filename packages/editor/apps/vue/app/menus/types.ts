import {
  MenuEntry as MenuEntryBase,
  MenuItem as MenuItemBase,
} from "@seldon/editor/lib/menus/types"
import type { CSSProperties } from "vue"

export type {
  MenuItemId,
  MenuAlign,
  ComboboxOptionItem,
  ComboboxOptionItems,
} from "@seldon/editor/lib/menus/types"

/** Vue binding of the shared menu item: icon is a theme icon id, label style is CSS. */
export type MenuItem = MenuItemBase<string, CSSProperties>

/** An entry in a menu list: either an item or a divider. */
export type MenuEntry = MenuEntryBase<string, CSSProperties>
