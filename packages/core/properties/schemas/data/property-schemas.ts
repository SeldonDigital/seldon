import { accentColorSchema } from "../../values/appearance/accent-color"
import { backgroundBlendModeSchema } from "../../values/appearance/background/background-blend-mode"
import { backgroundBrightnessSchema } from "../../values/appearance/background/background-brightness"
import { backgroundColorSchema } from "../../values/appearance/background/background-color"
import { backgroundFilterSchema } from "../../values/appearance/background/background-filter"
import { backgroundImageSchema } from "../../values/appearance/background/background-image"
import { backgroundOpacitySchema } from "../../values/appearance/background/background-opacity"
import { backgroundPositionSchema } from "../../values/appearance/background/background-position"
import { backgroundPresetSchema } from "../../values/appearance/background/background"
import { backgroundRepeatSchema } from "../../values/appearance/background/background-repeat"
import { backgroundSizeSchema } from "../../values/appearance/background/background-size"
import { borderCollapseSchema } from "../../values/appearance/border-collapse"
import { borderBrightnessSchema } from "../../values/appearance/border/border-brightness"
import { borderColorSchema } from "../../values/appearance/border/border-color"
import { borderOpacitySchema } from "../../values/appearance/border/border-opacity"
import { borderPresetSchema } from "../../values/appearance/border/border"
import { borderStyleSchema } from "../../values/appearance/border/border-style"
import { borderWidthSchema } from "../../values/appearance/border/border-width"
import { brightnessSchema } from "../../values/appearance/brightness"
import { colorSchema } from "../../values/appearance/color"
import { cornersSchema } from "../../values/appearance/corners"
import { opacitySchema } from "../../values/appearance/opacity"
import { sizeSchema } from "../../values/appearance/size"
import { ariaHiddenSchema } from "../../values/attributes/aria-hidden"
import { checkedSchema } from "../../values/attributes/checked"
import { altTextSchema } from "../../values/attributes/alt-text"
import { ariaLabelSchema } from "../../values/attributes/aria-label"
import { contentSchema } from "../../values/attributes/content"
import { placeholderSchema } from "../../values/attributes/placeholder"
import { cursorSchema } from "../../values/attributes/cursor"
import { htmlElementSchema } from "../../values/attributes/html-element"
import { wrapperElementSchema } from "../../values/attributes/wrapper-element"
import { inputTypeSchema } from "../../values/attributes/input-type"
import { sourceSchema } from "../../values/attributes/source"
import { symbolSchema } from "../../values/attributes/symbol"
import { scrollSchema } from "../../values/effects/scroll"
import { scrollbarStyleSchema } from "../../values/effects/scrollbar-style"
import { shadowBlurSchema } from "../../values/effects/shadow/shadow-blur"
import { shadowBrightnessSchema } from "../../values/effects/shadow/shadow-brightness"
import { shadowColorSchema } from "../../values/effects/shadow/shadow-color"
import { shadowOffsetSchema } from "../../values/effects/shadow/shadow-offset"
import { shadowOpacitySchema } from "../../values/effects/shadow/shadow-opacity"
import { shadowPresetSchema } from "../../values/effects/shadow/shadow"
import { shadowSpreadSchema } from "../../values/effects/shadow/shadow-spread"
import { gradientAngleSchema } from "../../values/effects/gradients/gradient-angle"
import { gradientPresetSchema } from "../../values/effects/gradients/gradient"
import { gradientStopBrightnessSchema } from "../../values/effects/gradients/gradient-stop-brightness"
import { gradientStopColorSchema } from "../../values/effects/gradients/gradient-stop-color"
import { gradientStopOpacitySchema } from "../../values/effects/gradients/gradient-stop-opacity"
import { gradientStopPositionSchema } from "../../values/effects/gradients/gradient-stop-position"
import { gradientTypeSchema } from "../../values/effects/gradients/gradient-type"
import { boardHeightSchema } from "../../values/layout/board/board-height"
import { boardPresetSchema } from "../../values/layout/board/board-preset"
import { boardWidthSchema } from "../../values/layout/board/board-width"
import { alignSchema } from "../../values/layout/align"
import { cellAlignSchema } from "../../values/layout/cell-align"
import { clipSchema } from "../../values/layout/clip"
import { placementSchema } from "../../values/layout/placement"
import { columnsSchema } from "../../values/layout/columns"
import { dimensionSchema } from "../../values/layout/dimension"
import { directionSchema } from "../../values/layout/direction"
import { displaySchema } from "../../values/layout/display"
import { gapSchema } from "../../values/layout/gap"
import { heightSchema } from "../../values/layout/height"
import { marginSchema } from "../../values/layout/margin"
import { orientationSchema } from "../../values/layout/orientation"
import { paddingSchema } from "../../values/layout/padding"
import { positionSchema } from "../../values/layout/position"
import { resizeSchema } from "../../values/layout/resize"
import { screenSizeSchema } from "../../values/layout/screen-size"
import { rotationSchema } from "../../values/layout/rotation"
import { rowsSchema } from "../../values/layout/rows"
import { screenHeightSchema } from "../../values/layout/screen-height"
import { screenWidthSchema } from "../../values/layout/screen-width"
import { widthSchema } from "../../values/layout/width"
import { wrapChildrenSchema } from "../../values/layout/wrap-children"
import { buttonSizeSchema } from "../../values/shared/utilities/button-size"
import { imageFitSchema } from "../../values/shared/utilities/image-fit"
import { fontFamilySchema } from "../../values/typography/font/font-family"
import { fontPresetSchema } from "../../values/typography/font/font"
import { fontSizeSchema } from "../../values/typography/font/font-size"
import { fontStyleSchema } from "../../values/typography/font/font-style"
import { fontWeightSchema } from "../../values/typography/font/font-weight"
import { lineHeightSchema } from "../../values/typography/font/line-height"
import { letterSpacingSchema } from "../../values/typography/letter-spacing"
import { linesSchema } from "../../values/typography/lines"
import { textAlignSchema } from "../../values/typography/text-align"
import { textCaseSchema } from "../../values/typography/text-casing"
import { textDecorationSchema } from "../../values/typography/text-decoration"
import { wrapTextSchema } from "../../values/typography/wrap-text"
import { attachPropertyDisplayMetadata } from "../../constants/property-display"

