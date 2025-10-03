import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../../.."
import { ComponentId } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleSetBoardProperties } from "./handle-set-board-properties"

describe("handleSetBoardProperties", () => {
  it("should set a single property of a board", () => {
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

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
        properties: {
          screenHeight: {
            type: ValueType.EXACT,
            value: {
              value: 400,
              unit: Unit.PX,
            },
          },
        },
      },
      workspace,
    )

    expect(result.boards.button?.properties.screenHeight).toEqual({
      type: ValueType.EXACT,
      value: {
        value: 400,
        unit: Unit.PX,
      },
    })
  })

  it("should set nested properties of a board", () => {
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

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
        properties: {
          background: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
          },
        },
      },
      workspace,
    )

    expect(result.boards.button?.properties.background?.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
  })

  it("should set multiple properties including nested properties", () => {
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

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
        properties: {
          screenWidth: {
            type: ValueType.EXACT,
            value: {
              value: 120,
              unit: Unit.PX,
            },
          },
          background: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
          },
        },
      },
      workspace,
    )

    expect(result.boards.button?.properties.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: {
        value: 120,
        unit: Unit.PX,
      },
    })

    expect(result.boards.button?.properties.background?.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
  })

  it("should update existing properties", () => {
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
      byId: {},
      customTheme,
    }

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
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

    expect(result.boards.button?.properties.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: {
        value: 800,
        unit: Unit.PX,
      },
    })
  })

  it("should handle setting properties on non-existent board", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleSetBoardProperties(
        {
          componentId: ComponentId.AVATAR,
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

  it("should handle empty properties object", () => {
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

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
        properties: {},
      },
      workspace,
    )

    expect(result.boards.button?.properties).toEqual({})
  })

  it("should not affect other boards when setting properties", () => {
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
        icon: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          variants: ["variant-icon-default"],
          properties: {
            screenWidth: {
              type: ValueType.EXACT,
              value: {
                value: 100,
                unit: Unit.PX,
              },
            },
          },
        },
      },
      byId: {},
      customTheme,
    }

    const result = handleSetBoardProperties(
      {
        componentId: ComponentId.BUTTON,
        properties: {
          screenWidth: {
            type: ValueType.EXACT,
            value: {
              value: 200,
              unit: Unit.PX,
            },
          },
        },
      },
      workspace,
    )

    expect(result.boards.button?.properties.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: {
        value: 200,
        unit: Unit.PX,
      },
    })
    expect(result.boards.icon?.properties.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: {
        value: 100,
        unit: Unit.PX,
      },
    }) // Should remain unchanged
  })
})
