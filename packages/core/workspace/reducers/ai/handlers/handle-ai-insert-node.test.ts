import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { Instance, VariantId } from "../../../types"
import { handleAiInsertNode } from "./handle-ai-insert-node"

describe("handleAiInsertNode", () => {
  it("should insert a variant as a child of another variant with enhanced validation", () => {
    const { byId } = handleAiInsertNode(
      {
        nodeId: "variant-icon-default",
        ref: "$insertedIcon",
        target: {
          parentId: "variant-button-default",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    const buttonNode = byId["variant-button-default"]

    // The icon variant should be inserted as the first child of the button variant
    expect(buttonNode.children).toHaveLength(3)

    const newButtonIconId = buttonNode.children![0]
    const newButtonIcon = byId[newButtonIconId]
    // A child node has been added to byId
    expect(newButtonIcon).toBeDefined()

    // An icon should also have been added to the buttons inside the button bar
    const buttonBarButton1Id = byId["variant-barButtons-default"].children![0]
    const buttonBarButton1 = byId[buttonBarButton1Id]
    const buttonBarButton1IconId = buttonBarButton1.children![0]
    const buttonBarButton1Icon = byId[buttonBarButton1IconId] as Instance
    expect(buttonBarButton1Icon).toBeDefined()

    // ButtonBar.Button1.Icon should be an instanceof Button.Icon
    expect(buttonBarButton1Icon.instanceOf).toBe(newButtonIconId)

    const buttonBarButton2Id = byId["variant-barButtons-default"].children![1]
    const buttonBarButton2 = byId[buttonBarButton2Id]
    const buttonBarButton2IconId = buttonBarButton2.children![0]
    const buttonBarButton2Icon = byId[buttonBarButton2IconId] as Instance
    expect(buttonBarButton2Icon).toBeDefined()

    // ButtonBar.Button2.Icon should be an instanceof Button.Icon
    expect(buttonBarButton2Icon.instanceOf).toBe(newButtonIconId)
  })

  it("should insert a node at a specific index", () => {
    const { byId } = handleAiInsertNode(
      {
        nodeId: "variant-icon-default",
        ref: "$insertedIconAtIndex",
        target: {
          parentId: "variant-button-default",
          index: 1,
        },
      },
      WORKSPACE_FIXTURE,
    )

    const buttonNode = byId["variant-button-default"]

    // The icon variant should be inserted at index 1
    expect(buttonNode.children).toHaveLength(3)
    expect(buttonNode.children![1]).toBeDefined()
  })

  it("should handle inserting a non-existent node", () => {
    expect(() => {
      handleAiInsertNode(
        {
          nodeId: "variant-nonexistent-12345" as VariantId,
          ref: "$nonExistent",
          target: {
            parentId: "variant-button-default",
            index: 0,
          },
        },
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })

  it("should handle inserting into a non-existent parent", () => {
    expect(() => {
      handleAiInsertNode(
        {
          nodeId: "variant-icon-default",
          ref: "$insertedIcon",
          target: {
            parentId: "variant-nonexistent-67890" as VariantId,
            index: 0,
          },
        },
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })

  it("should propagate insertion to all instances", () => {
    const { byId } = handleAiInsertNode(
      {
        nodeId: "variant-icon-default",
        ref: "$propagatedIcon",
        target: {
          parentId: "variant-button-default",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    // Check that the insertion was propagated to button bar instances
    const buttonBarButton1Id = byId["variant-barButtons-default"].children![0]
    const buttonBarButton1 = byId[buttonBarButton1Id]
    expect(buttonBarButton1.children).toHaveLength(3)

    const buttonBarButton2Id = byId["variant-barButtons-default"].children![1]
    const buttonBarButton2 = byId[buttonBarButton2Id]
    expect(buttonBarButton2.children).toHaveLength(3)
  })
})
