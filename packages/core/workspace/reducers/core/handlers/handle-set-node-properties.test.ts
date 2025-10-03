import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import { Unit, ValueType } from "../../../../index"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleSetNodeProperties } from "./handle-set-node-properties"

describe("handleSetNodeProperties", () => {
  it("should set the properties of a node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetNodeProperties(
      {
        nodeId: "variant-button-default",
        properties: {
          screenWidth: {
            type: ValueType.EXACT,
            value: {
              value: 600,
              unit: Unit.PX,
            },
          },
        },
      },
      workspace,
    )

    expect(result.byId["variant-button-default"].properties).toEqual({
      screenWidth: {
        type: ValueType.EXACT,
        value: {
          value: 600,
          unit: Unit.PX,
        },
      },
    })
  })

  it("should update the properties of a node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {
            screenWidth: {
              type: ValueType.EXACT,
              value: {
                value: 600,
                unit: Unit.PX,
              },
            },
          },
        },
      },
      customTheme,
    }

    const result = handleSetNodeProperties(
      {
        nodeId: "variant-button-default",
        properties: {
          screenWidth: {
            type: ValueType.EXACT,
            value: {
              value: 800,
              unit: Unit.PX,
            },
          },
        },
      },
      workspace,
    )

    expect(result.byId["variant-button-default"].properties).toEqual({
      screenWidth: {
        type: ValueType.EXACT,
        value: {
          value: 800,
          unit: Unit.PX,
        },
      },
    })
  })

  it("should handle setting properties on a non-existent node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleSetNodeProperties(
        {
          nodeId: "variant-button-default",
          properties: {
            screenWidth: {
              type: ValueType.EXACT,
              value: {
                value: 600,
                unit: Unit.PX,
              },
            },
          },
        },
        workspace,
      )
    }).toThrow()
  })

  it("should handle setting empty properties", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetNodeProperties(
      {
        nodeId: "variant-button-default",
        properties: {},
      },
      workspace,
    )

    expect(result.byId["variant-button-default"].properties).toEqual({})
  })
})
