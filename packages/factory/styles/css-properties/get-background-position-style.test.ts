import { describe, expect, it } from "bun:test"
import {
  BackgroundPosition,
  BackgroundPositionPresetValue,
  PercentageValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "@seldon/core"
import { getBackgroundPositionStyle } from "./get-background-position-style"

describe("getBackgroundPositionStyle", () => {
  it("should return CSS value for exact position with pixels", () => {
    const position: PixelValue = {
      type: ValueType.EXACT,
      value: { value: 10, unit: Unit.PX },
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("10px")
  })

  it("should return CSS value for exact position with percentage", () => {
    const position: PercentageValue = {
      type: ValueType.EXACT,
      value: { value: 50, unit: Unit.PERCENT },
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("50%")
  })

  it("should return CSS value for exact position with rem", () => {
    const position: RemValue = {
      type: ValueType.EXACT,
      value: { value: 1.5, unit: Unit.REM },
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("1.5rem")
  })

  it("should return CSS value for preset position - center", () => {
    const position: BackgroundPositionPresetValue = {
      type: ValueType.PRESET,
      value: BackgroundPosition.CENTER,
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("center")
  })

  it("should return CSS value for preset position - top left", () => {
    const position: BackgroundPositionPresetValue = {
      type: ValueType.PRESET,
      value: BackgroundPosition.TOP_LEFT,
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("top left")
  })

  it("should return CSS value for preset position - bottom right", () => {
    const position: BackgroundPositionPresetValue = {
      type: ValueType.PRESET,
      value: BackgroundPosition.BOTTOM_RIGHT,
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("right bottom")
  })

  it("should handle zero values", () => {
    const position: PixelValue = {
      type: ValueType.EXACT,
      value: { value: 0, unit: Unit.PX },
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("0px")
  })

  it("should handle decimal values", () => {
    const position: PixelValue = {
      type: ValueType.EXACT,
      value: { value: 12.5, unit: Unit.PX },
    }

    const result = getBackgroundPositionStyle(position)

    expect(result).toBe("12.5px")
  })

  it("should handle all preset positions", () => {
    const positions = [
      BackgroundPosition.DEFAULT,
      BackgroundPosition.TOP_LEFT,
      BackgroundPosition.TOP_CENTER,
      BackgroundPosition.TOP_RIGHT,
      BackgroundPosition.CENTER_LEFT,
      BackgroundPosition.CENTER,
      BackgroundPosition.CENTER_RIGHT,
      BackgroundPosition.BOTTOM_LEFT,
      BackgroundPosition.BOTTOM_CENTER,
      BackgroundPosition.BOTTOM_RIGHT,
    ]

    for (const positionValue of positions) {
      const position: BackgroundPositionPresetValue = {
        type: ValueType.PRESET,
        value: positionValue,
      }

      const result = getBackgroundPositionStyle(position)

      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
      expect((result as string).length).toBeGreaterThan(0)
    }
  })
})
