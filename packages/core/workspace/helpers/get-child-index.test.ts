import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getChildIndex } from "./get-child-index"

describe("getChildIndex", () => {
  it("should return correct index for child node", () => {
    const index = getChildIndex("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)
    expect(index).toEqual(0)
  })

  it("should return correct index for second child", () => {
    const index = getChildIndex("child-label-wCHRir3I", WORKSPACE_FIXTURE)
    expect(index).toEqual(1)
  })

  it("should throw error for non-existent child", () => {
    expect(() => {
      getChildIndex("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow("Parent not found for child-button-nonexistent")
  })

  it("should throw error for variant node", () => {
    expect(() => {
      getChildIndex("variant-button-default", WORKSPACE_FIXTURE)
    }).toThrow("Parent not found for variant-button-default")
  })
})
