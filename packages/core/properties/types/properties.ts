import { IconId } from "../../components/icons"
import {
  ThemeDimensionKey,
  ThemeFontSizeKey,
  ThemeGapKey,
  ThemeSizeKey,
  ThemeSwatchKey,
} from "../../themes/types"
import {
  Alignment,
  BorderCollapse,
  Cursor,
  HtmlElement,
  ImageFit,
  InputType,
  Scroll,
  TextAlignment,
  TextCasing,
  TextDecoration,
} from "../constants"
import { ScrollbarStyle } from "../constants/scrollbar-styles"
import {
  AlignValue,
  BackgroundValue,
  BooleanValue,
  BorderCollapseValue,
  BorderValue,
  ButtonSizeValue,
  ColorValue,
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
  HTMLElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LinesValue,
  MarginValue,
  NumberValue,
  OrientationValue,
  PaddingValue,
  PercentageValue,
  PixelValue,
  PositionValue,
  RemValue,
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
import { InheritValue } from "../values/shared/inherit"
import { Restricted } from "./helpers"

/**
 * IMPORTANT: When adding new properties, make sure to not use a reserved word
 * as a property name.
 *
 * For example, "case" is a reserved word in JavaScript, so we cannot use it
 * as a property name. Instead, we use "textCase" instead.
 */

export type Properties = Partial<{
  // Compound properties
  background: BackgroundValue
  border: BorderValue
  corners: CornersValue
  font: FontValue
  gradient: GradientValue
  margin: MarginValue
  padding: PaddingValue
  position: PositionValue
  shadow: ShadowValue

  // Primitive properties
  accentColor: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  align: Restricted<AlignValue | EmptyValue, Alignment>
  altText: ContentValue | EmptyValue
  ariaHidden: BooleanValue | EmptyValue
  ariaLabel: ContentValue | EmptyValue
  borderCollapse: Restricted<BorderCollapseValue | EmptyValue, BorderCollapse>
  buttonSize: Restricted<ButtonSizeValue | EmptyValue, ThemeFontSizeKey>
  checked: BooleanValue | EmptyValue
  cellAlign: Restricted<AlignValue | InheritValue | EmptyValue, Alignment>
  clip: BooleanValue | EmptyValue
  columns: NumberValue | EmptyValue
  color: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  cursor: Restricted<CursorValue | EmptyValue, Cursor>
  direction: DirectionValue | EmptyValue
  display: DisplayValue | EmptyValue
  gap: Restricted<GapValue | EmptyValue, ThemeGapKey>
  height: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  htmlElement: Restricted<HTMLElementValue | EmptyValue, HtmlElement>
  symbol: Restricted<SymbolValue | EmptyValue, IconId>
  imageFit: Restricted<ImageFitValue | EmptyValue, ImageFit>
  inputType: Restricted<InputTypeValue | EmptyValue, InputType>
  letterSpacing: Restricted<LetterSpacingValue | EmptyValue, number>
  lines: Restricted<LinesValue | EmptyValue, number>
  opacity: PercentageValue | EmptyValue
  orientation: OrientationValue | EmptyValue
  placeholder: ContentValue | EmptyValue
  rotation: DegreesValue | EmptyValue
  rows: NumberValue | EmptyValue
  screenHeight: DimensionResizeValue | PixelValue | RemValue
  screenWidth: DimensionResizeValue | PixelValue | RemValue
  scrollbarStyle: Restricted<ScrollbarStyleValue | EmptyValue, ScrollbarStyle>
  scroll: Restricted<ScrollValue | EmptyValue, Scroll>
  size: Restricted<SizeValue | EmptyValue, ThemeSizeKey>
  source: Restricted<ImageSourceValue | EmptyValue, string>
  content: ContentValue | EmptyValue
  textAlign: Restricted<TextAlignValue | EmptyValue, TextAlignment>
  textCase: Restricted<TextCaseValue | EmptyValue, TextCasing>
  textDecoration: Restricted<TextDecorationValue | EmptyValue, TextDecoration>
  brightness: PercentageValue | EmptyValue
  width: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  wrapChildren: BooleanValue | EmptyValue
  wrapText: BooleanValue | EmptyValue
}>

export type PropertyKey = keyof Properties

export type CompoundPropertyKey =
  | "background"
  | "border"
  | "corners"
  | "font"
  | "gradient"
  | "margin"
  | "padding"
  | "position"
  | "shadow"

export type SubPropertyKey =
  | keyof BackgroundValue
  | keyof BorderValue
  | keyof CornersValue
  | keyof FontValue
  | keyof GradientValue
  | keyof MarginValue
  | keyof PaddingValue
  | keyof ShadowValue
  | keyof PositionValue

export type PropertyPath =
  | PropertyKey
  | `background.${keyof BackgroundValue}`
  | `border.${keyof BorderValue}`
  | `corners.${keyof CornersValue}`
  | `font.${keyof FontValue}`
  | `gradient.${keyof GradientValue}`
  | `margin.${keyof MarginValue}`
  | `padding.${keyof PaddingValue}`
  | `shadow.${keyof ShadowValue}`
  | `position.${keyof PositionValue}`
