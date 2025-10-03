import { describe, expect, it } from "bun:test"
import defaultTheme from "../../themes/default"
import { Ratio } from "../../themes/types"
import { StaticTheme } from "../../themes/types"
import { modulate, modulateWithTheme } from "./modulate"

describe("modulate", () => {
  it("should return size when step is 0", () => {
    const result = modulate({ step: 0, size: 10 })
    expect(result).toBe(10)
  })

  it("should modulate with MajorThird ratio and positive step", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: 1, size: 1 })
    expect(result).toBeCloseTo(1.25, 3)
  })

  it("should modulate with MajorThird ratio and negative step", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: -1, size: 1 })
    expect(result).toBeCloseTo(0.8, 3)
  })

  it("should modulate with GoldenRatio ratio", () => {
    const result = modulate({ ratio: Ratio.GoldenRatio, step: 1, size: 1 })
    expect(result).toBeCloseTo(1.618, 3)
  })

  it("should modulate with PerfectFifth ratio", () => {
    const result = modulate({ ratio: Ratio.PerfectFifth, step: 1, size: 1 })
    expect(result).toBeCloseTo(1.5, 3)
  })

  it("should modulate with Octave ratio", () => {
    const result = modulate({ ratio: Ratio.Octave, step: 1, size: 1 })
    expect(result).toBeCloseTo(2, 3)
  })

  it("should modulate with custom size", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: 1, size: 2 })
    expect(result).toBeCloseTo(2.5, 3)
  })

  it("should modulate with multiple steps", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: 2, size: 1 })
    expect(result).toBeCloseTo(1.563, 3)
  })

  it("should modulate with large negative steps", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: -4, size: 1 })
    expect(result).toBeCloseTo(0.41, 3)
  })

  it("should return unrounded value when round option is false", () => {
    const result = modulate(
      { ratio: Ratio.MajorThird, step: 1, size: 1 },
      { round: false },
    )
    expect(result).toBe(1.25)
  })

  it("should use default ratio when not specified", () => {
    const result = modulate({ step: 1, size: 1 })
    expect(result).toBeCloseTo(1.25, 3)
  })

  it("should use default size when not specified", () => {
    const result = modulate({ ratio: Ratio.MajorThird, step: 1 })
    expect(result).toBeCloseTo(1.25, 3)
  })
})

describe("modulateWithTheme", () => {
  const mockTheme: StaticTheme = {
    ...defaultTheme,
    core: {
      ...defaultTheme.core,
      ratio: Ratio.GoldenRatio,
      size: 8,
    },
  }

  it("should modulate using theme defaults", () => {
    const result = modulateWithTheme({
      theme: mockTheme,
      parameters: { step: 1 },
    })

    expect(result).toBeCloseTo(12.944, 3)
  })

  it("should override theme ratio", () => {
    const result = modulateWithTheme({
      theme: mockTheme,
      parameters: { ratio: Ratio.MajorThird, step: 1 },
    })

    expect(result).toBeCloseTo(10, 3)
  })

  it("should override theme size", () => {
    const result = modulateWithTheme({
      theme: mockTheme,
      parameters: { size: 2, step: 1 },
    })

    expect(result).toBeCloseTo(3.236, 3)
  })

  it("should override both theme ratio and size", () => {
    const result = modulateWithTheme({
      theme: mockTheme,
      parameters: { ratio: Ratio.PerfectFifth, size: 4, step: 1 },
    })

    expect(result).toBeCloseTo(6, 3)
  })

  it("should handle negative steps with theme", () => {
    const result = modulateWithTheme({
      theme: mockTheme,
      parameters: { step: -1 },
    })

    expect(result).toBeCloseTo(4.944, 3)
  })
})
