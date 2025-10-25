import { IconId } from "../../components/icons"
import {
  ThemeDimensionKey,
  ThemeFontSizeKey,
  ThemeGapKey,
  ThemeSizeKey,
  ThemeSwatchKey,
} from "../../themes/types"
import {
  Align,
  BorderCollapse,
  Cursor,
  HtmlElement,
  ImageFit,
  InputType,
  Scroll,
  ScrollbarStyle,
  TextAlign,
  TextCasing,
  TextDecoration,
} from "../values"
import {
  AlignValue,
  BackgroundValue,
  BooleanValue,
  BorderCollapseValue,
  BorderValue,
  BrightnessValue,
  ButtonSizeValue,
  ColorValue,
  ColumnCountValue,
  ContentValue,
  CornersValue,
  DegreesValue,
  DimensionResizeValue,
  DimensionValue,
  DirectionValue,
  DisplayValue,
  EmptyValue,
  FontValue,
  GapValue,
  GradientValue,
  HtmlElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LineCountValue,
  LinesValue,
  MarginValue,
  NumberValue,
  OpacityValue,
  OrientationValue,
  PaddingValue,
  PercentageValue,
  PixelValue,
  PositionValue,
  RemValue,
  RotationValue,
  RowCountValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowValue,
  SizeValue,
  SymbolValue,
  TextAlignValue,
  TextCaseValue,
  TextDecorationValue,
} from "../values"
import { CursorValue } from "../values/attributes/cursor"
import { InheritValue } from "../values/shared/inherit/inherit"
import { Restricted } from "./helpers"

/**
 * PROPERTIES TYPE DEFINITIONS
 *
 * This file defines the main Properties interface that represents all possible
 * properties that can be set on components in the Seldon design system.
 *
 * PROPERTY TYPE CLASSIFICATION:
 *
 * 1. ATOMIC PROPERTIES: Single value, no sub-properties
 *    - Examples: display, rotation, opacity, color, fontSize
 *    - UI Pattern: Single control (menu, text input, number input, color picker)
 *    - Value Types: AtomicValue (from value-atomic.ts)
 *
 * 2. COMPOUND PROPERTIES: Sub-properties are different types
 *    - Examples: background (color + image + position), font (family + size + weight)
 *    - UI Pattern: Multiple different control types in a collapsible group
 *    - Value Types: CompoundValue (from value-compound.ts)
 *    - All compound properties include a "preset" sub-property for theme configurations
 *
 * 3. SHORTHAND PROPERTIES: All sub-properties are the same type
 *    - Examples: margin (all sides are MarginSideValue), padding, corners
 *    - UI Pattern: Grouped controls with the same input type
 *    - Value Types: ShorthandValue (from value-shorthand.ts)
 *    - Provide convenient ways to set multiple related values at once
 *
 * THEME INTEGRATION:
 * - Properties can reference theme tokens using the "@" prefix
 * - Theme values are resolved during the computation phase
 * - ThemeValue types (from value-theme.ts) are subsets of AtomicValue
 *
 * IMPORTANT: When adding new properties, make sure to not use a reserved word
 * as a property name.
 *
 * For example, "case" is a reserved word in JavaScript, so we cannot use it
 * as a property name. Instead, we use "textCase" instead.
 */

