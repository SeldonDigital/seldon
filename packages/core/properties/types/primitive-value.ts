import {
  AlignValue,
  BackgroundColorValue,
  BackgroundImageValue,
  BackgroundOpacityValue,
  BackgroundPositionValue,
  BackgroundPresetValue,
  BackgroundRepeatValue,
  BackgroundSizeValue,
  BooleanValue,
  BorderColorValue,
  BorderOpacityValue,
  BorderPresetValue,
  BorderStyleValue,
  BorderWidthValue,
  ButtonSizeValue,
  ColorValue,
  ContentValue,
  CornerValue,
  DimensionValue,
  DirectionValue,
  DisplayValue,
  EmptyValue,
  FontFamilyValue,
  FontPresetValue,
  FontSizeValue,
  FontWeightValue,
  GapValue,
  GradientAngleValue,
  GradientPresetValue,
  GradientStopColorValue,
  GradientStopOpacityValue,
  GradientStopPositionValue,
  GradientTypeValue,
  HTMLElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LineHeightValue,
  LinesValue,
  MarginSideValue,
  OrientationValue,
  PaddingSideValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowBlurValue,
  ShadowPresetValue,
  ShadowSpreadValue,
  SizeValue,
  SymbolValue,
  TextAlignValue,
  TextCaseValue,
  TextDecorationValue,
} from "../values"
import { CursorValue } from "../values/attributes/cursor"
import { TransparentValue } from "../values/color/transparent"
import { InheritValue } from "../values/shared/inherit"

export type PrimitiveValue =
  | AlignValue
  | BackgroundPresetValue
  | BackgroundColorValue
  | BackgroundSizeValue
  | BackgroundImageValue
  | BackgroundOpacityValue
  | BackgroundPositionValue
  | BackgroundRepeatValue
  | BooleanValue
  | BorderPresetValue
  | BorderWidthValue
  | BorderStyleValue
  | BorderColorValue
  | BorderOpacityValue
  | ButtonSizeValue
  | TextCaseValue
  | ColorValue
  | CornerValue
  | CursorValue
  | DimensionValue
  | DirectionValue
  | DisplayValue
  | EmptyValue
  | FontFamilyValue
  | FontPresetValue
  | FontSizeValue
  | FontWeightValue
  | GapValue
  | GradientAngleValue
  | GradientPresetValue
  | GradientStopColorValue
  | GradientStopColorValue
  | GradientStopOpacityValue
  | GradientStopPositionValue
  | GradientTypeValue
  | HTMLElementValue
  | SymbolValue
  | ImageFitValue
  | ImageSourceValue
  | InheritValue
  | InputTypeValue
  | LetterSpacingValue
  | LineHeightValue
  | LinesValue
  | MarginSideValue
  | OrientationValue
  | PaddingSideValue
  | ScrollbarStyleValue
  | ScrollValue
  | ShadowBlurValue
  | ShadowPresetValue
  | ShadowSpreadValue
  | SizeValue
  | SizeValue
  | TextAlignValue
  | TextDecorationValue
  | ContentValue
  | TransparentValue
