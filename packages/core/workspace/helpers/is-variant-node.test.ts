import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isVariantNode } from "./is-variant-node"

describe("isVariantNode", () => {
  it("should return true for variant node", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    expect(isVariantNode(variant)).toBe(true)
  })

  it("should return false for instance node", () => {
    const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    expect(isVariantNode(instance)).toBe(false)
  })

  it("should return false for undefined", () => {
    expect(isVariantNode(undefined)).toBe(false)
  })
})
