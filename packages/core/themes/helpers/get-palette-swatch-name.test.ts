import { describe, expect, it } from "bun:test"
import { stockThemes } from ".."
import { Harmony } from "../../index"
import { getPaletteSwatchName } from "./get-palette-swatch-name"

interface TestCase {
  harmony: Harmony
  step: number
  expected: Record<"swatch1" | "swatch2" | "swatch3" | "swatch4", string>
}

const testCases: TestCase[] = [
  {
    harmony: Harmony.Monochromatic,
    step: 1,
    expected: {
      swatch1: "Tint 1",
      swatch2: "Tint 2",
      swatch3: "Tint 3",
      swatch4: "Tint 4",
    },
  },
  {
    harmony: Harmony.Monochromatic,
    step: -1,
    expected: {
      swatch1: "Shade 1",
      swatch2: "Shade 2",
      swatch3: "Shade 3",
      swatch4: "Shade 4",
    },
  },
  {
    harmony: Harmony.Complementary,
    step: 1,
    expected: {
      swatch1: "Tint",
      swatch2: "Complement",
      swatch3: "Complement Tint",
      swatch4: "Complement Light",
    },
  },
  {
    harmony: Harmony.Complementary,
    step: -1,
    expected: {
      swatch1: "Shade",
      swatch2: "Complement",
      swatch3: "Complement Shade",
      swatch4: "Complement Dark",
    },
  },
  {
    harmony: Harmony.SplitComplementary,
    step: 1,
    expected: {
      swatch1: "Complement",
      swatch2: "Complement Tint",
      swatch3: "Complement",
      swatch4: "Complement Tint",
    },
  },
  {
    harmony: Harmony.SplitComplementary,
    step: -1,
    expected: {
      swatch1: "Complement",
      swatch2: "Complement Shade",
      swatch3: "Complement",
      swatch4: "Complement Shade",
    },
  },
  {
    harmony: Harmony.Triadic,
    step: 1,
    expected: {
      swatch1: "Complement",
      swatch2: "Complement Tint",
      swatch3: "Complement",
      swatch4: "Complement Tint",
    },
  },
  {
    harmony: Harmony.Triadic,
    step: -1,
    expected: {
      swatch1: "Complement",
      swatch2: "Complement Shade",
      swatch3: "Complement",
      swatch4: "Complement Shade",
    },
  },
  {
    harmony: Harmony.Analogous,
    step: 1,
    expected: {
      swatch1: "Complement 1",
      swatch2: "Complement 2",
      swatch3: "Complement 3",
      swatch4: "Complement 4",
    },
  },
  {
    harmony: Harmony.Square,
    step: 1,
    expected: {
      swatch1: "Tint",
      swatch2: "Direct Complement",
      swatch3: "Right Complement",
      swatch4: "Left Complement",
    },
  },
  {
    harmony: Harmony.Square,
    step: -1,
    expected: {
      swatch1: "Shade",
      swatch2: "Direct Complement",
      swatch3: "Right Complement",
      swatch4: "Left Complement",
    },
  },
]

describe("getSwatchName", () => {
  it("should return correct swatch names for all harmony types and steps", () => {
    testCases.forEach(({ harmony, step, expected }) => {
      const baseTheme = stockThemes.find((theme) => theme.id === "default")!
      const theme = {
        ...baseTheme,
        color: {
          ...baseTheme.color,
          step,
          harmony,
        },
      }

      Object.entries(expected).forEach(([swatchId, expectedName]) => {
        expect(
          getPaletteSwatchName(
            swatchId as "swatch1" | "swatch2" | "swatch3" | "swatch4",
            theme,
          ),
        ).toBe(expectedName)
      })
    })
  })
})
