import { accentColorSchema } from "../values/appearance/accent-color"
import { backgroundBrightnessSchema } from "../values/appearance/background/background-brightness"
import { backgroundColorSchema } from "../values/appearance/background/background-color"
import { backgroundImageSchema } from "../values/appearance/background/background-image"
import { backgroundOpacitySchema } from "../values/appearance/background/background-opacity"
import { backgroundPositionSchema } from "../values/appearance/background/background-position"
import { backgroundPresetSchema } from "../values/appearance/background/background-preset"
import { backgroundRepeatSchema } from "../values/appearance/background/background-repeat"
import { backgroundSizeSchema } from "../values/appearance/background/background-size"
import { borderCollapseSchema } from "../values/appearance/border-collapse"
import { borderBrightnessSchema } from "../values/appearance/border/border-brightness"
import { borderColorSchema } from "../values/appearance/border/border-color"
import { borderOpacitySchema } from "../values/appearance/border/border-opacity"
import { borderPresetSchema } from "../values/appearance/border/border-preset"
import { borderStyleSchema } from "../values/appearance/border/border-style"
import { borderWidthSchema } from "../values/appearance/border/border-width"
import { brightnessSchema } from "../values/appearance/brightness"
import { colorSchema } from "../values/appearance/color"
import { cornersSchema } from "../values/appearance/corners"
import { opacitySchema } from "../values/appearance/opacity"
import { sizeSchema } from "../values/appearance/size"
import { ariaHiddenSchema } from "../values/attributes/aria-hidden"
import { contentSchema } from "../values/attributes/content"
import { cursorSchema } from "../values/attributes/cursor"
import { htmlElementSchema } from "../values/attributes/html-element"
import { inputTypeSchema } from "../values/attributes/input-type"
import { symbolSchema } from "../values/attributes/symbol"
import { scrollSchema } from "../values/effects/scroll"
import { scrollbarStyleSchema } from "../values/effects/scrollbar-style"
import { shadowBlurSchema } from "../values/effects/shadow/shadow-blur"
import { shadowBrightnessSchema } from "../values/effects/shadow/shadow-brightness"
import { shadowColorSchema } from "../values/effects/shadow/shadow-color"
import { shadowOffsetSchema } from "../values/effects/shadow/shadow-offset"
import { shadowOpacitySchema } from "../values/effects/shadow/shadow-opacity"
import { shadowPresetSchema } from "../values/effects/shadow/shadow-preset"
import { shadowSpreadSchema } from "../values/effects/shadow/shadow-spread"
import { gradientAngleSchema } from "../values/gradients/gradient-angle"
import { gradientPresetSchema } from "../values/gradients/gradient-preset"
import { gradientStopBrightnessSchema } from "../values/gradients/gradient-stop-brightness"
import { gradientStopColorSchema } from "../values/gradients/gradient-stop-color"
import { gradientStopOpacitySchema } from "../values/gradients/gradient-stop-opacity"
import { gradientStopPositionSchema } from "../values/gradients/gradient-stop-position"
import { gradientTypeSchema } from "../values/gradients/gradient-type"
import { alignSchema } from "../values/layout/align"
import { clipSchema } from "../values/layout/clip"
import { columnsSchema } from "../values/layout/columns"
import { dimensionSchema } from "../values/layout/dimension"
import { directionSchema } from "../values/layout/direction"
import { displaySchema } from "../values/layout/display"
import { gapSchema } from "../values/layout/gap"
import { heightSchema } from "../values/layout/height"
import { marginSchema } from "../values/layout/margin"
import { orientationSchema } from "../values/layout/orientation"
import { paddingSchema } from "../values/layout/padding"
import { positionSchema } from "../values/layout/position"
import { resizeSchema, screenSizeSchema } from "../values/layout/resize"
import { rotationSchema } from "../values/layout/rotation"
import { rowsSchema } from "../values/layout/rows"
import { screenHeightSchema } from "../values/layout/screen-height"
import { screenWidthSchema } from "../values/layout/screen-width"
import { widthSchema } from "../values/layout/width"
import { wrapChildrenSchema } from "../values/layout/wrap-children"
import { buttonSizeSchema } from "../values/shared/utilities/buttonSize"
import { imageFitSchema } from "../values/shared/utilities/image-fit"
import { fontFamilySchema } from "../values/typography/font/font-family"
import { fontPresetSchema } from "../values/typography/font/font-preset"
import { fontSizeSchema } from "../values/typography/font/font-size"
import { fontStyleSchema } from "../values/typography/font/font-style"
import { fontWeightSchema } from "../values/typography/font/font-weight"
import { lineHeightSchema } from "../values/typography/font/line-height"
import { letterSpacingSchema } from "../values/typography/letter-spacing"
import { lineCountSchema } from "../values/typography/line-count"
import { linesSchema } from "../values/typography/lines"
import { textAlignSchema } from "../values/typography/text-align"
import { textCaseSchema } from "../values/typography/text-case"
import { textDecorationSchema } from "../values/typography/text-decoration"
import { wrapTextSchema } from "../values/typography/wrap-text"

