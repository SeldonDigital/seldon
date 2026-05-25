/** Single-tag value shapes used on their own or as nested fields under compounds and shorthands. */
import {
  AlignValue,
  BackgroundColorValue,
  BackgroundImageValue,
  BackgroundOpacityValue,
  BackgroundPositionValue,
  BackgroundValue,
  BackgroundRepeatValue,
  BackgroundSizeValue,
  BooleanValue,
  BorderColorValue,
  BorderOpacityValue,
  BorderValue,
  BorderStyleValue,
  BorderWidthValue,
  BrightnessValue,
  ButtonSizeValue,
  ColorValue,
  ColumnCountValue,
  ContentValue,
  CornerValue,
  DimensionValue,
  DirectionValue,
  DisplayValue,
  EmptyValue,
  FontFamilyValue,
  FontValue,
  FontSizeValue,
  FontWeightValue,
  GapValue,
  GradientAngleValue,
  GradientValue,
  GradientStopColorValue,
  GradientStopOpacityValue,
  GradientStopPositionValue,
  GradientTypeValue,
  HtmlElementValue,
  WrapperElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LineHeightValue,
  LinesValue,
  MarginSideValue,
  OpacityValue,
  OrientationValue,
  PaddingSideValue,
  RotationValue,
  RowCountValue,
  ScreenHeightValue,
  ScreenWidthValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowBlurValue,
  ShadowValue,
  ShadowSpreadValue,
  SizeValue,
  SymbolValue,
  TextAlignValue,
  TextCaseValue,
  TextDecorationValue,
} from "../values"
import { CursorValue } from "../values/attributes/cursor"
import { PlacementValue } from "../values/layout/placement"
import { TransparentValue } from "../values/shared/option/transparent"
import { InheritValue } from "../values/shared/inherit/inherit"

/** Every atomic payload assignable to a property value on a node. */
export type AtomicValue =
  | DisplayValue
  | HtmlElementValue
  | WrapperElementValue
  | ContentValue
  | SymbolValue
  | ImageSourceValue
  | ImageFitValue
  | InputTypeValue
  | ButtonSizeValue
  | SizeValue
  | ScreenWidthValue
  | ScreenHeightValue
  | CursorValue

  | DirectionValue
  | PlacementValue
  | OrientationValue
  | AlignValue
  | DimensionValue
  | GapValue
  | RotationValue
  | ColumnCountValue
  | RowCountValue
  | MarginSideValue
  | PaddingSideValue

  | ColorValue
  | BrightnessValue
  | OpacityValue
  | BackgroundValue
  | BackgroundColorValue
  | BackgroundSizeValue
  | BackgroundImageValue
  | BackgroundOpacityValue
  | BackgroundPositionValue
  | BackgroundRepeatValue
  | BorderValue
  | BorderWidthValue
  | BorderStyleValue
  | BorderColorValue
  | BorderOpacityValue
  | CornerValue

  | FontFamilyValue
  | FontValue
  | FontSizeValue
  | FontWeightValue
  | LineHeightValue
  | TextAlignValue
  | LetterSpacingValue
  | TextCaseValue
  | TextDecorationValue
  | LinesValue

  | GradientAngleValue
  | GradientValue
  | GradientStopColorValue
  | GradientStopOpacityValue
  | GradientStopPositionValue
  | GradientTypeValue
  | ShadowBlurValue
  | ShadowValue
  | ShadowSpreadValue
  | ScrollValue
  | ScrollbarStyleValue

  | EmptyValue
  | InheritValue
  | TransparentValue
  | BooleanValue
