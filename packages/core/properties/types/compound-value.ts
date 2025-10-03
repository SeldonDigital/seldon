import {
  BackgroundValue,
  BorderValue,
  CornersValue,
  FontValue,
  GradientValue,
  MarginValue,
  PaddingValue,
  PositionValue,
  ShadowValue,
} from "../values"

export type CompoundValue =
  | BorderValue
  | MarginValue
  | PaddingValue
  | FontValue
  | ShadowValue
  | GradientValue
  | CornersValue
  | BackgroundValue
  | PositionValue
