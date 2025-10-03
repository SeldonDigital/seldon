import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isDefaultVariant } from "./is-default-variant"

describe("isDefaultVariant", () => {
  it("should return true for default variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    expect(isDefaultVariant(variant)).toBe(true)
  })

  it("should return false for user variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-user"]!
    expect(isDefaultVariant(variant)).toBe(false)
  })

  it("should return true for other default variants", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-tagline-default"]!
    expect(isDefaultVariant(variant)).toBe(true)
  })
})
