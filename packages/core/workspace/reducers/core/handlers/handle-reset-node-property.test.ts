import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import { Unit, ValueType } from "../../../../index"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleResetNodeProperty } from "./handle-reset-node-property"

describe("handleResetNodeProperty", () => {
  it("should reset a property of a node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          label: "Default",
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          component: ComponentId.BUTTON,
          properties: {
            content: {
              type: ValueType.EXACT,
              value: "Modified text",
            },
          },
        },
      },
      customTheme,
    }

    const result = handleResetNodeProperty(
      { nodeId: "variant-button-default", propertyKey: "content" },
      workspace,
    )

    expect(
      result.byId["variant-button-default"].properties.content,
    ).toBeUndefined()
  })

  it("should reset a nested property of a node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          label: "Default",
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          component: ComponentId.BUTTON,
          properties: {
            background: {
              color: {
                type: ValueType.EXACT,
                value: "#ff0000",
              },
            },
          },
        },
      },
      customTheme,
    }

    const result = handleResetNodeProperty(
      {
        nodeId: "variant-button-default",
        propertyKey: "background",
        subpropertyKey: "color",
      },
      workspace,
    )

    expect(
      result.byId["variant-button-default"].properties.background?.color,
    ).toBeUndefined()
  })

  it("should handle resetting a property that doesn't exist", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          label: "Default",
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          component: ComponentId.BUTTON,
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleResetNodeProperty(
      { nodeId: "variant-button-default", propertyKey: "background" },
      workspace,
    )

    // Should return the same workspace without modification
    expect(result).toEqual(workspace)
  })

  it("should handle resetting a property on a non-existent node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleResetNodeProperty(
        { nodeId: "variant-button-default", propertyKey: "content" },
        workspace,
      )
    }).toThrow()
  })

  it("should reset multiple properties when resetting a parent property", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          label: "Default",
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          component: ComponentId.BUTTON,
          properties: {
            background: {
              color: {
                type: ValueType.EXACT,
                value: "#ff0000",
              },
              opacity: {
                type: ValueType.EXACT,
                value: { value: 0.5, unit: Unit.PERCENT },
              },
            },
          },
        },
      },
      customTheme,
    }

    const result = handleResetNodeProperty(
      { nodeId: "variant-button-default", propertyKey: "background" },
      workspace,
    )

    expect(
      result.byId["variant-button-default"].properties.background,
    ).toBeUndefined()
  })
})
