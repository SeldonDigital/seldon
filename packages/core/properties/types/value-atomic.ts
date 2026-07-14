/** Single-tag value shapes used on their own or as nested fields under compounds and shorthands. */
import {
  AlignValue,
  BackgroundColorValue,
  BackgroundImageValue,
  BackgroundKindValue,
  BackgroundOpacityValue,
  BackgroundPositionValue,
  BackgroundRepeatValue,
  BackgroundSizeValue,
  BooleanValue,
  BorderColorValue,
  BorderOpacityValue,
  BorderStyleValue,
  BorderValue,
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
  FontSizeValue,
  FontValue,
  FontWeightValue,
  GapValue,
  GradientAngleValue,
  GradientPositionValue,
  GradientRepeatValue,
  GradientShapeValue,
  GradientSizeValue,
  GradientStopColorValue,
  GradientStopOpacityValue,
  GradientStopPositionValue,
  GradientTypeValue,
  GradientValue,
  HtmlElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LineHeightValue,
  LinesValue,
  ListStylePositionValue,
  ListStyleTypeValue,
  MarginSideValue,
  OpacityValue,
  OrientationValue,
  PaddingSideValue,
  PreloadValue,
  RotationValue,
  RowCountValue,
  ScreenHeightValue,
  ScreenWidthValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowBlurValue,
  ShadowSpreadValue,
  ShadowValue,
  SizeValue,
  SymbolValue,
  TextAlignValue,
  TextCaseValue,
  TextDecorationValue,
  TrackKindValue,
  WrapperElementValue,
} from "../values"
import { CursorValue } from "../values/attributes/cursor"
import { PlacementValue } from "../values/layout/placement"
import { InheritValue } from "../values/shared/inherit/inherit"
import { TransparentValue } from "../values/shared/option/transparent"

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
  | ListStyleTypeValue
  | ListStylePositionValue
  | ColumnCountValue
  | RowCountValue
  | MarginSideValue
  | PaddingSideValue
  | ColorValue
  | BrightnessValue
  | OpacityValue
  | BackgroundKindValue
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
  | GradientPositionValue
  | GradientRepeatValue
  | GradientShapeValue
  | GradientSizeValue
  | GradientStopColorValue
  | GradientStopOpacityValue
  | GradientStopPositionValue
  | GradientTypeValue
  | ShadowBlurValue
  | ShadowValue
  | ShadowSpreadValue
  | ScrollValue
  | ScrollbarStyleValue
  | PreloadValue
  | TrackKindValue
  | EmptyValue
  | InheritValue
  | TransparentValue
  | BooleanValue
