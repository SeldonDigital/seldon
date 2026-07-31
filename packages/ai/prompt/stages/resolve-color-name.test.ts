import { describe, expect, it } from "vitest"

import { buildResolveColorNameStage } from "./resolve-color-name"

function branches(schema: Record<string, unknown>) {
  return schema.oneOf as Array<{
    properties: { pick: { const: string }; value?: Record<string, unknown> }
  }>
}

describe("buildResolveColorNameStage", () => {
  it("offers swatch and color branches, with the swatch enum keyed to real swatches", () => {
    const { prompt, schema } = buildResolveColorNameStage({
      propertyKey: "color",
      message: "make all the chips red",
      swatches: [
        { key: "primary", label: "primary (hsl(210, 100%, 50%))" },
        { key: "swatch4", label: "swatch4 (Tint 4, hsl(30, 40%, 50%))" },
      ],
    })
    const oneOf = branches(schema)
    expect(oneOf.map((branch) => branch.properties.pick.const)).toEqual([
      "swatch",
      "color",
    ])
    expect(oneOf[0]!.properties.value!.enum).toEqual(["primary", "swatch4"])
    expect(prompt).toContain("primary (hsl(210, 100%, 50%))")
    expect(prompt).toContain("swatch4 (Tint 4, hsl(30, 40%, 50%))")
    expect(prompt).toContain('"make all the chips red"')
    expect(prompt).toContain('"color"')
    expect(prompt).toContain("Never guess the closest swatch")
  })

  it("drops the swatch branch and its guidance when the theme has no swatches", () => {
    const { prompt, schema } = buildResolveColorNameStage({
      propertyKey: "borderColor",
      message: "blue border",
      swatches: [],
    })
    expect(
      branches(schema).map((branch) => branch.properties.pick.const),
    ).toEqual(["color"])
    expect(prompt).not.toContain("Theme swatches")
    expect(prompt).not.toContain("swatch")
  })
})
