import {
  BoardHeightValue,
  BoardWidthValue,
  EmptyValue,
  Orientation,
  Resize,
  ScreenSize,
  Scroll,
  ValueType,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { modulateWithTheme } from "@seldon/core/themes/helpers/modulate"
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
  dimension:
    | Exclude<BoardWidthValue | BoardHeightValue, EmptyValue>
    | undefined,
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
  layoutMode,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const parentOrientation = parentContext?.properties?.orientation
    ? resolveValue(parentContext.properties.orientation)?.value
    : Orientation.VERTICAL

  // Children of a grid container size to their tracks, not flex item rules.
  const parentIsGrid = parentContext?.layoutMode === "grid"

  // A grid container expresses its own shrink through its track template
  // (`minmax(0, 1fr)`), so its outer box must keep the automatic `min: auto`.
  // Zeroing it lets the box collapse below its content and the rows overlap.
  const selfIsGrid = layoutMode === "grid"

  // A node that truncates its own text (wrap text off) must be able to shrink
  // below its content size. Flex items default to `min-width: auto`, which is the
  // nowrap min-content width, so it overrides the node's width and defeats the
  // ellipsis unless the automatic minimum is lifted along the main axis.
  const truncatesText = resolveValue(properties.wrapText)?.value === false

  const ownOrientation = properties.orientation
    ? resolveValue(properties.orientation)?.value
    : null

  // A node only needs to shrink below its content height when it manages its
  // own vertical overflow. Without this, a vertical fill item falls back to its
  // content height instead of collapsing when the parent has no free space.
  const scroll = resolveValue(properties.scroll)?.value
  const clipsVertically =
    scroll === Scroll.NONE ||
    scroll === Scroll.VERTICAL ||
    scroll === Scroll.BOTH

  const boardWidth = resolveValue(properties.board?.width)
  const boardHeight = resolveValue(properties.board?.height)

  applyBoardDimensionStyle(boardWidth, "width", styles)
  applyBoardDimensionStyle(boardHeight, "height", styles)

  const screenWidth = resolveValue(properties.screenWidth)
  const screenHeight = resolveValue(properties.screenHeight)

  if (screenWidth) {
    if (screenWidth.type === ValueType.EXACT) {
      // Check if this is actually a screen size preset that got stored as EXACT
      const value = (screenWidth as { value: unknown }).value
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
      const value = (screenWidth as { value: unknown }).value
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
      const value = (screenHeight as { value: unknown }).value
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
      const value = (screenHeight as { value: unknown }).value
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
      // Width defaults to Resize.FILL. Grid items stretch to fill their track by
      // default, so no flex item rule is emitted under a grid parent.
      if (!parentIsGrid) {
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
      }
    } else if (width.type === ValueType.EXACT) {
      styles.width = getCssValue(width) as string // We're sure that the value is a string since its a RemValue or a PixelValue

      if (!parentIsGrid && parentOrientation === Orientation.HORIZONTAL) {
        styles.flexShrink = 0
      }
    } else if (width.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(width.value, theme) as ThemeModulation

      styles.width =
        modulateWithTheme({
          theme,
          parameters: themeValue.parameters,
        }) + "rem"

      if (!parentIsGrid && parentOrientation === Orientation.HORIZONTAL) {
        styles.flexShrink = 0
      }
    } else if (width.type === ValueType.OPTION) {
      if (width.value === Resize.FILL) {
        if (!parentIsGrid) {
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
        }
      } else {
        styles.width = "fit-content"
        if (!parentIsGrid && parentOrientation === Orientation.HORIZONTAL) {
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

      if (!parentIsGrid && parentOrientation === Orientation.VERTICAL) {
        styles.flexShrink = 0
      }
    } else if (height.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(height.value, theme) as ThemeModulation
      styles.height =
        modulateWithTheme({
          theme,
          parameters: themeValue.parameters,
        }) + "rem"

      if (!parentIsGrid && parentOrientation === Orientation.VERTICAL) {
        styles.flexShrink = 0
      }
    } else if (height.type === ValueType.OPTION) {
      if (height.value === Resize.FILL) {
        // Grid items stretch to fill their track by default, so no flex item
        // rule is emitted under a grid parent.
        if (!parentIsGrid) {
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
        }
      } else {
        styles.height = "fit-content"
        if (!parentIsGrid && parentOrientation === Orientation.VERTICAL) {
          styles.flexShrink = 0
        }
      }
    }
  }

  // Lift the automatic flex minimum so a node can shrink below its content size
  // along the parent's main axis. On the inline axis this is what enables the
  // ellipsis, so fill items and text-truncating nodes both qualify. On the block
  // axis only a node that clips or scrolls its own vertical overflow qualifies;
  // a plain fill item keeps `min-height: auto` so it falls back to its content
  // height instead of collapsing when the parent has no free space to share.
  if (!parentIsGrid && !selfIsGrid) {
    if (parentOrientation === Orientation.HORIZONTAL) {
      if (styles.flex === "1 0 0" || truncatesText) {
        styles.minWidth = 0
      }
    } else if (parentOrientation === Orientation.VERTICAL) {
      if (clipsVertically) {
        styles.minHeight = 0
      }
    }
  }

  return styles
}
