import { describe, expect, it } from "bun:test"
import { getIconComponentName } from "./get-icon-component-name"

describe("getIconComponentName", () => {
  it.each([
    ["__default__", "IconDefault"],
    ["material-add", "IconMaterialAdd"],
    ["hero-outline-home", "IconHeroOutlineHome"],
    ["simple-icon", "IconSimpleIcon"],
    ["camelCase", "IconCamelCase"],
    ["UPPER_CASE", "IconUpperCase"],
    ["mixed-case-123", "IconMixedCase_123"],
  ])("converts '%s' to '%s'", (input, expected) => {
    expect(getIconComponentName(input)).toBe(expected)
  })
})
