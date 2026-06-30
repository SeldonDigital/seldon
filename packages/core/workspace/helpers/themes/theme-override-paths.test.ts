import { describe, expect, it } from "vitest"

import {
  deleteOverrideAtPath,
  getOverrideAtPath,
  getThemeOverridePath,
} from "./theme-override-paths"

describe("getThemeOverridePath", () => {
  it("routes computed group sections to a parameters subtree", () => {
    expect(getThemeOverridePath("modulation.something")).toBe(
      "modulation.parameters.something",
    )
  })

  it("owns the whole cell for swatch rows", () => {
    expect(getThemeOverridePath("swatch.custom.custom1")).toBe("swatch.custom1")
    expect(getThemeOverridePath("swatch.interface.active")).toBe(
      "swatch.active",
    )
  })

  it("returns null for a swatch group parent row", () => {
    expect(getThemeOverridePath("swatch.harmony")).toBeNull()
  })

  it("targets the value cell for fontWeight rows", () => {
    expect(getThemeOverridePath("fontWeight.bold")).toBe(
      "fontWeight.bold.value",
    )
  })

  it("routes a modulated step row to parameters.step", () => {
    expect(getThemeOverridePath("size.medium.step")).toBe(
      "size.medium.parameters.step",
    )
  })

  it("routes a look facet row to its parameters facet", () => {
    expect(getThemeOverridePath("shadow.moderate.blur")).toBe(
      "shadow.moderate.parameters.blur",
    )
  })

  it("returns null for keys with no override path", () => {
    expect(getThemeOverridePath("bad")).toBeNull()
    expect(getThemeOverridePath("size.medium")).toBeNull()
  })
})

describe("getOverrideAtPath", () => {
  it("reads a nested value", () => {
    expect(getOverrideAtPath({ a: { b: { c: 1 } } }, "a.b.c")).toBe(1)
  })

  it("returns undefined for a missing path or an array segment", () => {
    expect(getOverrideAtPath({ a: {} }, "a.b.c")).toBeUndefined()
    expect(getOverrideAtPath({ a: [1] }, "a.0")).toBeUndefined()
  })
})

describe("deleteOverrideAtPath", () => {
  it("removes a leaf key", () => {
    const target = { a: { b: 1, c: 2 } }
    deleteOverrideAtPath(target, "a.b")
    expect(target).toEqual({ a: { c: 2 } })
  })

  it("no-ops on a missing path or an empty path", () => {
    const target = { a: {} }
    deleteOverrideAtPath(target, "a.x.y")
    deleteOverrideAtPath(target, "")
    expect(target).toEqual({ a: {} })
  })
})
