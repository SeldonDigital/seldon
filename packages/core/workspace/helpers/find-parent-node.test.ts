import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { findParentNode } from "./find-parent-node"

describe("findParentNode", () => {
  it("should return null if the child id is not found", () => {
    expect(
      findParentNode("child-button-nonexistent", WORKSPACE_FIXTURE),
    ).toBeNull()
  })

  it("should return null for variant nodes", () => {
    expect(
      findParentNode("variant-button-default", WORKSPACE_FIXTURE),
    ).toBeNull()
  })

  it("should find the correct parent node by child id", () => {
    const childId =
      WORKSPACE_FIXTURE.byId["variant-button-default"].children![0]
    const parent = findParentNode(childId, WORKSPACE_FIXTURE)

    expect(parent).toEqual(WORKSPACE_FIXTURE.byId["variant-button-default"])
    expect(parent?.id).toEqual("variant-button-default")
  })

  it("should find parent for nested child nodes", () => {
    const parent = findParentNode("child-icon-MAFDy9IN", WORKSPACE_FIXTURE)

    expect(parent).toEqual(WORKSPACE_FIXTURE.byId["child-button-4eo3qAPb"])
    expect(parent?.id).toEqual("child-button-4eo3qAPb")
  })

  it("should find parent for deeply nested child nodes", () => {
    const parent = findParentNode("child-tagline-rNpC8RXH", WORKSPACE_FIXTURE)

    expect(parent).toEqual(
      WORKSPACE_FIXTURE.byId["child-textblockDetails-pv9tiJDS"],
    )
    expect(parent?.id).toEqual("child-textblockDetails-pv9tiJDS")
  })
})
