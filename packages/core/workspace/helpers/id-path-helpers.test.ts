import { describe, expect, it } from "vitest"

import {
  deleteFontCollectionOverrideAtPath,
  fontCollectionBoardKeyFromEntryId,
  setFontCollectionOverrideAtPath,
} from "./font-collections/font-collection-id"
import {
  deleteIconSetOverrideAtPath,
  iconSetBoardKeyFromEntryId,
  setIconSetOverrideAtPath,
} from "./icon-sets/icon-set-id"

describe("entry id parsing", () => {
  it("derives the board key from a font collection entry id", () => {
    expect(
      fontCollectionBoardKeyFromEntryId("font-collection-system-default"),
    ).toBe("system")
    expect(fontCollectionBoardKeyFromEntryId("not-an-id")).toBeNull()
  })

  it("derives the board key from an icon set entry id", () => {
    expect(iconSetBoardKeyFromEntryId("icon-set-seldonIcons-default")).toBe(
      "seldonIcons",
    )
    expect(iconSetBoardKeyFromEntryId("nope")).toBeNull()
  })
})

describe("override path mutation", () => {
  it("writes and deletes a nested font collection path", () => {
    const target: Record<string, unknown> = {}
    setFontCollectionOverrideAtPath(target, "a.b.c", 7)
    expect((target as { a: { b: { c: unknown } } }).a.b.c).toBe(7)
    deleteFontCollectionOverrideAtPath(target, "a.b.c")
    expect((target as { a: { b: { c: unknown } } }).a.b.c).toBeUndefined()
  })

  it("writes and deletes a nested icon set path", () => {
    const target: Record<string, unknown> = {}
    setIconSetOverrideAtPath(target, "x.y", "v")
    expect((target as { x: { y: unknown } }).x.y).toBe("v")
    deleteIconSetOverrideAtPath(target, "x.y")
    expect((target as { x: { y: unknown } }).x.y).toBeUndefined()
  })

  it("ignores deletes through a non-object segment", () => {
    const target: Record<string, unknown> = { a: 1 }
    deleteFontCollectionOverrideAtPath(target, "a.b.c")
    expect(target.a).toBe(1)
  })
})
