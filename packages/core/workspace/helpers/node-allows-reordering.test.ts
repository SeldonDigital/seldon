import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { nodeAllowsReordering } from "./node-allows-reordering"

describe("nodeAllowsReordering", () => {
  it("should return true for nodes that allow reordering", () => {
    expect(
      nodeAllowsReordering("variant-button-default", WORKSPACE_FIXTURE),
    ).toBe(true)
  })

  it("should return true for child nodes that allow reordering", () => {
    expect(nodeAllowsReordering("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)).toBe(
      true,
    )
  })

  it("should return true for other component types", () => {
    expect(
      nodeAllowsReordering("variant-tagline-default", WORKSPACE_FIXTURE),
    ).toBe(true)
  })

  it("should throw error for non-existent node", () => {
    expect(() => {
      nodeAllowsReordering("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
