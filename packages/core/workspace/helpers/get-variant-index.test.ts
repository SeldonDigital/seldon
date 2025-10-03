import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getVariantIndex } from "./get-variant-index"

describe("getVariantIndex", () => {
  it("should return correct index for variant", () => {
    const index = getVariantIndex("variant-button-default", WORKSPACE_FIXTURE)
    expect(index).toEqual(0)
  })

  it("should return correct index for second variant", () => {
    const index = getVariantIndex("variant-button-user", WORKSPACE_FIXTURE)
    expect(index).toEqual(1)
  })

  it("should return correct index for different component variant", () => {
    const index = getVariantIndex("variant-tagline-default", WORKSPACE_FIXTURE)
    expect(index).toEqual(0)
  })

  it("should throw error for non-existent variant", () => {
    expect(() => {
      getVariantIndex("variant-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
