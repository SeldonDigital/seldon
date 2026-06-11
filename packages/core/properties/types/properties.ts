import {
  AlignValue,
  BackgroundLayer,
  BoardCompound,
  BooleanValue,
  BorderCollapseValue,
  BorderCompound,
  BrightnessValue,
  ButtonSizeValue,
  CheckedValue,
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
  ImageFitValue,
  ImageSourceValue,
  InputTypeValue,
  LinesValue,
  MarginValue,
  OpacityValue,
  OrientationValue,
  PaddingValue,
  PlacementValue,
  PositionValue,
  ResizeValue,
  RotationValue,
  RowCountValue,
  ScreenHeightValue,
  ScreenSizeValue,
  ScreenWidthValue,
  ScrollValue,
  ScrollbarStyleValue,
  ShadowCompound,
  SizeValue,
  SymbolValue,
  TextAlignValue,
  TextDecorationValue,
  WrapperElementValue,
} from "../values"
import { CursorValue } from "../values/attributes/cursor"
import { InheritValue } from "../values/shared/inherit/inherit"

/**
 * Every catalog property key and the stored value shape for that key on a node.
 * Keys follow the same category sequence editors use when grouping fields.
 * The type is partial so each component only declares the keys it supports.
 */
export type Properties = Partial<{
  display: DisplayValue | EmptyValue
  htmlElement: HtmlElementValue | EmptyValue
  wrapperElement: WrapperElementValue | EmptyValue
  content: ContentValue | EmptyValue
  symbol: SymbolValue | EmptyValue
  source: ImageSourceValue | EmptyValue
  imageFit: ImageFitValue | EmptyValue
  altText: ContentValue | EmptyValue
  inputType: InputTypeValue | EmptyValue
  placeholder: ContentValue | EmptyValue
  checked: CheckedValue
  ariaLabel: ContentValue | EmptyValue
  ariaHidden: BooleanValue | EmptyValue
  size: SizeValue | EmptyValue
  buttonSize: ButtonSizeValue | EmptyValue
  board: BoardCompound
  screenWidth: ScreenWidthValue
  screenHeight: ScreenHeightValue
  cursor: CursorValue | EmptyValue

  direction: DirectionValue | EmptyValue
  placement: PlacementValue
  position: PositionValue
  orientation: OrientationValue | EmptyValue
  align: AlignValue | EmptyValue
  width: DimensionValue | EmptyValue
  height: DimensionValue | EmptyValue
  margin: MarginValue
  padding: PaddingValue
  gap: GapValue | EmptyValue
  rotation: RotationValue | EmptyValue
  wrapChildren: BooleanValue | EmptyValue
  clip: BooleanValue | EmptyValue
  columns: ColumnCountValue | EmptyValue
  rows: RowCountValue | EmptyValue
  cellAlign: AlignValue | InheritValue | EmptyValue
  dimension: DimensionValue | EmptyValue
  resize: ResizeValue | EmptyValue
  screenSize: ScreenSizeValue | EmptyValue

  color: ColorValue | EmptyValue
  accentColor: ColorValue | EmptyValue
  brightness: BrightnessValue | EmptyValue
  opacity: OpacityValue | EmptyValue
  background: BackgroundLayer[]
  border: BorderCompound
  borderTop: BorderCompound
  borderRight: BorderCompound
  borderBottom: BorderCompound
  borderLeft: BorderCompound
  corners: CornersValue
  borderCollapse: BorderCollapseValue | EmptyValue

  font: FontCompound
  textAlign: TextAlignValue | EmptyValue
  textDecoration: TextDecorationValue | EmptyValue
  wrapText: BooleanValue | EmptyValue
  lines: LinesValue | EmptyValue

  gradient: GradientCompound[]
  shadow: ShadowCompound[]
  scroll: ScrollValue | EmptyValue
  scrollbarStyle: ScrollbarStyleValue | EmptyValue
}>
