/**
 * Tags each stored property value so resolution and export treat the payload correctly.
 */
export enum ValueType {
  /** Leave unset so defaults and platform rules apply after merge. */
  EMPTY = "empty",

  /** Read this value from the parent component for the same property path. */
  INHERIT = "inherit",

  /** Store a literal only, with no pointer to theme tokens or other properties. */
  EXACT = "exact",

  /** Store one allowed enum or list entry defined for the property. */
  OPTION = "option",

  /** Resolve from a declared function and inputs that reference other values. */
  COMPUTED = "computed",

  /** Point at a theme token from a named set that has no scale order. */
  THEME_CATEGORICAL = "theme.categorical",

  /** Point at a theme token on an ordered scale such as spacing or type size. */
  THEME_ORDINAL = "theme.ordinal",
}