export const PROPERTY_SCHEMAS = {
  // 1. ATTRIBUTES
  content: contentSchema,
  symbol: symbolSchema,
  htmlElement: htmlElementSchema,
  inputType: inputTypeSchema,
  cursor: cursorSchema,
  ariaHidden: ariaHiddenSchema,

  // 2. LAYOUT
  direction: directionSchema,
  position: positionSchema,
  orientation: orientationSchema,
  align: alignSchema,
  width: widthSchema,
  height: heightSchema,
  screenWidth: screenWidthSchema,
  screenHeight: screenHeightSchema,
  margin: marginSchema,
  padding: paddingSchema,
  gap: gapSchema,
  rotation: rotationSchema,
  wrapChildren: wrapChildrenSchema,
  clip: clipSchema,
  columns: columnsSchema,
  rows: rowsSchema,
  display: displaySchema,
  dimension: dimensionSchema,
  resize: resizeSchema,
  screenSize: screenSizeSchema,

  // 3. APPEARANCE
  color: colorSchema,
  accentColor: accentColorSchema,
  brightness: brightnessSchema,
  opacity: opacitySchema,
  size: sizeSchema,
  buttonSize: buttonSizeSchema,
  // Background subsection
  backgroundPreset: backgroundPresetSchema,
  backgroundImage: backgroundImageSchema,
  backgroundPosition: backgroundPositionSchema,
  backgroundSize: backgroundSizeSchema,
  backgroundRepeat: backgroundRepeatSchema,
  backgroundColor: backgroundColorSchema,
  backgroundBrightness: backgroundBrightnessSchema,
  backgroundOpacity: backgroundOpacitySchema,
  // Border subsection
  borderPreset: borderPresetSchema,
  borderCollapse: borderCollapseSchema,
  borderStyle: borderStyleSchema,
  borderColor: borderColorSchema,
  borderWidth: borderWidthSchema,
  borderBrightness: borderBrightnessSchema,
  borderOpacity: borderOpacitySchema,
  // Border side-specific properties
  borderTopColor: borderColorSchema,
  borderTopStyle: borderStyleSchema,
  borderTopWidth: borderWidthSchema,
  borderTopOpacity: borderOpacitySchema,
  borderTopBrightness: borderBrightnessSchema,
  borderRightColor: borderColorSchema,
  borderRightStyle: borderStyleSchema,
  borderRightWidth: borderWidthSchema,
  borderRightOpacity: borderOpacitySchema,
  borderRightBrightness: borderBrightnessSchema,
  borderBottomColor: borderColorSchema,
  borderBottomStyle: borderStyleSchema,
  borderBottomWidth: borderWidthSchema,
  borderBottomOpacity: borderOpacitySchema,
  borderBottomBrightness: borderBrightnessSchema,
  borderLeftColor: borderColorSchema,
  borderLeftStyle: borderStyleSchema,
  borderLeftWidth: borderWidthSchema,
  borderLeftOpacity: borderOpacitySchema,
  borderLeftBrightness: borderBrightnessSchema,
  // Corners subsection
  corners: cornersSchema,

  // 4. TYPOGRAPHY
  // Font subsection
  fontPreset: fontPresetSchema,
  fontFamily: fontFamilySchema,
  fontStyle: fontStyleSchema,
  fontWeight: fontWeightSchema,
  fontSize: fontSizeSchema,
  fontLineHeight: lineHeightSchema,
  fontTextCase: textCaseSchema,
  textAlign: textAlignSchema,
  letterSpacing: letterSpacingSchema,
  textCase: textCaseSchema,
  textDecoration: textDecorationSchema,
  wrapText: wrapTextSchema,
  lines: linesSchema,
  lineCount: lineCountSchema,
  lineHeight: lineHeightSchema,

  // 5. GRADIENTS
  gradientPreset: gradientPresetSchema,
  gradientAngle: gradientAngleSchema,
  gradientStartColor: gradientStopColorSchema,
  gradientStartBrightness: gradientStopBrightnessSchema,
  gradientStartOpacity: gradientStopOpacitySchema,
  gradientStartPosition: gradientStopPositionSchema,
  gradientEndColor: gradientStopColorSchema,
  gradientEndBrightness: gradientStopBrightnessSchema,
  gradientEndOpacity: gradientStopOpacitySchema,
  gradientEndPosition: gradientStopPositionSchema,
  gradientGradientType: gradientTypeSchema,
  gradientType: gradientTypeSchema,
  gradientStopBrightness: gradientStopBrightnessSchema,
  gradientStopColor: gradientStopColorSchema,
  gradientStopOpacity: gradientStopOpacitySchema,
  gradientStopPosition: gradientStopPositionSchema,

  // 6. EFFECTS
  // Shadow subsection
  shadowPreset: shadowPresetSchema,
  shadowOffsetX: shadowOffsetSchema,
  shadowOffsetY: shadowOffsetSchema,
  shadowBlur: shadowBlurSchema,
  shadowColor: shadowColorSchema,
  shadowBrightness: shadowBrightnessSchema,
  shadowOpacity: shadowOpacitySchema,
  shadowSpread: shadowSpreadSchema,
  shadowOffset: shadowOffsetSchema,
  scroll: scrollSchema,
  scrollbarStyle: scrollbarStyleSchema,
  imageFit: imageFitSchema,
} as const

export type PropertyName = keyof typeof PROPERTY_SCHEMAS

// Re-export helper functions
export * from "./helpers"
