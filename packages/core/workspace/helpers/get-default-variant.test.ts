import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getDefaultVariant } from "./get-default-variant"

describe("getDefaultVariant", () => {
  it("should return default variant for component", () => {
    const variant = getDefaultVariant(ComponentId.BUTTON, WORKSPACE_FIXTURE)

    expect(variant.id).toEqual("variant-button-default")
    expect(variant.component).toEqual(ComponentId.BUTTON)
    expect(variant.level).toEqual(ComponentLevel.ELEMENT)
    expect(variant.isChild).toBe(false)
    expect(variant.fromSchema).toBe(true)
  })

  it("should return default variant for different component", () => {
    const variant = getDefaultVariant(ComponentId.TAGLINE, WORKSPACE_FIXTURE)

    expect(variant.id).toEqual("variant-tagline-default")
    expect(variant.component).toEqual(ComponentId.TAGLINE)
    expect(variant.level).toEqual(ComponentLevel.PRIMITIVE)
    expect(variant.isChild).toBe(false)
  })

  it("should throw error for non-existent component", () => {
    expect(() => {
      getDefaultVariant(
        "non-existent-component" as ComponentId,
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })
})
