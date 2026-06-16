import { CSSProperties } from "react"

export const sidebarShellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  overflow: "hidden",
  backgroundColor: "var(--sdn-seldon-swatch-charcoal)",
}

export const sidebarNoSelectionStyle: CSSProperties = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "var(--sdn-padding-cozy, 1rem)",
  backgroundColor: "var(--sdn-seldon-swatch-charcoal)",
}

export const sidebarNoSelectionTextStyle: CSSProperties = {
  fontFamily: "var(--sdn-seldon-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
  color: "color-mix(in srgb, var(--sdn-seldon-swatch-white) 60%, transparent)",
}

export const propertyControlTextStyle: CSSProperties = {
  fontFamily: "var(--sdn-seldon-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
}

export const COLOR_SET = "var(--sdn-seldon-swatch-pearl)"
export const COLOR_UNSET =
  "color-mix(in srgb, var(--sdn-seldon-swatch-pearl) 60%, var(--sdn-seldon-swatch-charcoal))"
export const COLOR_NOT_USED = "var(--sdn-seldon-swatch-gray)"
export const COLOR_ERROR = "var(--sdn-seldon-swatch-negative)"
export const COLOR_OVERRIDE = "var(--sdn-seldon-swatch-primary)"
export const COLOR_DEBUG_COMPOUND = "var(--sdn-seldon-swatch-accent)"
export const COLOR_DEBUG_SHORTHAND = "var(--sdn-seldon-swatch-warning)"
export const COLOR_DEBUG_DEFAULT = "var(--sdn-seldon-swatch-positive)"

export const subPropertyRowBackground =
  "color-mix(in srgb, var(--sdn-seldon-swatch-charcoal) 70%, transparent)"

export const relativeFullWidthStyle: CSSProperties = {
  position: "relative",
  width: "100%",
}

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
