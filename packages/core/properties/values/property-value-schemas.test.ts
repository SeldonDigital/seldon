import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../themes"
import type { PropertySchema } from "../types/schema"
import { PROPERTY_SCHEMAS } from "../schemas/data/property-schemas"

/** A spread of inputs that drives the typeof/branch guards in every validator. */
const BATTERY: unknown[] = [
  "",
  "auto",
  "#ff0000",
  "transparent",
  "cover",
  0,
  1,
  -1,
  50,
  100,
  999,
  true,
  false,
  null,
  undefined,
  {},
  { value: 10, unit: "px" },
  { value: 50, unit: "%" },
  { value: 1, unit: "rem" },
  { red: 1, green: 2, blue: 3 },
  { hue: 10, saturation: 1, lightness: 1 },
  "@font.body",
  "primary",
  "compact",
  "medium",
]

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn()
  } catch {
    return undefined
  }
}

const entries = Object.entries(PROPERTY_SCHEMAS) as [string, PropertySchema][]

describe("PROPERTY_SCHEMAS catalog", () => {
  it("exposes a non-empty catalog", () => {
    expect(entries.length).toBeGreaterThan(50)
  })

  it.each(entries)("%s declares a usable schema", (_name, schema) => {
    expect(schema.name.length).toBeGreaterThan(0)
    expect(schema.supports.length).toBeGreaterThan(0)
    expect(schema.validation).toBeTruthy()
  })

  it.each(entries)("%s empty and inherit validators pass", (_name, schema) => {
    if (schema.supports.includes("empty")) {
      expect(schema.validation.empty?.()).toBe(true)
    }
    if (schema.supports.includes("inherit")) {
      expect(schema.validation.inherit?.()).toBe(true)
    }
  })

  it.each(entries)("%s value validators never throw and return booleans", (_name, schema) => {
    const v = schema.validation
    for (const input of BATTERY) {
      if (v.exact) expect(typeof v.exact(input)).toBe("boolean")
      if (v.option) expect(typeof v.option(input)).toBe("boolean")
      if (v.computed) expect(typeof v.computed(input)).toBe("boolean")
      if (v.themeCategorical) {
        expect(typeof v.themeCategorical(input, defaultTheme)).toBe("boolean")
        // The no-theme branch must resolve to false rather than throw.
        expect(v.themeCategorical(input, undefined)).toBe(false)
      }
      if (v.themeOrdinal) {
        expect(typeof v.themeOrdinal(input, defaultTheme)).toBe("boolean")
        expect(v.themeOrdinal(input, undefined)).toBe(false)
      }
    }
  })

  it.each(entries)("%s picker and key helpers return arrays", (_name, schema) => {
    if (schema.presetOptions) {
      const opts = safe(() => schema.presetOptions!())
      if (opts !== undefined) expect(Array.isArray(opts)).toBe(true)
    }
    if (schema.themeCategoricalKeys) {
      expect(Array.isArray(schema.themeCategoricalKeys(defaultTheme))).toBe(true)
    }
    if (schema.themeOrdinalKeys) {
      expect(Array.isArray(schema.themeOrdinalKeys(defaultTheme))).toBe(true)
    }
    if (schema.computedFunctions) {
      expect(Array.isArray(schema.computedFunctions())).toBe(true)
    }
  })

  it.each(entries)("%s string preset options validate as options", (_name, schema) => {
    if (!schema.presetOptions || !schema.validation.option) return
    const opts = safe(() => schema.presetOptions!())
    if (!Array.isArray(opts)) return
    for (const option of opts) {
      if (typeof option === "string" || typeof option === "number") {
        expect(schema.validation.option(option)).toBe(true)
      }
    }
  })

  it.each(entries)("%s computed functions validate as computed", (_name, schema) => {
    if (!schema.computedFunctions || !schema.validation.computed) return
    for (const fn of schema.computedFunctions()) {
      expect(schema.validation.computed(fn)).toBe(true)
    }
    expect(schema.validation.computed("__not-a-fn__")).toBe(false)
  })
})

describe("representative schema behaviors", () => {
  it("validates theme ordinal margin keys against the theme", () => {
    const schema = PROPERTY_SCHEMAS.margin
    const firstKey = Object.keys(defaultTheme.margin)[0]!
    expect(schema.validation.themeOrdinal!(firstKey, defaultTheme)).toBe(true)
    expect(schema.validation.themeOrdinal!("not-a-step", defaultTheme)).toBe(false)
    expect(schema.themeOrdinalKeys!(defaultTheme).every((k) => k.startsWith("@margin."))).toBe(true)
  })

  it("bounds opacity exact values to 0..100", () => {
    const v = PROPERTY_SCHEMAS.opacity.validation.exact!
    expect(v({ value: 0, unit: "%" })).toBe(true)
    expect(v({ value: 100, unit: "%" })).toBe(true)
    expect(v({ value: 101, unit: "%" })).toBe(false)
    expect(v(50)).toBe(true)
    expect(v(-1)).toBe(false)
  })

  it("validates color literals, swatches, and computed rules", () => {
    const v = PROPERTY_SCHEMAS.color.validation
    expect(v.exact!("#ff0000")).toBe(true)
    expect(v.exact!({ red: 1, green: 2, blue: 3 })).toBe(true)
    expect(v.exact!(5)).toBe(false)
    expect(v.themeCategorical!("primary", defaultTheme)).toBe(true)
    expect(v.themeCategorical!("missing", defaultTheme)).toBe(false)
  })
})
