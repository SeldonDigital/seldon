import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import customTheme from "../../themes/custom"
import { Workspace } from "../types"
import { areBoardVariantsInUse } from "./are-board-variants-in-use"

describe("areBoardVariantsInUse", () => {
  it("should return true when board variants are in use", () => {
    const board = WORKSPACE_FIXTURE.boards.textblockDetails!
    const result = areBoardVariantsInUse(board, WORKSPACE_FIXTURE)
    expect(result).toBe(true)
  })

  it("should return false when board variants are not in use", () => {
    const workspace: Workspace = {
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
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const board = workspace.boards[ComponentId.BUTTON]!
    const result = areBoardVariantsInUse(board, workspace)
    expect(result).toBe(false)
  })
})
