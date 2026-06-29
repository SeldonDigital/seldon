import { describe, expect, it } from "vitest"

import { ComponentToExport } from "../../types"
import { getClassName, getVariantClassNames } from "./class-name"

describe("getClassName", () => {
  const map = { a: "sdn-button", b: null, c: undefined }

  it("returns the mapped class for a known id", () => {
    expect(getClassName("a", map)).toBe("sdn-button")
  })

  it("passes through a null mapping", () => {
    expect(getClassName("b", map)).toBeNull()
  })

  it("returns undefined for an unmapped id", () => {
    expect(getClassName("missing", map)).toBeUndefined()
  })
})

describe("getVariantClassNames", () => {
  it("returns the variant's own class", () => {
    const component = { variantId: "v1" } as unknown as ComponentToExport
    expect(getVariantClassNames(component, { v1: "sdn-button-iconic" })).toBe(
      "sdn-button-iconic",
    )
  })

  it("returns an empty string when the variant has no class", () => {
    const component = { variantId: "v1" } as unknown as ComponentToExport
    expect(getVariantClassNames(component, {})).toBe("")
  })
})
