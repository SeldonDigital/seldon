import { describe, expect, it } from "bun:test"
import { getHumanReadablePropName } from "./get-human-readable-prop-name"

describe("getHumanReadablePropName", () => {
  it.each([
    ["simple.path", "simplePathProps"],
    ["nested.deep.path", "nestedDeepPathProps"],
    ["camelCase", "camelCaseProps"],
    ["UPPER_CASE", "upperCaseProps"],
    ["mixed-case-123", "mixedCase_123Props"],
  ])("converts '%s' to '%s' with default options", (input, expected) => {
    expect(getHumanReadablePropName(input)).toBe(expected)
  })

  it.each([
    ["simple.path", "pathProps"],
    ["nested.deep.path", "pathProps"],
    ["root.child", "childProps"],
  ])("converts '%s' to '%s' with isRelativeToRoot=true", (input, expected) => {
    expect(getHumanReadablePropName(input, { isRelativeToRoot: true })).toBe(
      expected,
    )
  })
})
