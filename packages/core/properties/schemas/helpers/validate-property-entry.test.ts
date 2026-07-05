import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../../themes"
import { ValueType } from "../../constants/shared/value-types"
import { collectPropertyValueErrors } from "./validate-property-entry"

const swatch = (value: string) => ({
  type: ValueType.THEME_CATEGORICAL,
  value,
})

describe("collectPropertyValueErrors", () => {
  it("returns no errors for a well-formed atomic theme ref", () => {
    expect(
      collectPropertyValueErrors("color", swatch("@swatch.primary"), defaultTheme),
    ).toEqual([])
  })

  it("rejects a bare (non-@) theme id on an atomic property", () => {
    const errors = collectPropertyValueErrors("color", swatch("primary"), defaultTheme)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("rejects a flat value on a layered paint property", () => {
    const errors = collectPropertyValueErrors(
      "background",
      swatch("@swatch.primary"),
      defaultTheme,
    )
    expect(errors[0]?.reason).toMatch(/array of layers/)
  })

  it("accepts a well-formed background layer array", () => {
    const errors = collectPropertyValueErrors(
      "background",
      [
        {
          kind: { type: ValueType.OPTION, value: "color" },
          color: swatch("@swatch.primary"),
        },
      ],
      defaultTheme,
    )
    expect(errors).toEqual([])
  })

  it("validates a dotted layered path against its flattened schema", () => {
    expect(
      collectPropertyValueErrors(
        "background.0.color",
        swatch("@swatch.primary"),
        defaultTheme,
      ),
    ).toEqual([])
    const errors = collectPropertyValueErrors("background.0.color", 42, defaultTheme)
    expect(errors.length).toBeGreaterThan(0)
  })

  it("treats EMPTY as valid on any property", () => {
    expect(
      collectPropertyValueErrors(
        "color",
        { type: ValueType.EMPTY, value: null },
        defaultTheme,
      ),
    ).toEqual([])
  })

  it("rejects a non-tagged value on an atomic property", () => {
    const errors = collectPropertyValueErrors("color", 42, defaultTheme)
    expect(errors[0]?.reason).toMatch(/tagged value/)
  })

  it("rejects an unknown property key", () => {
    const errors = collectPropertyValueErrors(
      "notAProperty",
      swatch("@swatch.primary"),
      defaultTheme,
    )
    expect(errors.length).toBeGreaterThan(0)
  })
})
