import { describe, expect, it } from "vitest"

import { buildMatchCssColorStage } from "./match-css-color"

function branches(schema: Record<string, unknown>) {
  return schema.oneOf as Array<{
    properties: { pick: { const: string }; value?: Record<string, unknown> }
  }>
}

describe("buildMatchCssColorStage", () => {
  it("constrains the css branch to the given names and keeps a none escape", () => {
    const { prompt, schema } = buildMatchCssColorStage({
      colorPhrase: "terracotta",
      cssColorNames: ["indianred", "tomato", "salmon"],
    })
    const oneOf = branches(schema)
    expect(oneOf.map((branch) => branch.properties.pick.const)).toEqual([
      "css",
      "none",
    ])
    expect(oneOf[0]!.properties.value!.enum).toEqual([
      "indianred",
      "tomato",
      "salmon",
    ])
    expect(oneOf[1]!.properties.value).toBeUndefined()
    expect(prompt).toContain('"terracotta"')
  })
})
