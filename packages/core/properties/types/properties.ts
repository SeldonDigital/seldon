import { IconId } from "../../icons"
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
  WrapperElement,
  ImageFit,
  InputType,
  Resize,
  ScreenSize,
  Scroll,
  ScrollbarStyle,
  TextAlign,
  TextCasing,
  TextDecoration,
} from "../values"
import {
  AlignValue,
  BackgroundLayer,
  BooleanValue,
  BorderCollapseValue,
  CheckedValue,
  BorderCompound,
  BrightnessValue,
  ButtonSizeValue,
  ColorValue,
  ColumnCountValue,
  ContentValue,
  CornersValue,
  DimensionValue,
  DirectionValue,
  DisplayValue,
  EmptyValue,
  FontCompound,
  GapValue,
  GradientCompound,
  HtmlElementValue,
  WrapperElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LinesValue,
  MarginValue,
  OpacityValue,
  OrientationValue,
  PaddingValue,
  PlacementValue,
  PositionValue,
  RotationValue,
  ResizeValue,
  RowCountValue,
  BoardCompound,
  ScreenHeightValue,
  ScreenSizeValue,
  ScreenWidthValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowCompound,
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
 * Every catalog property key and the stored value shape for that key on a node.
 * Keys follow the same category sequence editors use when grouping fields.
 * The type is partial so each component only declares the keys it supports.
 */
export type Properties = Partial<{
  display: DisplayValue | EmptyValue
  htmlElement: Restricted<HtmlElementValue | EmptyValue, HtmlElement>
  wrapperElement: Restricted<WrapperElementValue | EmptyValue, WrapperElement>
  content: ContentValue | EmptyValue
  symbol: Restricted<SymbolValue | EmptyValue, IconId>
  source: Restricted<ImageSourceValue | EmptyValue, string>
  imageFit: Restricted<ImageFitValue | EmptyValue, ImageFit>
  altText: ContentValue | EmptyValue
  inputType: Restricted<InputTypeValue | EmptyValue, InputType>
  placeholder: ContentValue | EmptyValue
  checked: CheckedValue
  ariaLabel: ContentValue | EmptyValue
  ariaHidden: BooleanValue | EmptyValue
  size: Restricted<SizeValue | EmptyValue, ThemeSizeKey>
  buttonSize: Restricted<ButtonSizeValue | EmptyValue, ThemeFontSizeKey>
  board: BoardCompound
  screenWidth: ScreenWidthValue
  screenHeight: ScreenHeightValue
  cursor: Restricted<CursorValue | EmptyValue, Cursor>

  direction: DirectionValue | EmptyValue
  placement: PlacementValue
  position: PositionValue
  orientation: OrientationValue | EmptyValue
  align: Restricted<AlignValue | EmptyValue, Align>
  width: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  height: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  margin: MarginValue
  padding: PaddingValue
  gap: Restricted<GapValue | EmptyValue, ThemeGapKey>
  rotation: Restricted<RotationValue | EmptyValue, number>
  wrapChildren: BooleanValue | EmptyValue
  clip: BooleanValue | EmptyValue
  columns: Restricted<ColumnCountValue | EmptyValue, number>
  rows: Restricted<RowCountValue | EmptyValue, number>
  cellAlign: Restricted<AlignValue | InheritValue | EmptyValue, Align>
  dimension: Restricted<DimensionValue | EmptyValue, ThemeDimensionKey>
  resize: Restricted<ResizeValue | EmptyValue, Resize>
  screenSize: Restricted<ScreenSizeValue | EmptyValue, ScreenSize>

  color: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  accentColor: Restricted<ColorValue | EmptyValue, ThemeSwatchKey>
  brightness: Restricted<BrightnessValue | EmptyValue, number>
  opacity: Restricted<OpacityValue | EmptyValue, number>
  background: BackgroundLayer[]
  border: BorderCompound
  borderTop: BorderCompound
  borderRight: BorderCompound
  borderBottom: BorderCompound
  borderLeft: BorderCompound
  corners: CornersValue
  borderCollapse: Restricted<BorderCollapseValue | EmptyValue, BorderCollapse>

  font: FontCompound
  textAlign: Restricted<TextAlignValue | EmptyValue, TextAlign>
  letterSpacing: Restricted<LetterSpacingValue | EmptyValue, number>
  textCase: Restricted<TextCaseValue | EmptyValue, TextCasing>
  textDecoration: Restricted<TextDecorationValue | EmptyValue, TextDecoration>
  wrapText: BooleanValue | EmptyValue
  lines: Restricted<LinesValue | EmptyValue, number>

  gradient: GradientCompound[]
  shadow: ShadowCompound[]
  scroll: Restricted<ScrollValue | EmptyValue, Scroll>
  scrollbarStyle: Restricted<ScrollbarStyleValue | EmptyValue, ScrollbarStyle>
}>