export type Properties = Partial<{
  // ========================================
  // 1. COMPONENT-SPECIFIC
  // ========================================
  content: ContentValue | EmptyValue
  altText: ContentValue | EmptyValue
  ariaLabel: ContentValue | EmptyValue
  ariaHidden: BooleanValue | EmptyValue
  placeholder: ContentValue | EmptyValue
  checked: BooleanValue | EmptyValue
  inputType: Restricted<InputTypeValue | EmptyValue, InputType>
  htmlElement: Restricted<HtmlElementValue | EmptyValue, HtmlElement>
  symbol: Restricted<SymbolValue | EmptyValue, IconId>
  source: Restricted<ImageSourceValue | EmptyValue, string>
  imageFit: Restricted<ImageFitValue | EmptyValue, ImageFit>
  display: DisplayValue | EmptyValue
  size: Restricted<SizeValue | EmptyValue, ThemeSizeKey>
  buttonSize: Restricted<ButtonSizeValue | EmptyValue, ThemeFontSizeKey>

  // ========================================
  // 2. LAYOUT
  // ========================================
  direction: DirectionValue | EmptyValue
  position: PositionValue
  orientation: OrientationValue | EmptyValue
  align: Restricted<AlignValue | EmptyValue, Align>
  cellAlign: Restricted<AlignValue | InheritValue | EmptyValue, Align>
  width: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  height: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  screenWidth: DimensionResizeValue | PixelValue | RemValue
  screenHeight: DimensionResizeValue | PixelValue | RemValue
  margin: MarginValue
  padding: PaddingValue
  gap: Restricted<GapValue | EmptyValue, ThemeGapKey>
  rotation: Restricted<RotationValue | EmptyValue, number>
  wrapChildren: BooleanValue | EmptyValue
  clip: BooleanValue | EmptyValue
  cursor: Restricted<CursorValue | EmptyValue, Cursor>
  columns: Restricted<ColumnCountValue | EmptyValue, number>
  rows: Restricted<RowCountValue | EmptyValue, number>

  // TODO: Missing Layout Properties
  // zIndex: ZIndexValue | EmptyValue
  // clipPath: ClipPathValue | EmptyValue
  // minWidth: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // maxWidth: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // minHeight: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // maxHeight: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // outline: OutlineValue
  // grid: GridValue
  // gridColumns: GridColumnsValue

  // ========================================
  // 3. APPEARANCE
  // ========================================
  color: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  accentColor: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  brightness: Restricted<BrightnessValue | EmptyValue, number>
  opacity: Restricted<OpacityValue | EmptyValue, number>
  background: BackgroundValue
  border: BorderValue
  borderCollapse: Restricted<BorderCollapseValue | EmptyValue, BorderCollapse>
  corners: CornersValue

  // TODO: Missing Appearance Properties
  // blendMode: Restricted<BlendModeValue | EmptyValue, BlendMode>
  // filter: FilterValue
  // backdropFilter: BackdropFilterValue

  // ========================================
  // 4. TYPOGRAPHY
  // ========================================
  font: FontValue
  textAlign: Restricted<TextAlignValue | EmptyValue, TextAlign>
  letterSpacing: Restricted<LetterSpacingValue | EmptyValue, number>
  textDecoration: Restricted<TextDecorationValue | EmptyValue, TextDecoration>
  wrapText: BooleanValue | EmptyValue
  lines: Restricted<LineCountValue | EmptyValue, number>

  // TODO: Missing Typography Properties
  // textIndent: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // wordSpacing: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // wordBreak: Restricted<WordBreakValue | EmptyValue, WordBreak>
  // lineBreak: Restricted<LineBreakValue | EmptyValue, LineBreak>
  // hyphens: Restricted<HyphensValue | EmptyValue, Hyphens>

  // ========================================
  // 5. GRADIENTS
  // ========================================
  gradient: GradientValue

  // TODO: Missing Gradient Properties
  // multipleGradients: MultipleGradientsValue
  // multipleStops: MultipleStopsValue

  // ========================================
  // 6. EFFECTS
  // ========================================
  shadow: ShadowValue
  scroll: Restricted<ScrollValue | EmptyValue, Scroll>
  scrollbarStyle: Restricted<ScrollbarStyleValue | EmptyValue, ScrollbarStyle>

  // TODO: Missing Effects Properties
  // multipleShadows: MultipleShadowsValue
  // scrollSnap: Restricted<ScrollSnapValue | EmptyValue, ScrollSnap>
  // scrollSnapAlign: Restricted<ScrollSnapAlignValue | EmptyValue, ScrollSnapAlign>
  // scrollSnapStop: Restricted<ScrollSnapStopValue | EmptyValue, ScrollSnapStop>
  // scrollPadding: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // scrollMargin: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>

  // ========================================
  // 7. TODO: BEHAVIOR (Future)
  // ========================================
  // Interactions
  // onClick: InteractionValue
  // onHover: InteractionValue
  // onFocus: InteractionValue
  // onActive: InteractionValue
  // onDisabled: InteractionValue

  // Pointer
  // userSelect: Restricted<UserSelectValue | EmptyValue, UserSelect>
  // pointerEvents: Restricted<PointerEventsValue | EmptyValue, PointerEvents>

  // ========================================
  // 8. TODO: MOTION (Future)
  // ========================================
  // Transition
  // transitionProperty: Restricted<TransitionPropertyValue | EmptyValue, TransitionProperty>
  // transitionDuration: Restricted<DurationValue | EmptyValue, Duration>
  // transitionTimingFunction: Restricted<TimingFunctionValue | EmptyValue, TimingFunction>
  // transitionDelay: Restricted<DurationValue | EmptyValue, Duration>

  // Animation
  // animationName: Restricted<AnimationNameValue | EmptyValue, AnimationName>
  // animationDuration: Restricted<DurationValue | EmptyValue, Duration>
  // animationTimingFunction: Restricted<TimingFunctionValue | EmptyValue, TimingFunction>
  // animationDelay: Restricted<DurationValue | EmptyValue, Duration>
  // animationIterationCount: Restricted<IterationCountValue | EmptyValue, IterationCount>
  // animationDirection: Restricted<AnimationDirectionValue | EmptyValue, AnimationDirection>
  // animationFillMode: Restricted<FillModeValue | EmptyValue, FillMode>
  // animationPlayState: Restricted<PlayStateValue | EmptyValue, PlayState>

  // Transform
  // transformTranslate: TransformTranslateValue
  // transformRotate: TransformRotateValue
  // transformScale: TransformScaleValue
  // transformSkew: TransformSkewValue
  // transformMatrix: TransformMatrixValue
  // transformOrigin: TransformOriginValue
  // transformStyle: Restricted<TransformStyleValue | EmptyValue, TransformStyle>

  // Perspective
  // perspective: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  // perspectiveOrigin: PerspectiveOriginValue
  // backfaceVisibility: Restricted<BackfaceVisibilityValue | EmptyValue, BackfaceVisibility>

  // ========================================
  // 9. TODO: DATA (Future)
  // ========================================
  // Data Source
  // dataSource: DataSourceValue
  // dataFormat: Restricted<DataFormatValue | EmptyValue, DataFormat>
  // dataBinding: DataBindingValue

  // Validation
  // dataValidationRequired: BooleanValue | EmptyValue
  // dataValidationPattern: Restricted<PatternValue | EmptyValue, Pattern>
  // dataValidationMin: Restricted<NumberValue | EmptyValue, number>
  // dataValidationMax: Restricted<NumberValue | EmptyValue, number>

  // Loading States
  // dataLoadingLoading: BooleanValue | EmptyValue
  // dataLoadingError: BooleanValue | EmptyValue
  // dataLoadingEmpty: BooleanValue | EmptyValue
}>

export type PropertyKey = keyof Properties

export type CompoundPropertyKey =
  | "background"
  | "border"
  | "font"
  | "gradient"
  | "position"
  | "shadow"

export type ShorthandPropertyKey = "margin" | "padding" | "corners"

export type CompoundSubPropertyKey =
  | keyof BackgroundValue
  | keyof BorderValue
  | keyof FontValue
  | keyof GradientValue
  | keyof PositionValue
  | keyof ShadowValue

export type ShorthandSubPropertyKey =
  | keyof MarginValue
  | keyof PaddingValue
  | keyof CornersValue

export type SubPropertyKey = CompoundSubPropertyKey | ShorthandSubPropertyKey

export type CompoundPropertyPath =
  | PropertyKey
  | `background.${keyof BackgroundValue}`
  | `border.${keyof BorderValue}`
  | `font.${keyof FontValue}`
  | `gradient.${keyof GradientValue}`
  | `position.${keyof PositionValue}`
  | `shadow.${keyof ShadowValue}`

export type ShorthandPropertyPath =
  | `margin.${keyof MarginValue}`
  | `padding.${keyof PaddingValue}`
  | `corners.${keyof CornersValue}`

export type PropertyPath = CompoundPropertyPath | ShorthandPropertyPath
