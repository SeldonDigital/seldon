import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { ThemeId } from "../../../../themes/types"
import { Workspace } from "../../../types"
import { handleSetBoardTheme } from "./handle-set-board-theme"

function createWorkspaceFixture(initialTheme: ThemeId = "default"): Workspace {
  return {
    version: 1,
    boards: {
      button: {
        id: ComponentId.BUTTON,
        label: "Button",
        order: 0,
        theme: initialTheme,
        variants: ["variant-button-default"],
        properties: {},
      },
    },
    byId: {
      "variant-button-default": {
        id: "variant-button-default",
        type: "defaultVariant",
        label: "Default",
        theme: "default",
        properties: {},
        isChild: false,
        fromSchema: true,
        level: ComponentLevel.ELEMENT,
        component: ComponentId.BUTTON,
      },
    },
    customTheme,
  }
}

describe("handleSetBoardTheme", () => {
  it("should set the theme of a board", () => {
    const workspace = createWorkspaceFixture()

    const result = handleSetBoardTheme(
      {
        componentId: ComponentId.BUTTON,
        theme: "material",
      },
      workspace,
    )

    expect(result.boards.button?.theme).toBe("material")
  })

  it("should update the theme of a board", () => {
    const workspace = createWorkspaceFixture("earth")

    const result = handleSetBoardTheme(
      {
        componentId: ComponentId.BUTTON,
        theme: "material",
      },
      workspace,
    )

    expect(result.boards.button?.theme).toBe("material")
  })

  it("should set theme to null", () => {
    const workspace = createWorkspaceFixture()

    const result = handleSetBoardTheme(
      {
        componentId: ComponentId.BUTTON,
        theme: null,
      },
      workspace,
    )

    expect(result.boards.button?.theme).toBeNull()
  })

  it("should handle setting theme on non-existent board", () => {
    const workspace = createWorkspaceFixture()

    expect(() => {
      handleSetBoardTheme(
        {
          componentId: ComponentId.AVATAR,
          theme: "material",
        },
        workspace,
      )
    }).toThrow()
  })

  it("should set theme to different theme values", () => {
    const themes = [
      "default",
      "material",
      "earth",
      "industrial",
      "pop",
    ] as const

    themes.forEach((theme) => {
      const workspace = createWorkspaceFixture()

      const result = handleSetBoardTheme(
        {
          componentId: ComponentId.BUTTON,
          theme,
        },
        workspace,
      )

      expect(result.boards.button?.theme).toBe(theme)
    })
  })

  it("should not affect other boards when setting theme", () => {
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
          theme: "earth",
          variants: ["variant-icon-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          component: ComponentId.BUTTON,
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          type: "defaultVariant",
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          component: ComponentId.ICON,
        },
      },
      customTheme,
    }

    const result = handleSetBoardTheme(
      {
        componentId: ComponentId.BUTTON,
        theme: "material",
      },
      workspace,
    )

    expect(result.boards.button?.theme).toBe("material")
    expect(result.boards.icon?.theme).toBe("earth") // Should remain unchanged
  })
})
