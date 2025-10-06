import { Orientation, Resize, ValueType } from "@seldon/core"
import { modulateWithTheme } from "@seldon/core/helpers/math/modulate"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { ThemeModulation } from "@seldon/core/themes/types"
import { StyleGenerationContext } from "../types"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

export function getSizeStyles({
  properties,
  parentContext,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const parentOrientation = parentContext?.properties?.orientation
    ? resolveValue(parentContext.properties.orientation)?.value
    : Orientation.VERTICAL

  const screenWidth = resolveValue(properties.screenWidth)
  const screenHeight = resolveValue(properties.screenHeight)

  if (screenWidth) {
    if (screenWidth.type === ValueType.EXACT) {
      styles.width = getCssValue(screenWidth) as string // We're sure that the value is a string since its a RemValue or a PixelValue
    } else if (screenWidth.type === ValueType.PRESET) {
      if (screenWidth.value === Resize.FILL) {
        styles.width = "100%"
      } else {
        styles.width = "fit-content"
      }
    }
  }

  if (screenHeight) {
    if (screenHeight.type === ValueType.EXACT) {
      styles.height = getCssValue(screenHeight) as string // We're sure that the value is a string since its a RemValue or a PixelValue
    } else if (screenHeight.type === ValueType.PRESET) {
      if (screenHeight.value === Resize.FILL) {
        styles.height = "100%"
      } else {
        styles.height = "fit-content"
      }
    }
  }

  if ("width" in properties) {
    // If position.left & position.right are set, width is ignored
    if (
      resolveValue(properties.position?.left) &&
      resolveValue(properties.position?.right)
    ) {
      return styles
    }

    const width = resolveValue(properties.width)

    if (properties.width && properties.width.type === ValueType.EMPTY) {
      // Do nothing for EMPTY values
    } else if (!width) {
      // Width defaults to Resize.FILL
      if (parentOrientation === Orientation.VERTICAL) {
        styles.alignSelf = "stretch"
      } else {
        styles.flex = "1 0 0"
      }
    } else if (width.type === ValueType.EXACT) {
      styles.width = getCssValue(width) as string // We're sure that the value is a string since its a RemValue or a PixelValue

      if (parentOrientation === Orientation.HORIZONTAL) {
        styles.flexShrink = 0
      }
    } else if (width.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(width.value, theme) as ThemeModulation

      styles.width =
        modulateWithTheme({
          theme,
          parameters: themeValue.parameters,
        }) + "rem"
    } else if (width.type === ValueType.PRESET) {
      if (width.value === Resize.FILL) {
        if (parentOrientation === Orientation.VERTICAL) {
          styles.alignSelf = "stretch"
        } else {
          styles.flex = "1 0 0"
        }
      } else {
        styles.width = "fit-content"
      }
    }
  }

  if ("height" in properties) {
    // If position.top & position.bottom are set, height is ignored
    if (
      resolveValue(properties.position?.top) &&
      resolveValue(properties.position?.bottom)
    ) {
      return styles
    }
    const height = resolveValue(properties.height)
    if (properties.height && properties.height.type === ValueType.EMPTY) {
      // Do nothing for EMPTY values
    } else if (!height) {
      // Height defaults to Resize.FIT
      styles.height = "fit-content"
    } else if (height.type === ValueType.EXACT) {
      styles.height = getCssValue(height) as string // We're sure that the value is a string since its a RemValue or a PixelValue

      if (parentOrientation === Orientation.VERTICAL) {
        styles.flexShrink = 0
      }
    } else if (height.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(height.value, theme) as ThemeModulation
      styles.height =
        modulateWithTheme({
          theme,
          parameters: themeValue.parameters,
        }) + "rem"
    } else if (height.type === ValueType.PRESET) {
      if (height.value === Resize.FILL) {
        if (parentOrientation === Orientation.VERTICAL) {
          styles.flex = "1 0 0"
        } else {
          styles.alignSelf = "stretch"
        }
      } else {
        styles.height = "fit-content"
      }
    }
  }

  return styles
}
