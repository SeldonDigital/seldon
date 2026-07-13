import { describe, expect, it } from "vitest"

import { Colorspace } from "../constants/colorspace"
import { TokenType } from "../constants/token-type"
import { defaultTheme } from "../index"
import type { ThemePipelineInput } from "../types"
import { buildEmptyCustomTokenPayload } from "./build-empty-custom-token-payload"
import { modulate, modulateWithTheme } from "./modulate"
import { normalizeTheme } from "./normalize-theme"
import {
  getReservedTokenKeys,
  isReservedTokenName,
} from "./reserved-token-names"

describe("modulateWithTheme", () => {
  const theme = {
    modulation: { parameters: { ratio: 2, baseSize: 16 } },
  } as unknown as ThemePipelineInput

  it("returns the base size at step 0", () => {
    expect(modulateWithTheme({ theme, parameters: { step: 0 } })).toBe(16)
  })

  it("scales by the theme ratio for non-zero steps", () => {
    expect(modulateWithTheme({ theme, parameters: { step: 1 } })).toBe(
      modulate({ ratio: 2, size: 16, step: 1 }),
    )
  })
})

describe("getReservedTokenKeys", () => {
  it("returns reserved keys per section and empty for unknown", () => {
    expect(getReservedTokenKeys("swatch")).toContain("primary")
    expect(getReservedTokenKeys("border")).toContain("hairline")
    expect(getReservedTokenKeys("fontSize").length).toBeGreaterThan(0)
    expect(getReservedTokenKeys("nonsense")).toEqual([])
  })
})

describe("isReservedTokenName", () => {
  it("matches reserved ids and humanized labels case-insensitively", () => {
    expect(isReservedTokenName("border", "none")).toBe(true)
    expect(isReservedTokenName("border", "None")).toBe(true)
    expect(isReservedTokenName("swatch", "primary")).toBe(true)
    expect(isReservedTokenName("border", "myCustom")).toBe(false)
    expect(isReservedTokenName("border", "  ")).toBe(false)
  })
})

describe("buildEmptyCustomTokenPayload", () => {
  it("builds section-specific default payloads", () => {
    expect(buildEmptyCustomTokenPayload("swatch")).toMatchObject({
      parameters: { colorspace: Colorspace.HSL },
    })
    expect(buildEmptyCustomTokenPayload("fontWeight")).toMatchObject({
      parameters: { value: 400 },
    })
    expect(buildEmptyCustomTokenPayload("size")).toMatchObject({
      kind: "modulated",
      parameters: { step: 0 },
    })
    expect(buildEmptyCustomTokenPayload("font").parameters).toBeTypeOf("object")
    expect(buildEmptyCustomTokenPayload("iconSet")).toEqual({
      name: "New Token",
      intent: "Custom token",
    })
  })
})

describe("normalizeTheme", () => {
  it("resets palette slots to dynamic swatches for a computed theme", () => {
    const stock = normalizeTheme(defaultTheme)
    expect(stock.swatch.white.type).toBe(TokenType.DYNAMIC_SWATCH)
    expect(stock.swatch.primary.type).toBe(TokenType.DYNAMIC_SWATCH)
  })
})
