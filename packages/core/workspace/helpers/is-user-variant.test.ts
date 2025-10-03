import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isUserVariant } from "./is-user-variant"

describe("isUserVariant", () => {
  it("should return false for default variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    expect(isUserVariant(variant)).toBe(false)
  })

  it("should return true for user variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-user"]!
    expect(isUserVariant(variant)).toBe(true)
  })

  it("should return false for other default variants", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-tagline-default"]!
    expect(isUserVariant(variant)).toBe(false)
  })
})
