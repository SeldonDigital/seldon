// BESPOKE: temporary hand styling for sidebar property rows. These token-based
// styles stand in until the generated workspace Views own this look. Remove this
// file once the corresponding Views ship; do not add non-bespoke logic here.
import { CSSProperties } from "react"

export const propertyControlTextStyle: CSSProperties = {
  fontFamily: "var(--sdn-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
}

export const COLOR_SET = "var(--sdn-swatch-pearl)"
export const COLOR_UNSET =
  "color-mix(in srgb, var(--sdn-swatch-pearl) 60%, var(--sdn-swatch-charcoal))"
export const COLOR_NOT_USED = "var(--sdn-swatch-gray)"
export const COLOR_ERROR = "var(--sdn-swatch-negative)"
export const COLOR_OVERRIDE = "var(--sdn-swatch-primary)"
export const COLOR_DEBUG_COMPOUND = "var(--sdn-swatch-accent)"
export const COLOR_DEBUG_SHORTHAND = "var(--sdn-swatch-warning)"
export const COLOR_DEBUG_DEFAULT = "var(--sdn-swatch-positive)"

export const subPropertyRowBackground =
  "color-mix(in srgb, var(--sdn-swatch-charcoal) 70%, transparent)"

export const propertyControlWrapperStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  cursor: "pointer",
}

export const propertyControlInnerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}

export const propertyControlTextWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  height: "100%",
  display: "flex",
  alignItems: "center",
}

export const propertyControlContainerStyle: CSSProperties = {
  ...propertyControlTextWrapperStyle,
  ...propertyControlTextStyle,
  cursor: "pointer",
}
