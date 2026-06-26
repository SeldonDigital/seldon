import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { setFontCollectionFamilyVariant } from "./set-font-collection-family-variant"

const baseWorkspace = createEmptyWorkspace()
const fontCollectionId = Object.keys(baseWorkspace["font-collections"])[0]!

const setVariant = (enabled: boolean, ws = baseWorkspace) =>
  setFontCollectionFamilyVariant(
    {
      fontCollectionId,
      slot: "primary",
      variant: "400",
      enabled,
    } as ExtractPayload<"set_font_collection_family_variant">,
    ws,
  )

describe("setFontCollectionFamilyVariant", () => {
  it("enables a variant under its family slot", () => {
    const next = setVariant(true)
    const overrides = next["font-collections"][fontCollectionId]!
      .overrides as Record<string, Record<string, Record<string, unknown>>>
    expect(overrides.variantSelection.primary["400"]).toBe(true)
  })

  it("drops the slot when its last variant is disabled", () => {
    const enabled = setVariant(true)
    const disabled = setVariant(false, enabled)
    const overrides = disabled["font-collections"][fontCollectionId]!
      .overrides as Record<string, Record<string, Record<string, unknown>>>
    expect(overrides.variantSelection).toBeUndefined()
  })

  it("is a no-op for an unknown font collection id", () => {
    const result = setFontCollectionFamilyVariant(
      {
        fontCollectionId: "ghost-collection",
        slot: "primary",
        variant: "400",
        enabled: true,
      } as ExtractPayload<"set_font_collection_family_variant">,
      baseWorkspace,
    )
    expect(result).toBe(baseWorkspace)
  })
})
