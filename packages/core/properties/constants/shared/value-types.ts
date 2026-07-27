/**
 * Tags each stored property value so resolution and export treat the payload correctly.
 *
 * `EMPTY` leaves the value unset so defaults and platform rules apply after merge. `INHERIT` reads
 * the value from the parent component for the same property path. `EXACT` stores a literal only,
 * with no pointer to theme tokens or other properties. `OPTION` stores one allowed enum or list
 * entry defined for the property. `COMPUTED` resolves from a declared function and inputs that
 * reference other values. `THEME_CATEGORICAL` points at a theme token from a named set with no scale
 * order, and `THEME_ORDINAL` points at a theme token on an ordered scale such as spacing or type
 * size.
 */
export enum ValueType {
  EMPTY = "empty",
  INHERIT = "inherit",
  EXACT = "exact",
  OPTION = "option",
  COMPUTED = "computed",
  THEME_CATEGORICAL = "theme.categorical",
  THEME_ORDINAL = "theme.ordinal",
}
