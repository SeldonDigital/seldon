import { FlatProperty } from "./properties-data"

/**
 * Theme editing context. Present when the properties sidebar edits a theme
 * entry rather than a node, routing property edits to the theme.
 */
export interface ThemeEditingContext {
  isThemeEditing: true
  updateThemeProperty: (property: FlatProperty, newValue: string) => void
  themeProperties: FlatProperty[]
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
