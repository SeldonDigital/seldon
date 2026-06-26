import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { setFontCollectionFamilyPreset } from "./set-font-collection-family-preset"
import { setFontCollectionFamilyVariant } from "./set-font-collection-family-variant"

const baseWorkspace = createEmptyWorkspace()
const fontCollectionId = Object.keys(baseWorkspace["font-collections"])[0]!
const slot = "system"

describe("setFontCollectionFamilyPreset", () => {
  it("clears a populated slot with the none preset", () => {
    const enabled = setFontCollectionFamilyVariant(
      {
        fontCollectionId,
        slot,
        variant: "400",
        enabled: true,
      } as ExtractPayload<"set_font_collection_family_variant">,
      baseWorkspace,
    )
    const populated = enabled["font-collections"][fontCollectionId]!
      .overrides as Record<string, any>
    expect(populated.variantSelection[slot]["400"]).toBe(true)

    const cleared = setFontCollectionFamilyPreset(
      {
        fontCollectionId,
        slot,
        preset: "none",
      } as ExtractPayload<"set_font_collection_family_preset">,
      enabled,
    )
    const overrides = cleared["font-collections"][fontCollectionId]!
      .overrides as Record<string, any>
    expect(overrides.variantSelection).toBeUndefined()
  })

  it("is a no-op for an unknown font collection id", () => {
    const result = setFontCollectionFamilyPreset(
      {
        fontCollectionId: "ghost-collection",
        slot,
        preset: "all",
      } as ExtractPayload<"set_font_collection_family_preset">,
      baseWorkspace,
    )
    expect(result).toBe(baseWorkspace)
  })
})
