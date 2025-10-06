import { describe, expect, it } from "bun:test"
import { ValueType, Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { getUsedIconIds } from "./get-used-icon-ids"

describe("getUsedIconIds", () => {
  it("should extract icon IDs from workspace properties", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-add" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon 1",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-accountCircle" },
          },
          isChild: true,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          fromSchema: false,
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getUsedIconIds(mockWorkspace)

    expect(result.has("material-add")).toBe(true)
    expect(result.has("material-accountCircle")).toBe(true)
    expect(result.has("__default__")).toBe(true)
    expect(result.size).toBe(3)
  })

  it("should handle workspace with no icons", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
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
          label: "Default",
          theme: "default",
          properties: {
            background: { color: { type: ValueType.EXACT, value: "#ff0000" } },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getUsedIconIds(mockWorkspace)

    expect(result.size).toBe(1)
    expect(result.has("__default__")).toBe(true)
  })

  it("should handle empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = getUsedIconIds(emptyWorkspace)

    expect(result.size).toBe(1)
    expect(result.has("__default__")).toBe(true)
  })

  it("should deduplicate duplicate icon IDs", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-1", "variant-button-2"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
      byId: {
        "variant-button-1": {
          id: "variant-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 1",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-add" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "variant-button-2": {
          id: "variant-button-2",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 2",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-add" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon 1",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-accountCircle" },
          },
          isChild: true,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          fromSchema: false,
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getUsedIconIds(mockWorkspace)

    expect(result.has("material-add")).toBe(true)
    expect(result.has("material-accountCircle")).toBe(true)
    expect(result.has("__default__")).toBe(true)
    expect(result.size).toBe(3)
  })

  it("should handle nested icon properties", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
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
          label: "Default",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "material-add" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getUsedIconIds(mockWorkspace)

    expect(result.has("material-add")).toBe(true)
    expect(result.has("__default__")).toBe(true)
    expect(result.size).toBe(2)
  })

  it("should handle __default__ icon values", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
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
          label: "Default",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "__default__" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getUsedIconIds(mockWorkspace)

    expect(result.has("__default__")).toBe(true)
    expect(result.size).toBe(1)
  })
})
