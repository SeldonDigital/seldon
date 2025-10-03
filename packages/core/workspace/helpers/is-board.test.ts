import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isBoard } from "./is-board"

describe("isBoard", () => {
  it("should return true for board", () => {
    const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]!
    expect(isBoard(board)).toBe(true)
  })

  it("should return false for variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    expect(isBoard(variant)).toBe(false)
  })

  it("should return false for instance", () => {
    const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    expect(isBoard(instance)).toBe(false)
  })
})
