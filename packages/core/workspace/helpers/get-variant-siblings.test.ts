import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getVariantSiblingIds } from "./get-variant-siblings"

describe("getVariantSiblingIds", () => {
  it("should return sibling variants", () => {
    const siblings = getVariantSiblingIds(
      "variant-button-default",
      WORKSPACE_FIXTURE,
    )
    expect(siblings).toContain("variant-button-user")
    expect(siblings).not.toContain("variant-button-default")
  })

  it("should return empty array for variant with no siblings", () => {
    const siblings = getVariantSiblingIds(
      "variant-tagline-default",
      WORKSPACE_FIXTURE,
    )
    expect(siblings).toEqual([])
  })

  it("should return all other variants for middle variant", () => {
    const siblings = getVariantSiblingIds(
      "variant-button-user",
      WORKSPACE_FIXTURE,
    )
    expect(siblings).toContain("variant-button-default")
    expect(siblings).not.toContain("variant-button-user")
  })

  it("should throw error for non-existent variant", () => {
    expect(() => {
      getVariantSiblingIds("variant-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
