import { describe, expect, it } from "vitest"

import { STOCK_THEMES_BY_ID } from "../catalog"
import { TokenType } from "../values"
import { computeTheme } from "./compute-theme"

describe("computeTheme", () => {
  it("materializes a stock theme and resolves dynamic swatches", () => {
    const computed = computeTheme(STOCK_THEMES_BY_ID.seldon)

    expect(computed.id).toBe("seldon")
    expect(computed.swatch.primary.type).toBe(TokenType.SWATCH)
    expect(computed.swatch.primary.parameters).toBeDefined()
  })

  it("is idempotent when recomputing an already computed theme", () => {
    const once = computeTheme(STOCK_THEMES_BY_ID.seldon)
    const twice = computeTheme(once)

    expect(twice.id).toBe("seldon")
    expect(twice.swatch.primary.type).toBe(TokenType.SWATCH)
  })
})
