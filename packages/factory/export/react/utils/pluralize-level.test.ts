import { describe, expect, it } from "bun:test"
import { ComponentLevel } from "@seldon/core/components/constants"
import { pluralizeLevel } from "./pluralize-level"

describe("pluralizeLevel", () => {
  it.each([
    [ComponentLevel.ELEMENT, "elements"],
    [ComponentLevel.FRAME, "frames"],
    [ComponentLevel.MODULE, "modules"],
    [ComponentLevel.PART, "parts"],
    [ComponentLevel.PRIMITIVE, "primitives"],
    [ComponentLevel.SCREEN, "screens"],
  ])("converts %s to '%s'", (input, expected) => {
    expect(pluralizeLevel(input)).toBe(expected)
  })
})
