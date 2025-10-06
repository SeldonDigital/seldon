import { describe, expect, it } from "bun:test"
import { ValueType, Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { getJsonTreeFromChildren } from "./get-json-tree-from-children"

describe("getJsonTreeFromChildren", () => {
  it("should create JSON tree from variant with children", () => {
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
        [ComponentId.LABEL]: {
          id: ComponentId.LABEL,
          label: "Label",
          order: 2,
          theme: "default",
          properties: {},
          variants: ["variant-label-default"],
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
            background: {
              color: { type: ValueType.EXACT, value: "#ff0000" },
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          children: ["child-icon-1", "child-label-1"],
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon 1",
          theme: "default",
          instanceOf: "variant-icon-default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "arrow" },
          },
          isChild: true,
          variant: "variant-icon-default",
          fromSchema: false,
        },
        "child-label-1": {
          id: "child-label-1",
          component: ComponentId.LABEL,
          level: ComponentLevel.PRIMITIVE,
          label: "Label 1",
          theme: "default",
          instanceOf: "variant-label-default",
          properties: {
            content: { type: ValueType.EXACT, value: "Click me" },
          },
          isChild: true,
          variant: "variant-label-default",
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
        "variant-label-default": {
          id: "variant-label-default",
          component: ComponentId.LABEL,
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

    const variant = mockWorkspace.byId["variant-button-default"] as any
    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
      "child-icon-1": "sdn-icon",
      "child-label-1": "sdn-label",
    }

    const result = getJsonTreeFromChildren(
      variant,
      mockWorkspace,
      nodeIdToClass,
    )

    expect(result).toHaveProperty("name", "Button")
    expect(result).toHaveProperty("nodeId", "variant-button-default")
    expect(result).toHaveProperty("level", ComponentLevel.ELEMENT)
    expect(result).toHaveProperty("dataBinding")
    expect(result).toHaveProperty("children")
    expect(result.children).toHaveLength(2)
  })

  it("should handle variant without children", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
      byId: {
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Default",
          theme: "default",
          properties: {
            symbol: { type: ValueType.PRESET, value: "arrow" },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-icon-default"] as any
    const nodeIdToClass = {
      "variant-icon-default": "sdn-icon",
    }

    const result = getJsonTreeFromChildren(
      variant,
      mockWorkspace,
      nodeIdToClass,
    )

    expect(result).toHaveProperty("name", "Icon")
    expect(result).toHaveProperty("nodeId", "variant-icon-default")
    expect(result).toHaveProperty("level", ComponentLevel.PRIMITIVE)
    expect(result).toHaveProperty("dataBinding")
    expect(result.children).toBeNull()
  })

  it("should handle empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const variant = {
      id: "variant-test",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Test",
      theme: "default",
      properties: {},
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
    } as any

    const nodeIdToClass = {}

    const result = getJsonTreeFromChildren(
      variant,
      emptyWorkspace,
      nodeIdToClass,
    )

    expect(result).toHaveProperty("name", "Button")
    expect(result).toHaveProperty("nodeId", "variant-test")
    expect(result.children).toBeNull()
  })

  it("should create proper data binding structure", () => {
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
            background: {
              color: { type: ValueType.EXACT, value: "#ff0000" },
            },
            font: {
              family: { type: ValueType.PRESET, value: "Arial" },
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-button-default"] as any
    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
    }

    const result = getJsonTreeFromChildren(
      variant,
      mockWorkspace,
      nodeIdToClass,
    )

    expect(result.dataBinding).toHaveProperty("interfaceName")
    expect(result.dataBinding).toHaveProperty("path")
    expect(result.dataBinding).toHaveProperty("props")
    expect(result.dataBinding.interfaceName).toContain("Props")
  })
})
