import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import customTheme from "../../themes/custom"
import { Workspace } from "../types"
import { hasMultipleBoards } from "./has-multiple-boards"

describe("hasMultipleBoards", () => {
  it("should return true when workspace has multiple boards", () => {
    expect(hasMultipleBoards(WORKSPACE_FIXTURE)).toBe(true)
  })

  it("should return false when workspace has only one board", () => {
    const singleBoardWorkspace: Workspace = {
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
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    expect(hasMultipleBoards(singleBoardWorkspace)).toBe(false)
  })

  it("should return false when workspace has no boards", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    expect(hasMultipleBoards(emptyWorkspace)).toBe(false)
  })
})
