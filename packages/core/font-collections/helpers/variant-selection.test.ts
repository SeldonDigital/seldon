import { describe, expect, it } from "vitest"

import {
  deriveVariantPreset,
  getEnabledVariants,
  isVariantEnabled,
} from "./variant-selection"

describe("isVariantEnabled", () => {
  it("treats only an explicit true as enabled", () => {
    expect(isVariantEnabled({ "400": true }, "400")).toBe(true)
    expect(isVariantEnabled({ "400": false }, "400")).toBe(false)
    expect(isVariantEnabled(undefined, "400")).toBe(false)
  })
})

describe("getEnabledVariants", () => {
  it("returns the enabled subset in a stable order", () => {
    expect(
      getEnabledVariants({ "700italic": true, "100": true, "400": true }, [
        "700italic",
        "100",
        "400",
        "900",
      ]),
    ).toEqual(["100", "400", "700italic"])
  })
})

describe("deriveVariantPreset", () => {
  it("derives all, none, or custom", () => {
    expect(deriveVariantPreset(undefined, [])).toBe("all")
    expect(
      deriveVariantPreset({ "100": true, "400": true }, ["100", "400"]),
    ).toBe("all")
    expect(deriveVariantPreset({}, ["100", "400"])).toBe("none")
    expect(deriveVariantPreset({ "100": true }, ["100", "400"])).toBe("custom")
  })
})
