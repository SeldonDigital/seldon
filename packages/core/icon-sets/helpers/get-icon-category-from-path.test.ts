import { describe, expect, it } from "vitest"

import { getIconCategoryFromPath, parseCategoryPath } from "./get-icon-category-from-path"

import type { IconCategoryPath } from "../constants/categories"

describe("getIconCategoryFromPath", () => {
  it("extracts a known category path from a file path", () => {
    expect(getIconCategoryFromPath("material/business/commerce/IconMaterialAdd.tsx")).toBe(
      "business/commerce",
    )
  })

  it("normalizes a relative prefix", () => {
    expect(getIconCategoryFromPath("./content/files/Whatever")).toBe("content/files")
  })

  it("falls back to the default category for an unknown path", () => {
    expect(getIconCategoryFromPath("foo/bar/baz")).toBe("miscellaneous/miscellaneous")
  })
})

describe("parseCategoryPath", () => {
  it("splits a category path into category and subcategory", () => {
    expect(parseCategoryPath("business/commerce" as IconCategoryPath)).toEqual({
      category: "business",
      subcategory: "commerce",
    })
  })
})
