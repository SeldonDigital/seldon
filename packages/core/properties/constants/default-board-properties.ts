import {
  Direction,
  Orientation,
  Properties,
  Resize,
  ValueType,
} from "../../index"

/**
 * Default properties for component boards.
 */
export const DEFAULT_BOARD_PROPERTIES: Properties = {
  screenWidth: { type: ValueType.PRESET, value: Resize.FIT },
  screenHeight: { type: ValueType.PRESET, value: Resize.FIT },
  orientation: { type: ValueType.PRESET, value: Orientation.VERTICAL },
  align: { type: ValueType.EMPTY, value: null },
  gap: { type: ValueType.THEME_ORDINAL, value: "@gap.cozy" },
  padding: {
    top: { type: ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    right: { type: ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    bottom: { type: ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    left: { type: ValueType.THEME_ORDINAL, value: "@padding.cozy" },
  },
  background: {
    preset: { type: ValueType.EMPTY, value: null },
    image: { type: ValueType.EMPTY, value: null },
    size: { type: ValueType.EMPTY, value: null },
    position: { type: ValueType.EMPTY, value: null },
    repeat: { type: ValueType.EMPTY, value: null },
    color: {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 0, lightness: 100 },
    },
    brightness: { type: ValueType.EMPTY, value: null },
    opacity: { type: ValueType.EMPTY, value: null },
  },
  gradient: {
    preset: { type: ValueType.EMPTY, value: null },
    gradientType: { type: ValueType.EMPTY, value: null },
    angle: { type: ValueType.EMPTY, value: null },
    startColor: { type: ValueType.EMPTY, value: null },
    startBrightness: { type: ValueType.EMPTY, value: null },
    startOpacity: { type: ValueType.EMPTY, value: null },
    startPosition: { type: ValueType.EMPTY, value: null },
    endColor: { type: ValueType.EMPTY, value: null },
    endOpacity: { type: ValueType.EMPTY, value: null },
    endBrightness: { type: ValueType.EMPTY, value: null },
    endPosition: { type: ValueType.EMPTY, value: null },
  },
  direction: { type: ValueType.PRESET, value: Direction.LTR },
}
