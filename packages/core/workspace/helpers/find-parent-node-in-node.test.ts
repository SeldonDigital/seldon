import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { findParentNodeInNode } from "./find-parent-node-in-node"

describe("findParentNodeInNode", () => {
  it("should find parent node containing child", () => {
    const parent = findParentNodeInNode(
      "child-icon-K3GlMKHA",
      WORKSPACE_FIXTURE.byId["variant-button-default"]!,
      WORKSPACE_FIXTURE,
    )

    expect(parent).not.toBeNull()
    expect(parent!.id).toEqual("variant-button-default")
    expect(parent!.component).toEqual(ComponentId.BUTTON)
    expect(parent!.level).toEqual(ComponentLevel.ELEMENT)
  })

  it("should find nested parent node", () => {
    const parent = findParentNodeInNode(
      "child-label-wCHRir3I",
      WORKSPACE_FIXTURE.byId["variant-button-default"]!,
      WORKSPACE_FIXTURE,
    )

    expect(parent).not.toBeNull()
    expect(parent!.id).toEqual("variant-button-default")
    expect(parent!.component).toEqual(ComponentId.BUTTON)
  })

  it("should return null for non-existent child", () => {
    const parent = findParentNodeInNode(
      "child-button-nonexistent",
      WORKSPACE_FIXTURE.byId["variant-button-default"]!,
      WORKSPACE_FIXTURE,
    )
    expect(parent).toBeNull()
  })

  it("should return null when searching in node without children", () => {
    const parent = findParentNodeInNode(
      "child-icon-K3GlMKHA",
      WORKSPACE_FIXTURE.byId["variant-tagline-default"]!,
      WORKSPACE_FIXTURE,
    )
    expect(parent).toBeNull()
  })
})