/** Flat catalog map keyed by joined facet names; see `PROPERTY-SCHEMAS.md`. */
const PROPERTY_SCHEMAS_RAW = {
  // 1. ATTRIBUTES (PROPERTIES.md table order)
  display: displaySchema,
  htmlElement: htmlElementSchema,
  wrapperElement: wrapperElementSchema,
  content: contentSchema,
  symbol: symbolSchema,
  source: sourceSchema,
  imageFit: imageFitSchema,
  altText: altTextSchema,
  inputType: inputTypeSchema,
  placeholder: placeholderSchema,
  checked: checkedSchema,
  ariaLabel: ariaLabelSchema,
  ariaHidden: ariaHiddenSchema,
  size: sizeSchema,
  buttonSize: buttonSizeSchema,
  boardPreset: boardPresetSchema,
  boardWidth: boardWidthSchema,
  boardHeight: boardHeightSchema,
  screenWidth: screenWidthSchema,
  screenHeight: screenHeightSchema,
  cursor: cursorSchema,

  // 2. LAYOUT (PROPERTIES.md table order; then auxiliary layout schemas)
  direction: directionSchema,
  placement: placementSchema,
  position: positionSchema,
  orientation: orientationSchema,
  align: alignSchema,
  width: widthSchema,
  height: heightSchema,
  margin: marginSchema,
  padding: paddingSchema,
  gap: gapSchema,
  rotation: rotationSchema,
  wrapChildren: wrapChildrenSchema,
  clip: clipSchema,
  columns: columnsSchema,
  rows: rowsSchema,
  cellAlign: cellAlignSchema,
  dimension: dimensionSchema,
  resize: resizeSchema,
  screenSize: screenSizeSchema,

  // 3. APPEARANCE (PROPERTIES.md: color → opacity → background[] → border* → corners → borderCollapse)
  color: colorSchema,
  accentColor: accentColorSchema,
  brightness: brightnessSchema,
  opacity: opacitySchema,
  // Background layer facets (preset = theme categorical for `theme.background`)
  backgroundPreset: backgroundPresetSchema,
  backgroundImage: backgroundImageSchema,
  backgroundPosition: backgroundPositionSchema,
  backgroundSize: backgroundSizeSchema,
  backgroundRepeat: backgroundRepeatSchema,
  backgroundColor: backgroundColorSchema,
  backgroundBlendMode: backgroundBlendModeSchema,
  backgroundFilter: backgroundFilterSchema,
  backgroundBrightness: backgroundBrightnessSchema,
  backgroundOpacity: backgroundOpacitySchema,
  // Border (all sides)
  borderPreset: borderPresetSchema,
  borderStyle: borderStyleSchema,
  borderColor: borderColorSchema,
  borderWidth: borderWidthSchema,
  borderBrightness: borderBrightnessSchema,
  borderOpacity: borderOpacitySchema,
  borderTopPreset: borderPresetSchema,
  borderTopStyle: borderStyleSchema,
  borderTopColor: borderColorSchema,
  borderTopWidth: borderWidthSchema,
  borderTopBrightness: borderBrightnessSchema,
  borderTopOpacity: borderOpacitySchema,
  borderTopCollapse: borderCollapseSchema,
  borderRightPreset: borderPresetSchema,
  borderRightStyle: borderStyleSchema,
  borderRightColor: borderColorSchema,
  borderRightWidth: borderWidthSchema,
  borderRightBrightness: borderBrightnessSchema,
  borderRightOpacity: borderOpacitySchema,
  borderRightCollapse: borderCollapseSchema,
  borderBottomPreset: borderPresetSchema,
  borderBottomStyle: borderStyleSchema,
  borderBottomColor: borderColorSchema,
  borderBottomWidth: borderWidthSchema,
  borderBottomBrightness: borderBrightnessSchema,
  borderBottomOpacity: borderOpacitySchema,
  borderBottomCollapse: borderCollapseSchema,
  borderLeftPreset: borderPresetSchema,
  borderLeftStyle: borderStyleSchema,
  borderLeftColor: borderColorSchema,
  borderLeftWidth: borderWidthSchema,
  borderLeftBrightness: borderBrightnessSchema,
  borderLeftOpacity: borderOpacitySchema,
  borderLeftCollapse: borderCollapseSchema,
  corners: cornersSchema,
  borderCollapse: borderCollapseSchema,

  // 4. TYPOGRAPHY (PROPERTIES.md: font.* then textAlign → lines)
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

  // EFFECTS (PROPERTIES.md — gradient[], shadow[], scroll, scrollbarStyle)
  gradientPreset: gradientPresetSchema,
  // `getCompoundSubPropertySchema("gradient", "gradientType")` joins parent + PascalCase facet →
  // `gradientGradientType` (facet name repeats "gradient"). Same schema is also under `gradientType`
  // so theme/UI code can call `getPropertySchema` / `getPresetOptions` / `validatePropertyValue` with
  // the facet name alone (see e.g. theme pane GradientSection).
  gradientGradientType: gradientTypeSchema,
  gradientType: gradientTypeSchema,
  gradientAngle: gradientAngleSchema,
  gradientStartColor: gradientStopColorSchema,
  gradientStartBrightness: gradientStopBrightnessSchema,
  gradientStartOpacity: gradientStopOpacitySchema,
  gradientStartPosition: gradientStopPositionSchema,
  gradientEndColor: gradientStopColorSchema,
  gradientEndBrightness: gradientStopBrightnessSchema,
  gradientEndOpacity: gradientStopOpacitySchema,
  gradientEndPosition: gradientStopPositionSchema,
  gradientStopBrightness: gradientStopBrightnessSchema,
  gradientStopColor: gradientStopColorSchema,
  gradientStopOpacity: gradientStopOpacitySchema,
  gradientStopPosition: gradientStopPositionSchema,
  shadowPreset: shadowPresetSchema,
  shadowOffsetX: shadowOffsetSchema,
  shadowOffsetY: shadowOffsetSchema,
  shadowBlur: shadowBlurSchema,
  shadowColor: shadowColorSchema,
  shadowBrightness: shadowBrightnessSchema,
  shadowOpacity: shadowOpacitySchema,
  shadowSpread: shadowSpreadSchema,
  scroll: scrollSchema,
  scrollbarStyle: scrollbarStyleSchema,
} as const

export const PROPERTY_SCHEMAS = attachPropertyDisplayMetadata(PROPERTY_SCHEMAS_RAW)

/** The property schema catalog: same object as {@link PROPERTY_SCHEMAS}. */
export const PROPERTY_SCHEMA_CATALOG = PROPERTY_SCHEMAS

export type PropertyName = keyof typeof PROPERTY_SCHEMAS
