import { describe, expect, it } from "vitest"

import { parseExactLength } from "./resolve-property-value"

const WIDTH_UNITS = ["px", "rem", "%"] as const

describe("parseExactLength", () => {
  it('parses "100 pixels" into the object the exact validator accepts', () => {
    expect(parseExactLength("100 pixels", WIDTH_UNITS, "px")).toEqual({
      value: 100,
      unit: "px",
    })
  })

  it("parses a suffixed form", () => {
    expect(parseExactLength("2rem", WIDTH_UNITS, "px")).toEqual({
      value: 2,
      unit: "rem",
    })
    expect(parseExactLength("50%", WIDTH_UNITS, "px")).toEqual({
      value: 50,
      unit: "%",
    })
  })

  it("falls to the schema default when no unit is spoken", () => {
    expect(parseExactLength("100", WIDTH_UNITS, "px")).toEqual({
      value: 100,
      unit: "px",
    })
    expect(parseExactLength(100, WIDTH_UNITS, "px")).toEqual({
      value: 100,
      unit: "px",
    })
  })

  it("passes through what it cannot parse, keeping the reducer as the gate", () => {
    expect(parseExactLength("auto", WIDTH_UNITS, "px")).toBeUndefined()
  })

  it("refuses a unit the property does not allow", () => {
    expect(parseExactLength("45 degrees", WIDTH_UNITS, "px")).toBeUndefined()
  })
})
