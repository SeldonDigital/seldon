import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../themes"
import { ComputedFunction } from "../constants"
import { backgroundKindSchema } from "./appearance/background/background-kind"
import { colorSchema } from "./appearance/color"
import { gradientPresetSchema } from "./effects/gradients/gradient"
import { boardPresetSchema } from "./layout/board/board-preset"
import { Resize } from "./layout/resize"
import { imageFitSchema } from "./shared/utilities/image-fit"

describe("colorSchema validation", () => {
  const v = colorSchema.validation

  it("validates exact literals and color objects", () => {
    expect(v.exact!("#ff0000")).toBe(true)
    expect(v.exact!({ red: 1, green: 2, blue: 3 })).toBe(true)
    expect(v.exact!({ foo: 1 })).toBe(false)
    expect(v.exact!(5)).toBe(false)
  })

  it("validates option, computed, and theme categorical values", () => {
    expect(v.option!("transparent")).toBe(true)
    expect(v.option!("nope")).toBe(false)
    expect(v.computed!(ComputedFunction.HIGH_CONTRAST_COLOR)).toBe(true)
    expect(v.computed!("not-a-fn")).toBe(false)
    expect(v.themeCategorical!("@swatch.primary", defaultTheme)).toBe(true)
    expect(v.themeCategorical!("@swatch.missing", defaultTheme)).toBe(false)
    expect(v.themeCategorical!("@swatch.primary", undefined)).toBe(false)
  })
})

describe("backgroundKindSchema validation", () => {
  it("accepts enum kinds and exposes preset options", () => {
    expect(backgroundKindSchema.validation.option!("color")).toBe(true)
    expect(backgroundKindSchema.validation.option!("bogus")).toBe(false)
    expect(backgroundKindSchema.presetOptions!()).toContain("color")
  })
})

describe("imageFitSchema validation", () => {
  const v = imageFitSchema.validation

  it("accepts enum keywords as options", () => {
    expect(v.option!("cover")).toBe(true)
    expect(v.option!("contain")).toBe(true)
    expect(v.option!("bogus")).toBe(false)
    expect(v.exact).toBeUndefined()
  })
})

describe("boardPresetSchema validation", () => {
  it("accepts device ids and the fit mode", () => {
    expect(boardPresetSchema.validation.option!("iphone")).toBe(true)
    expect(boardPresetSchema.validation.option!(Resize.FIT)).toBe(true)
    expect(boardPresetSchema.validation.option!("nope")).toBe(false)
  })
})

describe("gradientPresetSchema validation", () => {
  const v = gradientPresetSchema.validation

  it("validates gradient theme refs against the theme", () => {
    expect(v.themeCategorical!("@gradient.primary", defaultTheme)).toBe(true)
    expect(v.themeCategorical!("@gradient.missing", defaultTheme)).toBe(false)
    expect(v.themeCategorical!("@gradient.primary", undefined)).toBe(false)
  })
})
