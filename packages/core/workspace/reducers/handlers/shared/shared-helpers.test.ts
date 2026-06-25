import { describe, expect, it } from "vitest"

import { TokenType } from "../../../../themes/constants/token-type"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import type { EntryTheme } from "../../../model/entry-theme"
import { buildScaleCell } from "./build-scale-cell"
import {
  appendCustomFamily,
  getNextCustomFamilyId,
  removeCustomFamily,
} from "./font-collection-custom-family"
import {
  readFamilyVariantSelection,
  setFamilyVariant,
  setFamilyVariantPreset,
} from "./font-collection-variant-selection"
import { formatLabelFromCatalogId } from "./format-label-from-catalog-id"
import { appendCustomToken, removeCustomToken } from "./theme-custom-token"

const fontEntry = (): EntryFontCollection =>
  ({ id: "fc", type: "variant", label: "fc", template: "theme:fc", overrides: {} }) as never

const themeEntry = (): EntryTheme =>
  ({ id: "t", type: "variant", label: "t", template: "theme:t", overrides: {} }) as never

describe("formatLabelFromCatalogId", () => {
  it("falls back when the id is empty", () => {
    expect(formatLabelFromCatalogId("", "Fallback")).toBe("Fallback")
  })

  it("capitalizes and replaces separators", () => {
    expect(formatLabelFromCatalogId("adobe-stock_media", "X")).toBe("Adobe stock media")
  })
})

describe("buildScaleCell", () => {
  it("builds a modulated cell", () => {
    const cell = buildScaleCell({ name: "n", kind: "modulated", parameters: {} as never })
    expect(cell.type).toBe(TokenType.MODULATED)
  })

  it("builds an exact cell", () => {
    const cell = buildScaleCell({ name: "n", kind: "exact", parameters: {} as never })
    expect(cell.type).toBe(TokenType.EXACT)
  })
})

describe("theme custom token bag", () => {
  it("appends then removes a token slot", () => {
    const entry = themeEntry()
    appendCustomToken(entry, "size", "custom1", { name: "s" })
    expect((entry.overrides as any).size.custom1).toEqual({ name: "s" })
    removeCustomToken(entry, "size", "custom1")
    expect((entry.overrides as any).size.custom1).toBeUndefined()
  })
})

describe("font collection custom family", () => {
  it("mints zero-padded ids and increments", () => {
    const entry = fontEntry()
    expect(getNextCustomFamilyId(entry)).toBe("family01")
    appendCustomFamily(entry, "family01", { name: "A" } as never)
    expect(getNextCustomFamilyId(entry)).toBe("family02")
  })

  it("rolls past single digits", () => {
    const entry = fontEntry()
    appendCustomFamily(entry, "family09", { name: "I" } as never)
    expect(getNextCustomFamilyId(entry)).toBe("family10")
  })

  it("removes a family slot", () => {
    const entry = fontEntry()
    appendCustomFamily(entry, "family01", { name: "A" } as never)
    removeCustomFamily(entry, "family01")
    expect((entry.overrides as any).families.family01).toBeUndefined()
  })
})

describe("font collection variant selection", () => {
  it("enables and disables a variant, dropping an empty slot", () => {
    const entry = fontEntry()
    setFamilyVariant(entry, "slot1", "regular", true)
    expect(readFamilyVariantSelection(entry, "slot1")).toEqual({ regular: true })

    setFamilyVariant(entry, "slot1", "regular", false)
    expect(readFamilyVariantSelection(entry, "slot1")).toEqual({})
    expect((entry.overrides as any).variantSelection?.slot1).toBeUndefined()
  })

  it("applies the all preset and clears with none", () => {
    const entry = fontEntry()
    setFamilyVariantPreset(entry, "slot1", "all", ["a", "b"])
    expect(readFamilyVariantSelection(entry, "slot1")).toEqual({ a: true, b: true })

    setFamilyVariantPreset(entry, "slot1", "none", [])
    expect(readFamilyVariantSelection(entry, "slot1")).toEqual({})
  })
})
