import { describe, expect, it } from "vitest"

import { buildResolvePropertyNamesStage } from "./resolve-property-name"

describe("buildResolvePropertyNamesStage", () => {
  it("lists the keys in the prompt and constrains the item enum to them", () => {
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
      properties: { keys: { items: { enum: keys } } },
    })
  })
})
