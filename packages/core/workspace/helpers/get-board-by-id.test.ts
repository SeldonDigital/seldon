import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getBoardById } from "./get-board-by-id"

describe("getBoardById", () => {
  it("should return board by component id", () => {
    const board = getBoardById(ComponentId.BUTTON, WORKSPACE_FIXTURE)

    expect(board.id).toEqual(ComponentId.BUTTON)
    expect(board.label).toEqual("Buttons")
    expect(board.variants).toContain("variant-button-default")
  })

  it("should return board for different component types", () => {
    const buttonBoard = getBoardById(ComponentId.BUTTON, WORKSPACE_FIXTURE)
    const labelBoard = getBoardById(ComponentId.LABEL, WORKSPACE_FIXTURE)

    expect(buttonBoard.id).toEqual(ComponentId.BUTTON)
    expect(labelBoard.id).toEqual(ComponentId.LABEL)
  })

  it("should throw error for non-existent board", () => {
    expect(() => {
      getBoardById("nonExistentComponent" as ComponentId, WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
