import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { handleDuplicateNode } from "./handle-duplicate-node"

describe("handleDuplicateNode", () => {
  it("should create a copy of a child node and add it to the parent's children array", () => {
    const initialCount = Object.values(WORKSPACE_FIXTURE.byId).length

    const { byId } = handleDuplicateNode(
      {
        nodeId: "child-icon-K3GlMKHA",
      },
      WORKSPACE_FIXTURE,
    )

    const finalCount = Object.values(byId).length

    // The duplicate function adds the child and all its instances
    // Based on the actual behavior, it adds 7 new nodes
    expect(finalCount).toEqual(initialCount + 7)

    // 1 child has been added to the default button
    expect(byId["variant-button-default"].children!.length).toEqual(3)

    // A new icon child should have been added
    const children = byId["variant-button-default"].children!
    const iconChildren = children.filter(
      (childId) => byId[childId].component === "icon",
    )

    // Should have 2 icon children now (original + duplicate)
    expect(iconChildren.length).toEqual(2)

    // The new icon should be a child
    const newIconId = iconChildren.find(
      (childId) => childId !== "child-icon-K3GlMKHA",
    )
    expect(newIconId).toBeDefined()
    expect(byId[newIconId!].isChild).toBe(true)
  })

  it("should duplicate a variant node and add it to the board", () => {
    const initialVariantCount = WORKSPACE_FIXTURE.boards.button.variants.length

    const { byId, boards } = handleDuplicateNode(
      {
        nodeId: "variant-button-default",
      },
      WORKSPACE_FIXTURE,
    )

    // Should add a new variant to the button board
    expect(boards.button.variants.length).toEqual(initialVariantCount + 1)

    // The new variant should be at the end of the variants array
    const newVariantId =
      boards.button.variants[boards.button.variants.length - 1]
    expect(newVariantId).toBeDefined()
    expect(byId[newVariantId]).toBeDefined()
    expect(byId[newVariantId].component).toEqual(ComponentId.BUTTON)
    if ("type" in byId[newVariantId]) {
      expect(byId[newVariantId].type).toEqual("userVariant")
    }
  })

  it("should duplicate a node with properties", () => {
    const { byId } = handleDuplicateNode(
      {
        nodeId: "child-icon-K3GlMKHA",
      },
      WORKSPACE_FIXTURE,
    )

    // Find the new duplicated child
    const newChildId = byId["variant-button-default"].children![2]
    const newChild = byId[newChildId]

    // Should have the same properties as the original
    expect(newChild.properties).toEqual(byId["child-icon-K3GlMKHA"].properties)
  })

  it("should handle duplicating a node with children", () => {
    const { byId } = handleDuplicateNode(
      {
        nodeId: "child-button-4eo3qAPb",
      },
      WORKSPACE_FIXTURE,
    )

    // Find the new duplicated child
    const newChildId = byId["child-barButtons-YwByDTnU"].children![3] // Should be the 4th child
    const newChild = byId[newChildId]

    // Should have children
    expect(newChild.children).toBeDefined()
    expect(newChild.children!.length).toBeGreaterThan(0)

    // Each child should be duplicated as well
    newChild.children!.forEach((childId) => {
      expect(byId[childId]).toBeDefined()
      expect(byId[childId].isChild).toBe(true)
    })
  })
})
