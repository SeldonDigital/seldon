import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isVariantInUse } from "./is-variant-in-use"

describe("isVariantInUse", () => {
  it("should return true for variant in use", () => {
    expect(isVariantInUse("variant-icon-default", WORKSPACE_FIXTURE)).toBe(true)
  })

  it("should return true for another variant in use", () => {
    expect(isVariantInUse("variant-label-default", WORKSPACE_FIXTURE)).toBe(
      true,
    )
  })

  it("should return false for variant not in use", () => {
    expect(isVariantInUse("variant-button-user", WORKSPACE_FIXTURE)).toBe(false)
  })

  it("should return false for non-existent variant", () => {
    expect(
      isVariantInUse("variant-button-nonexistent", WORKSPACE_FIXTURE),
    ).toBe(false)
  })
})
