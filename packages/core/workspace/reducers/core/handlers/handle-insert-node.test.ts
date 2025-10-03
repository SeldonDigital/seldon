import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { Instance } from "../../../types"
import { handleInsertNode } from "./handle-insert-node"

describe("handleInsertNode", () => {
  it("should insert a variant as a child of another variant and update all instances that reference it", () => {
    // Check initial state
    expect(WORKSPACE_FIXTURE.byId["variant-button-default"].children).toEqual([
      "child-icon-K3GlMKHA",
      "child-label-wCHRir3I",
    ])

    const { byId } = handleInsertNode(
      {
        nodeId: "variant-icon-default",
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
    expect(newButtonIcon.isChild).toBe(true)
    if ("variant" in newButtonIcon) {
      expect(newButtonIcon.variant).toBe("variant-icon-default")
    }

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
    const { byId } = handleInsertNode(
      {
        nodeId: "variant-icon-default",
        target: {
          parentId: "variant-button-default",
          index: 1,
        },
      },
      WORKSPACE_FIXTURE,
    )

    const buttonNode = byId["variant-button-default"]
    const insertedNodeId = buttonNode.children![1]
    const insertedNode = byId[insertedNodeId]
    if ("variant" in insertedNode) {
      expect(insertedNode.variant).toBe("variant-icon-default")
    }
  })

  it("should insert a node at the end when index is beyond array length", () => {
    const { byId } = handleInsertNode(
      {
        nodeId: "variant-icon-default",
        target: {
          parentId: "variant-button-default",
          index: 10,
        },
      },
      WORKSPACE_FIXTURE,
    )

    const buttonNode = byId["variant-button-default"]
    const lastNodeId = buttonNode.children![buttonNode.children!.length - 1]
    const lastNode = byId[lastNodeId]
    if ("variant" in lastNode) {
      expect(lastNode.variant).toBe("variant-icon-default")
    }
  })

  it("should handle inserting a node that is already a child", () => {
    const { byId } = handleInsertNode(
      {
        nodeId: "child-icon-K3GlMKHA",
        target: {
          parentId: "variant-button-default",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    const buttonNode = byId["variant-button-default"]
    // Should create a new instance of the existing child
    expect(buttonNode.children).toHaveLength(3)

    // The new instance should be at index 0
    const newInstanceId = buttonNode.children![0]
    const newInstance = byId[newInstanceId]
    if ("variant" in newInstance) {
      expect(newInstance.variant).toBe("variant-icon-default")
    }

    // The original child should still exist but at a different position
    expect(buttonNode.children).toContain("child-icon-K3GlMKHA")
  })
})
