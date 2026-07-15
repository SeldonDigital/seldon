import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Curated set of ARIA roles the catalog exposes as fixed choices. */
export enum AriaRole {
  NONE = "none",
  PRESENTATION = "presentation",
  IMG = "img",
  BUTTON = "button",
  LINK = "link",
  HEADING = "heading",
  LIST = "list",
  LISTITEM = "listitem",
  NAVIGATION = "navigation",
  MAIN = "main",
  BANNER = "banner",
  CONTENTINFO = "contentinfo",
  COMPLEMENTARY = "complementary",
  REGION = "region",
  SEARCH = "search",
  FORM = "form",
  DIALOG = "dialog",
  ALERTDIALOG = "alertdialog",
  ALERT = "alert",
  STATUS = "status",
  TOOLTIP = "tooltip",
  TAB = "tab",
  TABLIST = "tablist",
  TABPANEL = "tabpanel",
  MENU = "menu",
  MENUBAR = "menubar",
  MENUITEM = "menuitem",
  MENUITEMCHECKBOX = "menuitemcheckbox",
  MENUITEMRADIO = "menuitemradio",
  LISTBOX = "listbox",
  OPTION = "option",
  COMBOBOX = "combobox",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  RADIOGROUP = "radiogroup",
  SWITCH = "switch",
  SLIDER = "slider",
  PROGRESSBAR = "progressbar",
  SEPARATOR = "separator",
  TOOLBAR = "toolbar",
  GROUP = "group",
  ARTICLE = "article",
  NOTE = "note",
  TABLE = "table",
  ROW = "row",
  CELL = "cell",
  COLUMNHEADER = "columnheader",
  ROWHEADER = "rowheader",
  GRID = "grid",
  TREE = "tree",
  TREEITEM = "treeitem",
}

/** Records which ARIA role keyword is selected. */
export interface AriaRoleOptionValue {
  type: ValueType.OPTION
  value: AriaRole
}

/** Empty, or an ARIA role keyword from the curated list. */
export type AriaRoleValue = EmptyValue | AriaRoleOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `role`. */
export const roleSchema: PropertySchema = {
  name: "role",
  description: "ARIA role exposed to assistive technologies",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaRole) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaRole),
}
