import { attachPropertyDisplayMetadata } from "../../constants/property-display"
import { ariaCheckedSchema } from "../../values/accessibility/aria-checked"
import { ariaCurrentSchema } from "../../values/accessibility/aria-current"
import { ariaDisabledSchema } from "../../values/accessibility/aria-disabled"
import { ariaExpandedSchema } from "../../values/accessibility/aria-expanded"
import { ariaHasPopupSchema } from "../../values/accessibility/aria-has-popup"
import { ariaHiddenSchema } from "../../values/accessibility/aria-hidden"
import { ariaInvalidSchema } from "../../values/accessibility/aria-invalid"
import { ariaLabelSchema } from "../../values/accessibility/aria-label"
import { ariaLiveSchema } from "../../values/accessibility/aria-live"
import { ariaPressedSchema } from "../../values/accessibility/aria-pressed"
import { ariaReadonlySchema } from "../../values/accessibility/aria-readonly"
import { ariaRequiredSchema } from "../../values/accessibility/aria-required"
import { ariaSelectedSchema } from "../../values/accessibility/aria-selected"
import { roleSchema } from "../../values/accessibility/role"
import { accentColorSchema } from "../../values/appearance/accent-color"
import { backgroundBlendModeSchema } from "../../values/appearance/background/background-blend-mode"
import { backgroundBrightnessSchema } from "../../values/appearance/background/background-brightness"
import { backgroundColorSchema } from "../../values/appearance/background/background-color"
import { backgroundFilterSchema } from "../../values/appearance/background/background-filter"
import { backgroundImageSchema } from "../../values/appearance/background/background-image"
import { backgroundKindSchema } from "../../values/appearance/background/background-kind"
import { backgroundOpacitySchema } from "../../values/appearance/background/background-opacity"
import { backgroundPositionSchema } from "../../values/appearance/background/background-position"
import { backgroundRepeatSchema } from "../../values/appearance/background/background-repeat"
import { backgroundSizeSchema } from "../../values/appearance/background/background-size"
import { borderCollapseSchema } from "../../values/appearance/border-collapse"
import { borderPresetSchema } from "../../values/appearance/border/border"
import { borderBrightnessSchema } from "../../values/appearance/border/border-brightness"
import { borderColorSchema } from "../../values/appearance/border/border-color"
import { borderOpacitySchema } from "../../values/appearance/border/border-opacity"
import { borderStyleSchema } from "../../values/appearance/border/border-style"
import { borderWidthSchema } from "../../values/appearance/border/border-width"
import { brightnessSchema } from "../../values/appearance/brightness"
import { colorSchema } from "../../values/appearance/color"
import { cornersSchema } from "../../values/appearance/corners"
import { opacitySchema } from "../../values/appearance/opacity"
import { sizeSchema } from "../../values/appearance/size"
import { altTextSchema } from "../../values/attributes/alt-text"
import { checkedSchema } from "../../values/attributes/checked"
import { contentSchema } from "../../values/attributes/content"
import { cursorSchema } from "../../values/attributes/cursor"
import { htmlElementSchema } from "../../values/attributes/html-element"
import { inputTypeSchema } from "../../values/attributes/input-type"
import {
  autoPlaySchema,
  controlsSchema,
  loopSchema,
  mediaQuerySchema,
  mediaTypeSchema,
  mutedSchema,
  posterSchema,
  preloadSchema,
  srcLangSchema,
  trackDefaultSchema,
  trackKindSchema,
  trackLabelSchema,
} from "../../values/attributes/media"
import { placeholderSchema } from "../../values/attributes/placeholder"
import { sourceSchema } from "../../values/attributes/source"
import { symbolSchema } from "../../values/attributes/symbol"
import { wrapperElementSchema } from "../../values/attributes/wrapper-element"
import { gradientPresetSchema } from "../../values/effects/gradients/gradient"
import { gradientAngleSchema } from "../../values/effects/gradients/gradient-angle"
import { gradientStopBrightnessSchema } from "../../values/effects/gradients/gradient-stop-brightness"
import { gradientStopColorSchema } from "../../values/effects/gradients/gradient-stop-color"
import { gradientStopOpacitySchema } from "../../values/effects/gradients/gradient-stop-opacity"
import { gradientStopPositionSchema } from "../../values/effects/gradients/gradient-stop-position"
import { gradientTypeSchema } from "../../values/effects/gradients/gradient-type"
import { scrollSchema } from "../../values/effects/scroll"
import { scrollbarStyleSchema } from "../../values/effects/scrollbar-style"
import { shadowPresetSchema } from "../../values/effects/shadow/shadow"
import { shadowBlurSchema } from "../../values/effects/shadow/shadow-blur"
import { shadowBrightnessSchema } from "../../values/effects/shadow/shadow-brightness"
import { shadowColorSchema } from "../../values/effects/shadow/shadow-color"
import { shadowOffsetSchema } from "../../values/effects/shadow/shadow-offset"
import { shadowOpacitySchema } from "../../values/effects/shadow/shadow-opacity"
import { shadowSpreadSchema } from "../../values/effects/shadow/shadow-spread"
import { shadowStyleSchema } from "../../values/effects/shadow/shadow-style"
import { alignSchema } from "../../values/layout/align"
import { boardHeightSchema } from "../../values/layout/board/board-height"
import { boardPresetSchema } from "../../values/layout/board/board-preset"
import { boardWidthSchema } from "../../values/layout/board/board-width"
import { cellAlignSchema } from "../../values/layout/cell-align"
import { clipSchema } from "../../values/layout/clip"
import { columnSpanSchema } from "../../values/layout/column-span"
import { columnStartSchema } from "../../values/layout/column-start"
import { columnsSchema } from "../../values/layout/columns"
import { dimensionSchema } from "../../values/layout/dimension"
import { directionSchema } from "../../values/layout/direction"
import { displaySchema } from "../../values/layout/display"
import { gapSchema } from "../../values/layout/gap"
import { heightSchema } from "../../values/layout/height"
import { listStylePositionSchema } from "../../values/layout/list-style-position"
import { listStyleTypeSchema } from "../../values/layout/list-style-type"
import { marginSchema } from "../../values/layout/margin"
import { orientationSchema } from "../../values/layout/orientation"
import { paddingSchema } from "../../values/layout/padding"
import { placementSchema } from "../../values/layout/placement"
import { positionSchema } from "../../values/layout/position"
import { resizeSchema } from "../../values/layout/resize"
import { rotationSchema } from "../../values/layout/rotation"
import { rowSpanSchema } from "../../values/layout/row-span"
import { rowStartSchema } from "../../values/layout/row-start"
import { rowsSchema } from "../../values/layout/rows"
import { screenHeightSchema } from "../../values/layout/screen-height"
import { screenSizeSchema } from "../../values/layout/screen-size"
import { screenWidthSchema } from "../../values/layout/screen-width"
import { widthSchema } from "../../values/layout/width"
import { wrapChildrenSchema } from "../../values/layout/wrap-children"
import { buttonSizeSchema } from "../../values/shared/utilities/button-size"
import { imageFitSchema } from "../../values/shared/utilities/image-fit"
import { fontPresetSchema } from "../../values/typography/font/font"
import { fontFamilySchema } from "../../values/typography/font/font-family"
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
  controls: controlsSchema,
  autoPlay: autoPlaySchema,
  loop: loopSchema,
  muted: mutedSchema,
  poster: posterSchema,
  preload: preloadSchema,
  trackKind: trackKindSchema,
  srcLang: srcLangSchema,
  trackLabel: trackLabelSchema,
  trackDefault: trackDefaultSchema,
  mediaType: mediaTypeSchema,
  mediaQuery: mediaQuerySchema,
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
  listStyleType: listStyleTypeSchema,
  listStylePosition: listStylePositionSchema,
  columns: columnsSchema,
  rows: rowsSchema,
  columnStart: columnStartSchema,
  columnSpan: columnSpanSchema,
  rowStart: rowStartSchema,
  rowSpan: rowSpanSchema,
  cellAlign: cellAlignSchema,
  dimension: dimensionSchema,
  resize: resizeSchema,
  screenSize: screenSizeSchema,

  // 3. APPEARANCE (PROPERTIES.md: color → opacity → background[] → border* → corners → borderCollapse)
  color: colorSchema,
  accentColor: accentColorSchema,
  brightness: brightnessSchema,
  opacity: opacitySchema,
  // Background layer facets (kind = none | color | image | gradient discriminator)
  backgroundKind: backgroundKindSchema,
  backgroundImage: backgroundImageSchema,
  backgroundPosition: backgroundPositionSchema,
  backgroundSize: backgroundSizeSchema,
  backgroundRepeat: backgroundRepeatSchema,
  backgroundColor: backgroundColorSchema,
  backgroundBlendMode: backgroundBlendModeSchema,
  backgroundFilter: backgroundFilterSchema,
  backgroundBrightness: backgroundBrightnessSchema,
  backgroundOpacity: backgroundOpacitySchema,
  // Gradient-kind background facets reuse the shared gradient value schemas.
  backgroundPreset: gradientPresetSchema,
  backgroundGradientType: gradientTypeSchema,
  backgroundAngle: gradientAngleSchema,
  backgroundStartColor: gradientStopColorSchema,
  backgroundStartBrightness: gradientStopBrightnessSchema,
  backgroundStartOpacity: gradientStopOpacitySchema,
  backgroundStartPosition: gradientStopPositionSchema,
  backgroundEndColor: gradientStopColorSchema,
  backgroundEndBrightness: gradientStopBrightnessSchema,
  backgroundEndOpacity: gradientStopOpacitySchema,
  backgroundEndPosition: gradientStopPositionSchema,
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
  borderRightPreset: borderPresetSchema,
  borderRightStyle: borderStyleSchema,
  borderRightColor: borderColorSchema,
  borderRightWidth: borderWidthSchema,
  borderRightBrightness: borderBrightnessSchema,
  borderRightOpacity: borderOpacitySchema,
  borderBottomPreset: borderPresetSchema,
  borderBottomStyle: borderStyleSchema,
  borderBottomColor: borderColorSchema,
  borderBottomWidth: borderWidthSchema,
  borderBottomBrightness: borderBrightnessSchema,
  borderBottomOpacity: borderOpacitySchema,
  borderLeftPreset: borderPresetSchema,
  borderLeftStyle: borderStyleSchema,
  borderLeftColor: borderColorSchema,
  borderLeftWidth: borderWidthSchema,
  borderLeftBrightness: borderBrightnessSchema,
  borderLeftOpacity: borderOpacitySchema,
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
  fontLetterSpacing: letterSpacingSchema,
  textAlign: textAlignSchema,
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
  shadowStyle: shadowStyleSchema,
  shadowOffsetX: shadowOffsetSchema,
  shadowOffsetY: shadowOffsetSchema,
  shadowBlur: shadowBlurSchema,
  shadowColor: shadowColorSchema,
  shadowBrightness: shadowBrightnessSchema,
  shadowOpacity: shadowOpacitySchema,
  shadowSpread: shadowSpreadSchema,
  scroll: scrollSchema,
  scrollbarStyle: scrollbarStyleSchema,

  // 6. ACCESSIBILITY (panel order: most used/required first)
  role: roleSchema,
  ariaLabel: ariaLabelSchema,
  ariaHidden: ariaHiddenSchema,
  ariaDisabled: ariaDisabledSchema,
  ariaExpanded: ariaExpandedSchema,
  ariaSelected: ariaSelectedSchema,
  ariaChecked: ariaCheckedSchema,
  ariaPressed: ariaPressedSchema,
  ariaCurrent: ariaCurrentSchema,
  ariaHasPopup: ariaHasPopupSchema,
  ariaInvalid: ariaInvalidSchema,
  ariaRequired: ariaRequiredSchema,
  ariaReadonly: ariaReadonlySchema,
  ariaLive: ariaLiveSchema,
} as const

export const PROPERTY_SCHEMAS =
  attachPropertyDisplayMetadata(PROPERTY_SCHEMAS_RAW)

/** The property schema catalog: same object as {@link PROPERTY_SCHEMAS}. */
export const PROPERTY_SCHEMA_CATALOG = PROPERTY_SCHEMAS

export type PropertyName = keyof typeof PROPERTY_SCHEMAS
