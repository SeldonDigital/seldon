import { describe, expect, it } from "vitest"

import { buildResolvePropertyValueStage } from "./resolve-property-value"

function branches(schema: Record<string, unknown>) {
  return schema.oneOf as Array<{
    properties: { pick: { const: string }; value: Record<string, unknown> }
  }>
}

describe("buildResolvePropertyValueStage", () => {
  it("offers option, theme, and exact branches in lockstep with the guidance", () => {
    const { prompt, schema } = buildResolvePropertyValueStage({
      propertyKey: "background.color",
      message: "make it the primary color",
      options: ["red", "blue"],
      themeTokens: ["swatch.primary", "swatch.secondary"],
      units: [],
    })
    const oneOf = branches(schema)
    expect(oneOf.map((branch) => branch.properties.pick.const)).toEqual([
      "option",
      "theme",
      "exact",
    ])
    // A branch exists iff its guidance line does.
    const guidanceLines = prompt
      .split("\n")
      .filter((line) => line.startsWith("- "))
    expect(guidanceLines).toHaveLength(oneOf.length)
    expect(oneOf[0]!.properties.value.enum).toEqual(["red", "blue"])
    expect(oneOf[1]!.properties.value.enum).toEqual([
      "swatch.primary",
      "swatch.secondary",
    ])
    expect(prompt).toContain("preset options: red, blue")
    expect(prompt).toContain("theme tokens: swatch.primary, swatch.secondary")
    expect(prompt).toContain('"background.color"')
    expect(prompt).toContain('"make it the primary color"')
  })

  it("drops the option branch when there are no presets", () => {
    const { prompt, schema } = buildResolvePropertyValueStage({
      propertyKey: "gap",
      message: "tighter",
      options: [],
      themeTokens: ["gap.compact"],
      units: [],
    })
    expect(
      branches(schema).map((branch) => branch.properties.pick.const),
    ).toEqual(["theme", "exact"])
    expect(prompt).not.toContain("preset options")
  })

  it("drops the theme branch when there are no tokens", () => {
    const { prompt, schema } = buildResolvePropertyValueStage({
      propertyKey: "content",
      message: "say hello",
      options: ["a", "b"],
      themeTokens: [],
      units: [],
    })
    expect(
      branches(schema).map((branch) => branch.properties.pick.const),
    ).toEqual(["option", "exact"])
    expect(prompt).not.toContain("theme tokens")
  })

  it("always keeps the exact branch last, and names the units when given", () => {
    const bare = buildResolvePropertyValueStage({
      propertyKey: "width",
      message: "200 pixels wide",
      options: [],
      themeTokens: [],
      units: ["px", "rem"],
    })
    expect(
      branches(bare.schema).map((branch) => branch.properties.pick.const),
    ).toEqual(["exact"])
    expect(bare.prompt).toContain("a number (px|rem) or a string")

    const unitless = buildResolvePropertyValueStage({
      propertyKey: "content",
      message: "say hello",
      options: [],
      themeTokens: [],
      units: [],
    })
    expect(unitless.prompt).toContain("a string or number")
  })
})
