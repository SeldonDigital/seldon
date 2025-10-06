import { StyleGenerationContext } from "../types"
import { getBorderStyles } from "./get-border-styles"
import { getColorCSSValue } from "./get-color-css-value"
import { getCornersStyles } from "./get-corners-styles"
import { getShadowStyles } from "./get-shadow-styles"
import { CSSObject } from "./types"

/**
/**
 * Get the CSS for the rectangle (checkbox) or outer circle (radio)
 */
interface GetRadioOrCheckboxWrapperCssProps {
  sizes: {
    defaultHeight: number
    radioDotSize: number
    checkboxIconSize: number
  }
  isChecked: boolean
  variant: "default" | "solid" | {}
  context: StyleGenerationContext
}
export function getRadioOrCheckboxWrapperCss({
  sizes,
  variant,
  isChecked,
  context,
}: GetRadioOrCheckboxWrapperCssProps): CSSObject {
  const color = context.properties.accentColor
    ? getColorCSSValue({
        color: context.properties.accentColor,
        theme: context.theme,
      })
    : ""
  const styles: CSSObject = {
    ...getShadowStyles(context),
    ...getBorderStyles(context),
    ...getCornersStyles(context),
  }

  styles.display = "flex"
  styles.alignItems = "center"
  styles.justifyContent = "center"
  styles.position = "relative"
  styles.appearance = "none"
  styles.height = `${sizes.defaultHeight}px`
  styles.width = `${sizes.defaultHeight}px`

  if (variant === "default") {
    styles.backgroundColor = "transparent"
    if (isChecked) {
      styles.borderColor = color
    }
  }

  if (variant === "solid" && isChecked) {
    styles.backgroundColor = color
    styles.borderColor = "transparent"
  }

  return styles
}
