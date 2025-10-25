import { describe, expect, test } from "bun:test"
import { calculateIndicatorPosition } from "./calculate-indicator-position"

describe("getDragIndicatorLeft", () => {
  test.each([
    [0, "before", { left: 12, right: 0, height: 1, top: -0.5 }],
    [1, "before", { left: 28, right: 0, height: 1, top: -0.5 }],
    [2, "before", { left: 44, right: 0, height: 1, top: -0.5 }],
    [3, "before", { left: 60, right: 0, height: 1, top: -0.5 }],
    [4, "before", { left: 76, right: 0, height: 1, top: -0.5 }],
    [0, "after", { left: 12, right: 0, height: 1, bottom: -0.5 }],
    [1, "after", { left: 28, right: 0, height: 1, bottom: -0.5 }],
    [2, "after", { left: 44, right: 0, height: 1, bottom: -0.5 }],
    [3, "after", { left: 60, right: 0, height: 1, bottom: -0.5 }],
    [4, "after", { left: 76, right: 0, height: 1, bottom: -0.5 }],
  ] as const)(
    "should calculate the left position correctly for depth %i",
    (depth, placement, expected) => {
      expect(calculateIndicatorPosition(placement, depth)).toEqual(expected)
    },
  )
})
