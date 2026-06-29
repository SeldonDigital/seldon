import {
  BorderWidth,
  Color,
  Corner,
  Margin,
  Padding,
  Unit,
  ValueType,
} from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getCssValue } from "./get-css-value"

describe("getCssValue", () => {
  describe("EXACT values", () => {
    it("returns a plain number untouched", () => {
      expect(getCssValue({ type: ValueType.EXACT, value: 5 })).toBe(5)
    })

    it("appends px for pixel units", () => {
      expect(
        getCssValue({
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        }),
      ).toBe("10px")
    })

    it("appends rem for rem units", () => {
      expect(
        getCssValue({
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.5 },
        }),
      ).toBe("1.5rem")
    })

    it("appends % for percent units", () => {
      expect(
        getCssValue({
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 50 },
        }),
      ).toBe("50%")
    })

    it("wraps degrees in a rotate() function", () => {
      expect(
        getCssValue({
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: 45 },
        }),
      ).toBe("rotate(45deg)")
    })

    it("returns the raw number for unitless number values", () => {
      expect(
        getCssValue({
          type: ValueType.EXACT,
          value: { unit: Unit.NUMBER, value: 2 },
        }),
      ).toBe(2)
    })
  })

  describe("OPTION values", () => {
    it("maps hairline to the hairline variable", () => {
      expect(
        getCssValue({ type: ValueType.OPTION, value: BorderWidth.HAIRLINE }),
      ).toBe("var(--hairline)")
    })

    it("maps rounded corners to a large radius", () => {
      expect(
        getCssValue({ type: ValueType.OPTION, value: Corner.ROUNDED }),
      ).toBe("99999px")
    })

    it("maps squared corners to zero", () => {
      expect(
        getCssValue({ type: ValueType.OPTION, value: Corner.SQUARED }),
      ).toBe("0px")
    })

    it("maps margin none to unitless zero", () => {
      expect(getCssValue({ type: ValueType.OPTION, value: Margin.NONE })).toBe(
        "0",
      )
    })

    it("maps padding none to unitless zero", () => {
      expect(getCssValue({ type: ValueType.OPTION, value: Padding.NONE })).toBe(
        "0",
      )
    })

    it("maps transparent color to the transparent keyword", () => {
      expect(
        getCssValue({ type: ValueType.OPTION, value: Color.TRANSPARENT }),
      ).toBe("transparent")
    })
  })

  describe("EMPTY values", () => {
    it("returns an empty string", () => {
      expect(getCssValue({ type: ValueType.EMPTY, value: null })).toBe("")
    })
  })

  describe("invalid input", () => {
    it("throws for unresolved theme ordinal values", () => {
      expect(() =>
        getCssValue({
          type: ValueType.THEME_ORDINAL,
          value: "@margin.compact",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      ).toThrow(/must be resolved first/)
    })

    it("throws for an unsupported value type", () => {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getCssValue({ type: ValueType.INHERIT, value: null } as any),
      ).toThrow(/Invalid value type/)
    })
  })
})
