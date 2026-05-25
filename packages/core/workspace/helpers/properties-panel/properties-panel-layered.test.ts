import { describe, expect, it } from "bun:test"
import { Resize, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import testTheme from "@seldon/core/themes/test/test-theme"
import { applyBoardDevicePreset } from "../../../properties/values/layout/board"
import type { Workspace } from "../../types"
import { applyCompoundPreset, formatCompoundDisplay } from "./properties-panel"

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

describe("formatCompoundDisplay for board", () => {
  it("shows the preset name when board facets still match a preset", () => {
    const workspace = {
      metadata: {
        version: 0,
        label: "Test",
        owner: "",
        lastUpdate: "",
        intent: "",
        tags: [],
      },
      components: {
        calendar: {
          type: "component" as const,
          level: "module" as const,
          catalogId: "calendar",
          label: "Calendars",
          author: "Test",
          componentTheme: "default",
          componentProperties: {
            board: applyBoardDevicePreset("ipad"),
          },
          variants: [{ id: "component-calendar-default" }],
        },
      },
      nodes: {},
      themes: {},
      "font-collections": {},
      "icon-sets": {},
      media: {},
    } satisfies Workspace

    expect(formatCompoundDisplay("board", "calendar", workspace)).toBe("iPad")
  })

  it("shows Custom when board dimensions no longer match the stored preset", () => {
    const workspace = {
      metadata: {
        version: 0,
        label: "Test",
        owner: "",
        lastUpdate: "",
        intent: "",
        tags: [],
      },
      components: {
        calendar: {
          type: "component" as const,
          level: "module" as const,
          catalogId: "calendar",
          label: "Calendars",
          author: "Test",
          componentTheme: "default",
          componentProperties: {
            board: {
              ...applyBoardDevicePreset("ipad"),
              width: {
                type: ValueType.OPTION,
                value: Resize.FIT,
              },
            },
          },
          variants: [{ id: "component-calendar-default" }],
        },
      },
      nodes: {},
      themes: {},
      "font-collections": {},
      "icon-sets": {},
      media: {},
    } satisfies Workspace

    expect(formatCompoundDisplay("board", "calendar", workspace)).toBe("Custom")
  })
})
