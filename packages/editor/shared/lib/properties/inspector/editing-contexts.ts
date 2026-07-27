import type { ThemeCustomTokenSection } from "@seldon/core"
import { FlatProperty } from "./properties-data"

/**
 * Theme editing context. Present when the properties sidebar edits a theme
 * entry rather than a node, routing property edits to the theme.
 */
export interface ThemeEditingContext {
  isThemeEditing: true
  updateThemeProperty: (property: FlatProperty, newValue: string) => void
  resetThemeProperty: (property: FlatProperty) => void
  /** Adds a custom token to a section. Only meaningful when `canAddCustom`. */
  addCustomToken: (section: ThemeCustomTokenSection) => void
  /** Renames a custom token's cell. The `customN` key stays stable. */
  renameCustomToken: (
    section: ThemeCustomTokenSection,
    key: string,
    name: string,
  ) => void
  /** Deletes a custom token cell from its section. */
  removeCustomToken: (section: ThemeCustomTokenSection, key: string) => void
  /** True when the edited entry is a variant, so custom tokens may be added. */
  canAddCustom: boolean
}

/**
 * Font collection editing context. Present when the sidebar edits a font
 * collection entry, routing family-row edits straight to the workspace.
 */
export interface FontCollectionEditingContext {
  isFontCollectionEditing: true
  updateFontCollectionProperty: (
    property: FlatProperty,
    newValue: string,
  ) => void
}

/**
 * Icon set editing context. Present when the sidebar edits an icon set entry,
 * routing icon-row edits straight to the workspace.
 */
export interface IconSetEditingContext {
  isIconSetEditing: true
  updateIconSetProperty: (property: FlatProperty, newValue: string) => void
}
