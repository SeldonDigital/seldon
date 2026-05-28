/** Objects that hold the same kind of value on each side, edge offset, or corner. */
import {
  CornersValue,
  MarginValue,
  PaddingValue,
  PositionValue,
} from "../values"

/** Every shorthand payload assignable to a property value on a node. */
export type ShorthandValue =
  | MarginValue
  | PaddingValue
  | PositionValue
  | CornersValue
