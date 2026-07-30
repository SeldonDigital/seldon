import { describe, expect, it } from "vitest"

import { buildTextDirectionStage, buildTranslateBatchStage } from "./translate"

describe("buildTranslateBatchStage", () => {
  it("numbers every text and locks the schema to the input length", () => {
    const texts = ["Hello", "Buy now", "Learn more"]
    const { prompt, schema } = buildTranslateBatchStage({
      texts,
      language: "Spanish",
    })
    expect(prompt).toContain("into Spanish")
    expect(prompt).toContain('1. "Hello"')
    expect(prompt).toContain('3. "Learn more"')
    expect(schema).toMatchObject({
      properties: { translations: { minItems: 3, maxItems: 3 } },
    })
  })
})

describe("buildTextDirectionStage", () => {
  it("asks about the language with an ltr/rtl enum", () => {
    const { prompt, schema } = buildTextDirectionStage({ language: "Arabic" })
    expect(prompt).toContain("Arabic")
    expect(schema).toMatchObject({
      properties: { direction: { enum: ["ltr", "rtl"] } },
    })
  })
})
