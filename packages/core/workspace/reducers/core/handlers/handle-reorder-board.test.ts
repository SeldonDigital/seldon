import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleReorderBoard } from "./handle-reorder-board"

describe("handleReorderBoard", () => {
  // Test cases:
  // 1. Should move a board to a new index that's larger than the current index
  // 2. Should move a board to a new index that's smaller than the current index
  // 3. Should not change the index if the new index is the same as the current index
  // 4. Should not change the index if the board is not found
  // 5. Should not change the index if the new index is out of bounds

  const workspaceWithThreeBoards: Workspace = {
    version: 1,
    boards: {
      button: {
        label: "Button",
        id: ComponentId.BUTTON,
        properties: expect.any(Object),
        theme: "default",
        variants: ["variant-button-default"],
        order: 0,
      },
      icon: {
        label: "Icon",
        id: ComponentId.ICON,
        properties: expect.any(Object),
        theme: "default",
        variants: ["variant-icon-default"],
        order: 1,
      },
      label: {
        label: "Label",
        id: ComponentId.LABEL,
        properties: expect.any(Object),
        theme: "default",
        variants: ["variant-label-default"],
        order: 2,
      },
    },
    byId: {},
    customTheme,
  }

  it("should move a board to a higher index and update the order of all affected boards", () => {
    const result = handleReorderBoard(
      { componentId: ComponentId.BUTTON, newIndex: 1 },
      workspaceWithThreeBoards,
    )

    expect(result).toEqual({
      version: 1,
      boards: {
        button: {
          label: "Button",
          id: ComponentId.BUTTON,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-button-default"],
          order: 0,
        },
        icon: {
          label: "Icon",
          id: ComponentId.ICON,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-icon-default"],
          order: 1,
        },
        label: {
          label: "Label",
          id: ComponentId.LABEL,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-label-default"],
          order: 2,
        },
      },
      byId: {},
      customTheme,
    })
  })

  it("should move a board to a lower index and update the order of all affected boards", () => {
    const result = handleReorderBoard(
      { componentId: ComponentId.LABEL, newIndex: 0 },
      workspaceWithThreeBoards,
    )

    expect(result).toEqual({
      version: 1,
      boards: {
        button: {
          label: "Button",
          id: ComponentId.BUTTON,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-button-default"],
          order: 0,
        },
        icon: {
          label: "Icon",
          id: ComponentId.ICON,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-icon-default"],
          order: 2,
        },
        label: {
          label: "Label",
          id: ComponentId.LABEL,
          properties: expect.any(Object),
          theme: "default",
          variants: ["variant-label-default"],
          order: 1,
        },
      },
      byId: {},
      customTheme,
    })
  })

  it("should not change any board orders when moving to the same index", () => {
    const result = handleReorderBoard(
      { componentId: ComponentId.BUTTON, newIndex: 0 },
      workspaceWithThreeBoards,
    )

    expect(result).toEqual(workspaceWithThreeBoards)
  })

  it("should not change any board orders when the target board does not exist", () => {
    const result = handleReorderBoard(
      { componentId: ComponentId.AVATAR, newIndex: -2 },
      workspaceWithThreeBoards,
    )

    expect(result).toEqual(workspaceWithThreeBoards)
  })

  it("should not change any board orders when the target index is out of bounds", () => {
    const result = handleReorderBoard(
      { componentId: ComponentId.BUTTON, newIndex: 10 },
      workspaceWithThreeBoards,
    )

    expect(result).toEqual(workspaceWithThreeBoards)
  })
})
