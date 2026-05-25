import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import testTheme from "@seldon/core/themes/test/test-theme"
import type { Workspace } from "../../types"
import { applyCompoundPreset } from "./properties-panel"

function createVariantWorkspace(): Workspace {
  return {
    metadata: {
      version: 0,
      label: "Test",
      owner: "",
      lastUpdate: "",
      intent: "",
      tags: [],
    },
    components: {
      button: {
        type: "component",
        level: "element",
        catalogId: ComponentId.BUTTON,
        label: "Button",
        author: "Test",
        componentTheme: "default",
        componentProperties: {},
        variants: [{ id: "variant-button-default" }],
      },
    },
    nodes: {
      "variant-button-default": {
        type: "default",
        id: "variant-button-default",
        template: `catalog:${ComponentId.BUTTON}`,
        overrides: {},
        theme: "default",
      },
    },
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}

describe("applyCompoundPreset for layered paint", () => {
  it("returns background as a single-layer array", () => {
    const workspace = createVariantWorkspace()
    const colorFill = Object.values(testTheme.background).find(
      (entry) => entry.name === "Color fill",
    )
    expect(colorFill).toBeDefined()

    const applied = applyCompoundPreset(
      "background",
      colorFill!.name,
      "variant-button-default",
      workspace,
      testTheme,
    )

    expect(Array.isArray(applied.background)).toBe(true)
    expect(applied.background).toHaveLength(1)
    expect(applied.background![0]).toEqual(
      expect.objectContaining({
        color: expect.objectContaining({
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        }),
      }),
    )
  })
})
