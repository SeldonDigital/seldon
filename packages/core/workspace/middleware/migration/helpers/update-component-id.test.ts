import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { updateComponentId } from "./update-component-id"

describe("updateComponentId", () => {
  const mockWorkspace: Workspace = {
    version: 1,
    customTheme,
    boards: {
      oldButton: {
        id: "oldButton",
        label: "Old Button",
        order: 0,
        theme: "default",
        properties: {},
        variants: ["variant-oldButton-default"],
      },
    },
    byId: {
      "variant-oldButton-default": {
        id: "variant-oldButton-default",
        type: "defaultVariant",
        component: "oldButton",
        level: "element",
        label: "Default",
        isChild: false,
        fromSchema: true,
        theme: null,
        properties: {},
        children: [],
      },
      "child-oldButton-1": {
        id: "child-oldButton-1",
        type: "defaultVariant",
        component: "oldButton",
        level: "element",
        label: "Child",
        isChild: true,
        fromSchema: true,
        theme: null,
        properties: {},
        children: [],
      },
    },
  }

  it("should update component ID in boards and nodes", () => {
    const result = updateComponentId(
      mockWorkspace,
      "oldButton" as ComponentId,
      "newButton" as ComponentId,
    )

    // Board should be moved to new ID
    expect(result.boards.newButton).toBeDefined()
    expect(result.boards.newButton.id).toBe("newButton")
    expect(result.boards.oldButton).toBeUndefined()

    // All nodes should have updated component ID
    expect(result.byId["variant-oldButton-default"].component).toBe("newButton")
    expect(result.byId["child-oldButton-1"].component).toBe("newButton")
  })

  it("should not modify workspace if old component ID doesn't exist", () => {
    const result = updateComponentId(
      mockWorkspace,
      "nonexistent" as ComponentId,
      "newButton" as ComponentId,
    )

    expect(result).toEqual(mockWorkspace)
  })

  it("should handle workspace with no boards", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = updateComponentId(
      emptyWorkspace,
      "oldButton" as ComponentId,
      "newButton" as ComponentId,
    )

    expect(result).toEqual(emptyWorkspace)
  })

  it("should preserve all board properties", () => {
    const result = updateComponentId(
      mockWorkspace,
      "oldButton" as ComponentId,
      "newButton" as ComponentId,
    )

    const newBoard = result.boards.newButton
    expect(newBoard.label).toBe("Old Button")
    expect(newBoard.order).toBe(0)
    expect(newBoard.theme).toBe("default")
    expect(newBoard.variants).toEqual(["variant-oldButton-default"])
  })
})
