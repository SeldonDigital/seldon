import { describe, expect, it } from "vitest"

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
  ])("pluralizes %s", (level, expected) => {
    expect(pluralizeLevel(level)).toBe(expected)
  })

  it("throws for an unknown level", () => {
    expect(() => pluralizeLevel("widget" as ComponentLevel)).toThrow(
      /Unknown level/,
    )
  })
})
