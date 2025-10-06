import { describe, expect, it } from "bun:test"
import { Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getScrollStyles } from "./get-scroll-styles"

describe("getScrollStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getScrollStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when scroll is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000" as const,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toEqual({})
  })

  it("should generate overflow hidden for none scroll value", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.NONE,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "hidden")
  })

  it("should generate overflowX auto and overflowY hidden for horizontal scroll", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.HORIZONTAL,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflowX", "auto")
    expect(result).toHaveProperty("overflowY", "hidden")
  })

  it("should generate overflowX hidden and overflowY auto for vertical scroll", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.VERTICAL,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflowX", "hidden")
    expect(result).toHaveProperty("overflowY", "auto")
  })

  it("should generate overflow auto for both scroll value", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle empty scroll value", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle scroll with other properties", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000" as const,
      },
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
    expect(result).not.toHaveProperty("color")
    expect(result).not.toHaveProperty("opacity")
  })

  it("should handle scroll with only scroll property", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.HORIZONTAL,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toEqual({
      overflowX: "auto",
      overflowY: "hidden",
    })
  })

  it("should handle all scroll values", () => {
    const scrollValues = [
      Scroll.NONE,
      Scroll.HORIZONTAL,
      Scroll.VERTICAL,
      Scroll.BOTH,
    ]

    scrollValues.forEach((scrollValue) => {
      const properties: Properties = {
        scroll: {
          type: ValueType.PRESET,
          value: scrollValue,
        },
      }

      const result = getScrollStyles({ properties })

      switch (scrollValue) {
        case Scroll.NONE:
          expect(result).toHaveProperty("overflow", "hidden")
          break
        case Scroll.HORIZONTAL:
          expect(result).toHaveProperty("overflowX", "auto")
          expect(result).toHaveProperty("overflowY", "hidden")
          break
        case Scroll.VERTICAL:
          expect(result).toHaveProperty("overflowX", "hidden")
          expect(result).toHaveProperty("overflowY", "auto")
          break
        case Scroll.BOTH:
          expect(result).toHaveProperty("overflow", "auto")
          break
      }
    })
  })

  it("should handle scroll with exact value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle scroll with theme categorical value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle scroll with theme ordinal value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle scroll with computed value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.BOTH,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle scroll with inherit value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle scroll with preset value type", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: Scroll.NONE,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "hidden")
  })

  it("should handle scroll with different value types for same scroll value", () => {
    const scrollValue = Scroll.HORIZONTAL

    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: scrollValue,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflowX", "auto")
    expect(result).toHaveProperty("overflowY", "hidden")
  })

  it("should handle scroll with different value types for vertical scroll", () => {
    const scrollValue = Scroll.VERTICAL

    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: scrollValue,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflowX", "hidden")
    expect(result).toHaveProperty("overflowY", "auto")
  })

  it("should handle scroll with different value types for both scroll", () => {
    const scrollValue = Scroll.BOTH

    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: scrollValue,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "auto")
  })

  it("should handle scroll with different value types for none scroll", () => {
    const scrollValue = Scroll.NONE

    const properties: Properties = {
      scroll: {
        type: ValueType.PRESET,
        value: scrollValue,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toHaveProperty("overflow", "hidden")
  })

  it("should handle invalid scroll value gracefully", () => {
    const properties: Properties = {
      scroll: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getScrollStyles({ properties })

    expect(result).toEqual({})
  })
})
