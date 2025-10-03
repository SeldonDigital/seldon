import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getAllVariants } from "./get-all-variants"

describe("getAllVariants", () => {
  it("should return all variants from the workspace", () => {
    const variants = getAllVariants(WORKSPACE_FIXTURE)

    expect(variants.length).toBeGreaterThan(0)
    expect(variants.every((variant) => variant.isChild === false)).toBe(true)
    expect(variants.every((variant) => variant.id.startsWith("variant-"))).toBe(
      true,
    )
  })

  it("should return variants with correct structure", () => {
    const variants = getAllVariants(WORKSPACE_FIXTURE)
    const buttonVariant = variants.find(
      (v) => v.id === "variant-button-default",
    )

    expect(buttonVariant).toBeDefined()
    expect(buttonVariant!.isChild).toBe(false)
    expect(buttonVariant!.fromSchema).toBe(true)
  })

  it("should include all board variants", () => {
    const variants = getAllVariants(WORKSPACE_FIXTURE)
    const variantIds = variants.map((v) => v.id)

    expect(variantIds).toContain("variant-button-default")
    expect(variantIds).toContain("variant-barButtons-default")
    expect(variantIds).toContain("variant-textblockDetails-default")
  })
})
