import { describe, expect, it } from "vitest"

import {
  buildExtractAddRequestStage,
  buildPickVariantStage,
} from "./add-insert"

describe("buildExtractAddRequestStage", () => {
  it("lists the catalog ids and constrains the component enum to them", () => {
    const catalogIds = ["button", "card", "hero"]
    const { prompt, schema } = buildExtractAddRequestStage({
      message: "add a card to the hero",
      catalogIds,
    })
    expect(prompt).toContain("button, card, hero")
    expect(prompt).toContain('"add a card to the hero"')
    expect(schema).toMatchObject({
      properties: { component: { enum: catalogIds } },
    })
  })
})

describe("buildPickVariantStage", () => {
  it("renders id and label per variant and constrains the enum to the ids", () => {
    const variants = [
      { id: "v1", label: "Primary" },
      { id: "v2", label: "Ghost" },
    ]
    const { prompt, schema } = buildPickVariantStage({
      message: "insert the ghost button",
      variants,
    })
    expect(prompt).toContain('- v1: "Primary"')
    expect(prompt).toContain('- v2: "Ghost"')
    expect(schema).toMatchObject({
      properties: { variantId: { enum: ["v1", "v2"] } },
    })
  })
})
