import { describe, expect, it } from "vitest"

import {
  computeWorkspaceThemes,
  getComputedTheme,
} from "./compute-workspace-themes"

describe("computeWorkspaceThemes", () => {
  it("includes stock themes when the workspace has none", () => {
    const themes = computeWorkspaceThemes({})
    expect(themes.some((theme) => theme.id === "seldon")).toBe(true)
  })

  it("throws when a theme entry chain forms a cycle", () => {
    const workspace = {
      themes: {
        a: { id: "a", template: "theme:b" },
        b: { id: "b", template: "theme:a" },
      },
    }
    expect(() => computeWorkspaceThemes(workspace)).toThrow()
  })
})

describe("getComputedTheme", () => {
  it("resolves a stock theme by id", () => {
    expect(getComputedTheme("seldon", {}).id).toBe("seldon")
  })

  it("materializes a workspace entry with its overrides", () => {
    const workspace = {
      themes: {
        custom: {
          id: "custom",
          template: "catalog:seldon",
          overrides: { metadata: { name: "Custom" } },
        },
      },
    }
    const computed = getComputedTheme("custom", workspace)
    expect(computed.id).toBe("custom")
    expect(computed.metadata.name).toBe("Custom")
  })

  it("throws for an unknown theme id", () => {
    expect(() => getComputedTheme("does-not-exist", {})).toThrow()
  })
})
