import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getVariantById } from "./get-variant-by-id"

describe("getVariantById", () => {
  it("should return variant by id", () => {
    const variant = getVariantById("variant-button-default", WORKSPACE_FIXTURE)

    expect(variant.id).toEqual("variant-button-default")
    expect(variant.component).toEqual(ComponentId.BUTTON)
    expect(variant.level).toEqual(ComponentLevel.ELEMENT)
    expect(variant.isChild).toBe(false)
  })

  it("should return different variant by id", () => {
    const variant = getVariantById("variant-tagline-default", WORKSPACE_FIXTURE)

    expect(variant.id).toEqual("variant-tagline-default")
    expect(variant.component).toEqual(ComponentId.TAGLINE)
    expect(variant.level).toEqual(ComponentLevel.PRIMITIVE)
    expect(variant.isChild).toBe(false)
  })

  it("should throw error for non-existent variant", () => {
    expect(() => {
      getVariantById("variant-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })

  it("should throw error for instance id", () => {
    expect(() => {
      getVariantById("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
