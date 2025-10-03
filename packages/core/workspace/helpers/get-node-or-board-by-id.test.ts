import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getNodeOrBoardById } from "./get-node-or-board-by-id"

describe("getNodeOrBoardById", () => {
  it("should return board when given component ID", () => {
    const board = getNodeOrBoardById(ComponentId.BUTTON, WORKSPACE_FIXTURE)

    expect(board.id).toEqual(ComponentId.BUTTON)
    expect(board.label).toEqual("Buttons")
    expect("variants" in board).toBe(true)
  })

  it("should return variant when given variant ID", () => {
    const result = getNodeOrBoardById(
      "variant-button-default",
      WORKSPACE_FIXTURE,
    )

    expect(result.id).toEqual("variant-button-default")
    if ("component" in result) {
      expect(result.component).toEqual(ComponentId.BUTTON)
      expect(result.level).toEqual(ComponentLevel.ELEMENT)
      expect(result.isChild).toBe(false)
    }
  })

  it("should return instance when given instance ID", () => {
    const result = getNodeOrBoardById("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)

    expect(result.id).toEqual("child-icon-K3GlMKHA")
    if ("component" in result) {
      expect(result.component).toEqual(ComponentId.ICON)
      expect(result.level).toEqual(ComponentLevel.PRIMITIVE)
      expect(result.isChild).toBe(true)
    }
  })

  it("should throw error for non-existent ID", () => {
    expect(() => {
      getNodeOrBoardById("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
