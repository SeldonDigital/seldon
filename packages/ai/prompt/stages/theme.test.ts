import { describe, expect, it } from "vitest"

import { buildAddThemeStage, buildResolveThemeIdStage } from "./theme"

describe("buildResolveThemeIdStage", () => {
  it("lists the ids, names the purpose, and constrains the enum", () => {
    const ids = ["material", "aurora"]
    const { prompt, schema } = buildResolveThemeIdStage({
      message: "use the aurora theme",
      purpose: "applying a theme to a node",
      ids,
    })
    expect(prompt).toContain("applying a theme to a node")
    expect(prompt).toContain("- material")
    expect(prompt).toContain("- aurora")
    expect(schema).toMatchObject({ properties: { themeId: { enum: ids } } })
  })
})

describe("buildAddThemeStage", () => {
  it("renders id and display name and constrains the enum to the ids", () => {
    const themes = [
      { id: "material", name: "Material" },
      { id: "aurora", name: "Aurora Borealis" },
    ]
    const { prompt, schema } = buildAddThemeStage({
      message: "add the aurora theme",
      themes,
    })
    expect(prompt).toContain("- material: Material")
    expect(prompt).toContain("- aurora: Aurora Borealis")
    expect(schema).toMatchObject({
      properties: { themeId: { enum: ["material", "aurora"] } },
    })
  })
})
