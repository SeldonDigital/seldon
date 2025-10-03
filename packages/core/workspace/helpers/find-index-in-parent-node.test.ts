import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { findIndexInParentNode } from "./find-index-in-parent-node"
import { getNodeById } from "./get-node-by-id"

describe("findIndexInParentNode", () => {
  it("should find the correct child index by parent node", () => {
    const parent = getNodeById("variant-button-default", WORKSPACE_FIXTURE)

    expect(findIndexInParentNode(parent!, "child-label-wCHRir3I")).toEqual(1)
    expect(findIndexInParentNode(parent!, "child-icon-K3GlMKHA")).toEqual(0)
  })

  it("should return -1 for non-existent child", () => {
    const parent = getNodeById("variant-button-default", WORKSPACE_FIXTURE)
    expect(findIndexInParentNode(parent!, "child-avatar-nonexisting")).toEqual(
      -1,
    )
  })

  it("should handle parent with no children", () => {
    const parent = getNodeById("variant-tagline-default", WORKSPACE_FIXTURE)
    expect(findIndexInParentNode(parent!, "any-child")).toEqual(-1)
  })

  it("should handle null parent", () => {
    expect(findIndexInParentNode(null, "any-child")).toEqual(-1)
  })
})
