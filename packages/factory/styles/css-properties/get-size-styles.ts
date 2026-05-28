import { Orientation, Resize, ScreenSize, ValueType } from "@seldon/core"
import { modulateWithTheme } from "@seldon/core/themes/helpers/modulate"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { ThemeModulation } from "@seldon/core/themes/types"
import { StyleGenerationContext } from "../types"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

/**
 * Convert screen size preset to pixel value
 */
function getScreenSizePixelValue(screenSize: ScreenSize): number {
  switch (screenSize) {
    case ScreenSize.DESKTOP:
      return 1920
    case ScreenSize.LAPTOP:
      return 1366
    case ScreenSize.TABLET:
      return 768
    case ScreenSize.MOBILE:
      return 375
    case ScreenSize.WATCH:
      return 200
    case ScreenSize.TELEVISION:
      return 3840
    default:
      return 1920 // Default to desktop
  }
}

function applyBoardDimensionStyle(
  dimension: ReturnType<typeof resolveValue>,
  axis: "width" | "height",
  styles: CSSObject,
): void {
  if (!dimension) return

  if (dimension.type === ValueType.EXACT) {
    styles[axis] = getCssValue(dimension) as string
    return
  }

  if (dimension.type === ValueType.OPTION && dimension.value === Resize.FIT) {
    styles[axis] = "fit-content"
  }
}

export function getSizeStyles({
  properties,
  parentContext,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const parentOrientation = parentContext?.properties?.orientation
    ? resolveValue(parentContext.properties.orientation)?.value
    : Orientation.VERTICAL

  const ownOrientation = properties.orientation
    ? resolveValue(properties.orientation)?.value
    : null

  const boardWidth = resolveValue(properties.board?.width)
  const boardHeight = resolveValue(properties.board?.height)

  applyBoardDimensionStyle(boardWidth, "width", styles)
  applyBoardDimensionStyle(boardHeight, "height", styles)

  const screenWidth = resolveValue(properties.screenWidth)
  const screenHeight = resolveValue(properties.screenHeight)

  if (screenWidth) {
    if (screenWidth.type === ValueType.EXACT) {
      // Check if this is actually a screen size preset that got stored as EXACT
      const value = (screenWidth as any).value
      if (
        typeof value === "string" &&
        Object.values(ScreenSize).includes(value as ScreenSize)
      ) {
        const pixelValue = getScreenSizePixelValue(value as ScreenSize)
        styles.width = `${pixelValue}px`
      } else {
        styles.width = getCssValue(screenWidth) as string // We're sure that the value is a string since its a RemValue or a PixelValue
      }
    } else if (screenWidth.type === ValueType.OPTION) {
      const value = (screenWidth as any).value
      if (value === Resize.FIT) {
        styles.width = "fit-content"
      } else if (value === Resize.FILL) {
        styles.width = "100%"
      } else if (
        typeof value === "string" &&
        Object.values(ScreenSize).includes(value as ScreenSize)
      ) {
        // Handle device-specific screen size presets
        const pixelValue = getScreenSizePixelValue(value as ScreenSize)
        styles.width = `${pixelValue}px`
      }
    }
  }

  if (screenHeight) {
    if (screenHeight.type === ValueType.EXACT) {
      // Check if this is actually a screen size preset that got stored as EXACT
      const value = (screenHeight as any).value
      if (
        typeof value === "string" &&
        Object.values(ScreenSize).includes(value as ScreenSize)
      ) {
        const pixelValue = getScreenSizePixelValue(value as ScreenSize)
        styles.height = `${pixelValue}px`
      } else {
        styles.height = getCssValue(screenHeight) as string // We're sure that the value is a string since its a RemValue or a PixelValue
      }
    } else if (screenHeight.type === ValueType.OPTION) {
      const value = (screenHeight as any).value
      if (value === Resize.FIT) {
        styles.height = "fit-content"
      } else if (value === Resize.FILL) {
        styles.height = "100%"
      } else if (
        typeof value === "string" &&
        Object.values(ScreenSize).includes(value as ScreenSize)
      ) {
        // Handle device-specific screen size presets
        const pixelValue = getScreenSizePixelValue(value as ScreenSize)
        styles.height = `${pixelValue}px`
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
      if (ownOrientation) {
        if (parentOrientation === Orientation.HORIZONTAL) {
          styles.flex = "1 0 0"
        } else {
          // Parent is a flex container (VERTICAL), use alignSelf: stretch
          // instead of width: 100% to prevent overflow with padding
          styles.alignSelf = "stretch"
        }
      } else {
        if (parentOrientation === Orientation.VERTICAL) {
          styles.alignSelf = "stretch"
        } else {
          styles.flex = "1 0 0"
        }
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

      if (parentOrientation === Orientation.HORIZONTAL) {
        styles.flexShrink = 0
      }
    } else if (width.type === ValueType.OPTION) {
      if (width.value === Resize.FILL) {
        if (ownOrientation) {
          if (parentOrientation === Orientation.HORIZONTAL) {
            styles.flex = "1 0 0"
          } else {
            // Parent is a flex container (VERTICAL), use alignSelf: stretch
            // instead of width: 100% to prevent overflow with padding
            styles.alignSelf = "stretch"
          }
        } else {
          if (parentOrientation === Orientation.VERTICAL) {
            styles.alignSelf = "stretch"
          } else {
            styles.flex = "1 0 0"
          }
        }
      } else {
        styles.width = "fit-content"
        if (parentOrientation === Orientation.HORIZONTAL) {
          styles.flexShrink = 0
        }
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

      if (parentOrientation === Orientation.VERTICAL) {
        styles.flexShrink = 0
      }
    } else if (height.type === ValueType.OPTION) {
      if (height.value === Resize.FILL) {
        if (ownOrientation) {
          if (parentOrientation === Orientation.VERTICAL) {
            styles.flex = "1 0 0"
          } else {
            styles.height = "100%"
          }
        } else {
          if (parentOrientation === Orientation.VERTICAL) {
            styles.flex = "1 0 0"
          } else {
            styles.alignSelf = "stretch"
          }
        }
      } else {
        styles.height = "fit-content"
        if (parentOrientation === Orientation.VERTICAL) {
          styles.flexShrink = 0
        }
      }
    }
  }

  return styles
}
