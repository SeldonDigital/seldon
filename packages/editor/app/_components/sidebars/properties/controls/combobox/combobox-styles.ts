import { CSSProperties } from "react"

export const COMBOBOX_MENU_MAX_HEIGHT = "24rem"

export const comboboxFontStyle: CSSProperties = {
  fontFamily: "var(--sdn-seldon-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
  fontWeight: "var(--sdn-font-weight-medium)",
  lineHeight: "var(--sdn-line-height-solid)",
  letterSpacing: "0.1px",
}

export const comboboxInputStyle: CSSProperties = {
  flex: 1,
  padding: 0,
  border: "none",
  borderRadius: 0,
  outline: "none",
  backgroundColor: "transparent",
  lineHeight: "var(--sdn-line-height-solid)",
  fontSize: "var(--sdn-font-size-xsmall)",
}

export const comboboxFrameStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
}

export const comboboxWrapperStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  cursor: "pointer",
}

const optionHoverBackground = "hsl(0 0% 100% / 0.1)"

export function getOptionFrameStyle(options: {
  isSelected: boolean
  highlighted: boolean
  disabled?: boolean
  hidden?: boolean
}): CSSProperties {
  const { isSelected, highlighted, disabled, hidden } = options

  if (hidden) {
    return { display: "none" }
  }

  const showHighlight = isSelected || highlighted

  return {
    ...comboboxFontStyle,
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "2rem",
    gap: "6px",
    padding: "0 0.375rem",
    outline: "none",
    color: isSelected
      ? "var(--sdn-seldon-swatch-primary)"
      : "var(--sdn-seldon-swatch-pearl)",
    backgroundColor: showHighlight ? optionHoverBackground : undefined,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  }
}

export const comboboxOptionIconStyle: CSSProperties = {
  ...comboboxFontStyle,
  flexShrink: 0,
}

export const comboboxOptionLabelStyle: CSSProperties = {
  ...comboboxFontStyle,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

export const comboboxBackdropStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 10,
  width: "100%",
  height: "100%",
}

export function getOptionsPanelStyle(open: boolean): CSSProperties {
  return {
    position: "fixed",
    zIndex: 10,
    maxHeight: COMBOBOX_MENU_MAX_HEIGHT,
    minWidth: "8rem",
    overflow: open ? "auto" : "hidden",
    borderRadius: "var(--sdn-corners-tight)",
    border: "1px solid hsl(0 0% 0% / 0.1)",
    backgroundColor: "var(--sdn-seldon-swatch-charcoal)",
    color: "var(--sdn-seldon-swatch-pearl)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    boxShadow: "0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)",
    outline: "1px solid hsl(0 0% 0% / 0.15)",
  }
}

export function getOptionGroupStyle(isLast: boolean): CSSProperties {
  return isLast
    ? {}
    : {
        borderBottom: "1px solid hsl(0 0% 100% / 0.1)",
      }
}
