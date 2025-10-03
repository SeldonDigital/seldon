import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { ValueType } from "../../index"
import customTheme from "../../themes/custom"
import { Theme } from "../../themes/types"
import { Workspace } from "../../workspace/types"
import { migrateNodePropertiesToTheme } from "./migrate-properties-to-theme"

const createMinimalWorkspace = (): Workspace => ({
  version: 1,
  customTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {},
      label: "Button",
      type: "defaultVariant",
      children: [],
    },
  },
})

describe("migratePropertiesToTheme", () => {
  it("should migrate preset swatch properties to same preset slots", () => {
    const workspace = createMinimalWorkspace()
    workspace.byId["variant-button-default"].properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const newTheme: Theme = {
      ...customTheme,
      id: "material",
      name: "Material Theme",
    }

    migrateNodePropertiesToTheme(
      "variant-button-default",
      "default",
      "material",
      workspace,
    )

    expect(
      workspace.byId["variant-button-default"].properties.background?.color
        ?.value,
    ).toBe("@swatch.primary")
  })

  it("should detach custom swatch properties when no match found", () => {
    const workspace = createMinimalWorkspace()
    // Use custom4 which exists in custom theme but not in material theme
    workspace.byId["variant-button-default"].properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.custom4",
        },
      },
    }

    migrateNodePropertiesToTheme(
      "variant-button-default",
      "custom",
      "material",
      workspace,
    )

    expect(
      workspace.byId["variant-button-default"].properties.background?.color,
    ).toEqual({
      type: ValueType.EXACT,
      value: { hue: 60, saturation: 100, lightness: 46 },
    })
  })

  it("should migrate fontSize theme properties to same preset slots", () => {
    const workspace = createMinimalWorkspace()
    workspace.byId["variant-button-default"].properties = {
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
      },
    }

    migrateNodePropertiesToTheme(
      "variant-button-default",
      "default",
      "material",
      workspace,
    )

    expect(
      workspace.byId["variant-button-default"].properties.font?.size?.value,
    ).toBe("@fontSize.medium")
  })

  it("should handle non-existent theme values gracefully", () => {
    const workspace = createMinimalWorkspace()
    workspace.byId["variant-button-default"].properties = {
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.huge",
        },
      },
    }

    migrateNodePropertiesToTheme(
      "variant-button-default",
      "default",
      "material",
      workspace,
    )

    expect(
      workspace.byId["variant-button-default"].properties.font?.size?.value,
    ).toBe("@fontSize.huge")
  })
})
