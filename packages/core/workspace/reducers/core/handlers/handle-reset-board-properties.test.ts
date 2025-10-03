import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import { Unit, ValueType } from "../../../../index"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleResetBoardProperty } from "./handle-reset-board-properties"

describe("handleResetBoardProperty", () => {
  it("should reset the properties of a board", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {
            background: {
              color: {
                type: ValueType.EMPTY,
                value: null,
              },
            },
          },
        },
      },
      byId: {},
      customTheme,
    }

    const result = handleResetBoardProperty(
      {
        componentId: ComponentId.BUTTON,
        propertyKey: "background",
      },
      workspace,
    )

    expect(result.boards.button?.properties.background).toBeUndefined()
  })

  it("should handle subproperties", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {
            background: {
              color: {
                type: ValueType.EMPTY,
                value: null,
              },
            },
          },
        },
      },
      byId: {},
      customTheme,
    }

    const result = handleResetBoardProperty(
      {
        componentId: ComponentId.BUTTON,
        propertyKey: "background",
        subpropertyKey: "color",
      },
      workspace,
    )

    expect(result.boards.button?.properties.background).toBeDefined()
    expect(result.boards.button?.properties.background!.color).toBeUndefined()
  })

  it("should handle resetting a property that doesn't exist", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {},
      customTheme,
    }

    const result = handleResetBoardProperty(
      {
        componentId: ComponentId.BUTTON,
        propertyKey: "background",
      },
      workspace,
    )

    // Should return the same workspace without modification
    expect(result).toEqual(workspace)
  })

  it("should handle resetting a property on a non-existent board", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleResetBoardProperty(
        {
          componentId: ComponentId.AVATAR,
          propertyKey: "background",
        },
        workspace,
      )
    }).toThrow()
  })

  it("should reset multiple nested properties when resetting a parent property", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
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
      byId: {},
      customTheme,
    }

    const result = handleResetBoardProperty(
      {
        componentId: ComponentId.BUTTON,
        propertyKey: "background",
      },
      workspace,
    )

    expect(result.boards.button?.properties.background).toBeUndefined()
  })

  it("should not affect other boards when resetting properties", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {
            background: {
              color: {
                type: ValueType.EXACT,
                value: "#ff0000",
              },
            },
          },
        },
        icon: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          variants: ["variant-icon-default"],
          properties: {
            background: {
              color: {
                type: ValueType.EXACT,
                value: "#00ff00",
              },
            },
          },
        },
      },
      byId: {},
      customTheme,
    }

    const result = handleResetBoardProperty(
      {
        componentId: ComponentId.BUTTON,
        propertyKey: "background",
      },
      workspace,
    )

    expect(result.boards.button?.properties.background).toBeUndefined()
    expect(result.boards.icon?.properties.background?.color?.value).toBe(
      "#00ff00",
    ) // Should remain unchanged
  })
})
