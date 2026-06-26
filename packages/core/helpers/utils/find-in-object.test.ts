import { describe, expect, it } from "vitest"

import { findInObject } from "./find-in-object"

describe("findInObject", () => {
  it("resolves a nested value by dot path", () => {
    expect(findInObject({ a: { b: { c: 5 } } }, "a.b.c")).toBe(5)
    expect(findInObject({ a: 1 }, "a")).toBe(1)
  })

  it("returns undefined for a missing branch", () => {
    expect(findInObject({ a: { b: {} } }, "a.x.y")).toBeUndefined()
  })

  it("returns undefined when a segment is null mid-path", () => {
    expect(findInObject({ a: null }, "a.b")).toBeUndefined()
  })
})
