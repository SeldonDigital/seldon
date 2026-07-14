import { describe, expect, it } from "vitest"

import {
  deleteOverrideAtPath,
  getOverrideAtPath,
  setOverrideAtPath,
} from "./override-paths"

describe("getOverrideAtPath", () => {
  it("reads a nested value", () => {
    expect(getOverrideAtPath({ a: { b: { c: 1 } } }, "a.b.c")).toBe(1)
  })

  it("returns undefined for a missing path or an array segment", () => {
    expect(getOverrideAtPath({ a: {} }, "a.b.c")).toBeUndefined()
    expect(getOverrideAtPath({ a: [1] }, "a.0")).toBeUndefined()
  })
})

describe("setOverrideAtPath", () => {
  it("creates intermediate objects and writes the leaf", () => {
    const target: Record<string, unknown> = {}
    setOverrideAtPath(target, "a.b.c", 7)
    expect(target).toEqual({ a: { b: { c: 7 } } })
  })

  it("replaces non-object segments along the path", () => {
    const target: Record<string, unknown> = { a: 1 }
    setOverrideAtPath(target, "a.b", "v")
    expect(target).toEqual({ a: { b: "v" } })
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
