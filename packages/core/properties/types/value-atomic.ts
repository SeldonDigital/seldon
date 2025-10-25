/**
 * Atomic value types - individual, non-compound property values.
 * Used as standalone properties or sub-properties within compound/shorthand values.
 */
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
  HtmlElementValue,
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LetterSpacingValue,
  LineCountValue,
  LineHeightValue,
  LinesValue,
  MarginSideValue,
  OpacityValue,
  OrientationValue,
  PaddingSideValue,
  RotationValue,
  RowCountValue,
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
import { TransparentValue } from "../values/shared/exact/transparent"
import { InheritValue } from "../values/shared/inherit/inherit"

/**
 * All individual value types - fundamental building blocks of properties.
 * Used as top-level properties or sub-properties within compound values.
 */
export type AtomicValue =
  // COMPONENT-SPECIFIC
  | ContentValue // Text content for labels, buttons, etc.
  | DisplayValue // CSS display property (block, flex, grid, etc.)
  | HtmlElementValue // HTML element type (div, section, article, etc.)
  | InputTypeValue // Input type (text, email, password, etc.)
  | SymbolValue // Icon symbol identifier
  | ImageFitValue // How images fit within their containers
  | ImageSourceValue // Image source URL or path
  | ButtonSizeValue // Button-specific sizing
  | SizeValue // General size values

  // LAYOUT
  | DirectionValue // Flex/grid direction (row, column, etc.)
  | OrientationValue // Orientation for responsive layouts
  | AlignValue // Alignment within containers
  | DimensionValue // Width, height, and other dimensions
  | GapValue // Space between elements
  | RotationValue // Rotation in degrees
  | CursorValue // Cursor type on hover
  | ColumnCountValue // Number of columns in grid
  | RowCountValue // Number of rows in grid
  | MarginSideValue // Individual margin sides (top, right, bottom, left)
  | PaddingSideValue // Individual padding sides (top, right, bottom, left)

  // APPEARANCE
  | ColorValue // Colors (hex, rgb, hsl, theme references)
  | BrightnessValue // Brightness adjustment
  | OpacityValue // Opacity/transparency
  | BackgroundPresetValue // Background presets
  | BackgroundColorValue // Background colors
  | BackgroundSizeValue // Background image sizing
  | BackgroundImageValue // Background images
  | BackgroundOpacityValue // Background opacity
  | BackgroundPositionValue // Background image position
  | BackgroundRepeatValue // Background image repeat
  | BorderPresetValue // Border presets
  | BorderWidthValue // Border width
  | BorderStyleValue // Border style (solid, dashed, etc.)
  | BorderColorValue // Border color
  | BorderOpacityValue // Border opacity
  | CornerValue // Border radius/corner values

  // TYPOGRAPHY
  | FontFamilyValue // Font family (Inter, Georgia, etc.)
  | FontPresetValue // Font presets
  | FontSizeValue // Font size
  | FontWeightValue // Font weight (normal, bold, etc.)
  | LineHeightValue // Line height
  | TextAlignValue // Text alignment (left, center, right, justify)
  | LetterSpacingValue // Letter spacing
  | TextCaseValue // Text case (uppercase, lowercase, etc.)
  | TextDecorationValue // Text decoration (underline, strikethrough, etc.)
  | LineCountValue // Number of lines
  | LinesValue // Line-related values

  // GRADIENTS
  | GradientAngleValue // Gradient angle
  | GradientPresetValue // Gradient presets
  | GradientStopColorValue // Gradient stop colors
  | GradientStopOpacityValue // Gradient stop opacity
  | GradientStopPositionValue // Gradient stop positions
  | GradientTypeValue // Gradient type (linear, radial, etc.)

  // EFFECTS
  | ShadowBlurValue // Shadow blur radius
  | ShadowPresetValue // Shadow presets
  | ShadowSpreadValue // Shadow spread
  | ScrollValue // Scroll behavior
  | ScrollbarStyleValue // Scrollbar styling

  // UTILITY
  | EmptyValue // Schema default - property exists but uses schema-defined default
  | InheritValue // Inherited value - takes value from parent element
  | TransparentValue // Transparent color value
  | BooleanValue // Boolean true/false values
