import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { handleAddVariant } from "./handle-add-variant"

describe("handleAddVariant", () => {
  it("should add a variant by duplicating the default variant", () => {
    const currentVariants = [
      ...(WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]?.variants ?? []),
    ]

    const result = handleAddVariant(
      { componentId: ComponentId.BUTTON },
      WORKSPACE_FIXTURE,
    )

    expect(result.boards[ComponentId.BUTTON]?.variants.length).toEqual(
      currentVariants.length + 1,
    )

    // The new variant should be added to the end of the variants array
    const newVariantId =
      result.boards[ComponentId.BUTTON]?.variants[
        result.boards[ComponentId.BUTTON]?.variants.length - 1
      ]
    expect(newVariantId).toBeDefined()
    const newVariant = result.byId[newVariantId!]
    expect(newVariant).toBeDefined()
    expect(newVariant.component).toEqual(ComponentId.BUTTON)
    if ("type" in newVariant) {
      expect(newVariant.type).toEqual("userVariant")
    }
  })

  it("should duplicate the default variant with all its properties", () => {
    const result = handleAddVariant(
      { componentId: ComponentId.BUTTON },
      WORKSPACE_FIXTURE,
    )

    const newVariantId =
      result.boards[ComponentId.BUTTON]?.variants[
        result.boards[ComponentId.BUTTON]?.variants.length - 1
      ]
    const newVariant = result.byId[newVariantId!]
    const defaultVariant = result.byId["variant-button-default"]

    // Should have the same properties as the default variant
    expect(newVariant.properties).toEqual(defaultVariant.properties)
    expect(newVariant.children).toHaveLength(defaultVariant.children!.length)
    expect(newVariant.level).toEqual(defaultVariant.level)

    // Check that the children have the same structure (but different IDs)
    newVariant.children!.forEach((childId, index) => {
      const child = result.byId[childId]
      const originalChild = result.byId[defaultVariant.children![index]]
      expect(child.component).toEqual(originalChild.component)
      expect(child.level).toEqual(originalChild.level)
    })
  })

  it("should handle adding variant to a component with no existing variants", () => {
    const workspace = {
      ...WORKSPACE_FIXTURE,
      boards: {
        ...WORKSPACE_FIXTURE.boards,
        [ComponentId.BUTTON]: {
          ...WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]!,
          variants: [],
        },
      },
    }

    expect(() => {
      handleAddVariant({ componentId: ComponentId.BUTTON }, workspace)
    }).toThrow()
  })

  it("should handle adding variant to a non-existent component", () => {
    expect(() => {
      handleAddVariant({ componentId: ComponentId.AVATAR }, WORKSPACE_FIXTURE)
    }).toThrow()
  })

  it("should create a user variant (not default variant)", () => {
    const result = handleAddVariant(
      { componentId: ComponentId.BUTTON },
      WORKSPACE_FIXTURE,
    )

    const newVariantId =
      result.boards[ComponentId.BUTTON]?.variants[
        result.boards[ComponentId.BUTTON]?.variants.length - 1
      ]
    const newVariant = result.byId[newVariantId!]

    if ("type" in newVariant) {
      expect(newVariant.type).toEqual("userVariant")
    }
    expect(newVariant.fromSchema).toBe(false)
  })

  it("should duplicate children from the default variant", () => {
    const result = handleAddVariant(
      { componentId: ComponentId.BUTTON },
      WORKSPACE_FIXTURE,
    )

    const newVariantId =
      result.boards[ComponentId.BUTTON]?.variants[
        result.boards[ComponentId.BUTTON]?.variants.length - 1
      ]
    const newVariant = result.byId[newVariantId!]

    // Should have the same number of children as the default variant
    expect(newVariant.children).toHaveLength(
      WORKSPACE_FIXTURE.byId["variant-button-default"].children!.length,
    )

    // Each child should be duplicated as well
    newVariant.children?.forEach((childId) => {
      expect(result.byId[childId]).toBeDefined()
      expect(result.byId[childId].isChild).toBe(true)
    })
  })
})
