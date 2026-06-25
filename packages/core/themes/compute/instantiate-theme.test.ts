import { describe, expect, it } from "vitest"

import { STOCK_THEMES_BY_ID } from "../catalog"
import { computeTheme } from "../helpers/compute-theme"
import { instantiateTheme } from "./instantiate-theme"

describe("instantiateTheme", () => {
  it("computes the base theme when overrides are empty", () => {
    expect(instantiateTheme("seldon", undefined, STOCK_THEMES_BY_ID)).toEqual(
      computeTheme(STOCK_THEMES_BY_ID.seldon),
    )
  })

  it("merges overrides before computing", () => {
    const result = instantiateTheme(
      "seldon",
      { metadata: { name: "Custom Name" } },
      STOCK_THEMES_BY_ID,
    )

    expect(result.id).toBe("seldon")
    expect(result.metadata.name).toBe("Custom Name")
  })

  it("throws for an unknown template id", () => {
    expect(() =>
      instantiateTheme(
        "does-not-exist" as never,
        undefined,
        STOCK_THEMES_BY_ID,
      ),
    ).toThrow()
  })
})
