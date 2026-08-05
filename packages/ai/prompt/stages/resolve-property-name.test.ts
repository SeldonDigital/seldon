import { describe, expect, it } from "vitest"

import {
  buildResolvePropertyNamesStage,
  messageWords,
} from "./resolve-property-name"

describe("buildResolvePropertyNamesStage", () => {
  it("lists the keys in the prompt and constrains the pick enums to them", () => {
    const keys = ["color", "fontSize", "padding.top"]
    const { prompt, schema } = buildResolvePropertyNamesStage({
      message: "make it red",
      catalogId: "button",
      keys,
    })
    expect(prompt).toContain('"button"')
    expect(prompt).toContain('"make it red"')
    for (const key of keys) expect(prompt).toContain(`- ${key}`)
    expect(schema).toMatchObject({
      properties: {
        picks: {
          items: {
            properties: {
              key: { enum: keys },
              evidenceWord: { enum: ["make", "it", "red"] },
            },
          },
        },
      },
    })
  })
})

describe("messageWords", () => {
  it("lowercases, splits on non-alphanumerics, and dedupes", () => {
    expect(messageWords("Hide the top two chips, the TOP ones!")).toEqual([
      "hide",
      "the",
      "top",
      "two",
      "chips",
      "ones",
    ])
  })
})
