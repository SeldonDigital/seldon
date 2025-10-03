import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { InstanceId } from "../../../types"
import { handleAiMoveNode } from "./handle-ai-move-node"

describe("handleAiMoveNode", () => {
  it("should move a child node within the same variant hierarchy with enhanced validation", () => {
    // Check the initial state
    expect(WORKSPACE_FIXTURE.byId["child-button-4eo3qAPb"].children).toEqual([
      "child-icon-MAFDy9IN",
      "child-label-uhhihiiA",
    ])

    expect(WORKSPACE_FIXTURE.byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-LHLzFHuF",
      "child-label-aqt5mR8N",
    ])

    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-MAFDy9IN",
        target: {
          parentId: "child-button-ZvZ8kmVr",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The icon should be moved from child-button-4eo3qAPb to child-button-ZvZ8kmVr
    expect(byId["child-button-4eo3qAPb"].children).toEqual([
      "child-label-uhhihiiA",
    ])
    expect(byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-MAFDy9IN",
      "child-icon-LHLzFHuF",
      "child-label-aqt5mR8N",
    ])
  })

  it("should move a child node to a specific index within the target parent", () => {
    // Check the initial state
    expect(WORKSPACE_FIXTURE.byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-LHLzFHuF",
      "child-label-aqt5mR8N",
    ])

    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-MAFDy9IN",
        target: {
          parentId: "child-button-ZvZ8kmVr",
          index: 1,
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The icon should be moved to index 1 in child-button-ZvZ8kmVr
    expect(byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-LHLzFHuF",
      "child-icon-MAFDy9IN",
      "child-label-aqt5mR8N",
    ])
  })

  it("should move a child node to index 0 when no index is specified", () => {
    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-MAFDy9IN",
        target: {
          parentId: "child-button-ZvZ8kmVr",
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The icon should be moved to index 0 (default) in child-button-ZvZ8kmVr
    expect(byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-MAFDy9IN",
      "child-icon-LHLzFHuF",
      "child-label-aqt5mR8N",
    ])
  })

  it("should propagate a move operation to all instances", () => {
    // Check initial button variant structure (the source of truth)
    expect(WORKSPACE_FIXTURE.byId["variant-button-default"].children).toEqual([
      "child-icon-K3GlMKHA", // Icon at first position
      "child-label-wCHRir3I", // Label at second position
    ])

    // Check initial button instances in button bar
    expect(WORKSPACE_FIXTURE.byId["child-button-4eo3qAPb"].children).toEqual([
      "child-icon-MAFDy9IN", // Instance of child-icon-K3GlMKHA
      "child-label-uhhihiiA", // Instance of child-label-wCHRir3I
    ])
    expect(WORKSPACE_FIXTURE.byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-LHLzFHuF", // Instance of child-icon-K3GlMKHA
      "child-label-aqt5mR8N", // Instance of child-label-wCHRir3I
    ])

    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-K3GlMKHA",
        target: {
          parentId: "variant-button-default",
          index: 1, // Move icon to second position
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The button variant should now have the icon moved to second position
    expect(byId["variant-button-default"].children).toEqual([
      "child-label-wCHRir3I", // Label now at first position
      "child-icon-K3GlMKHA", // Icon now at second position
    ])

    // The button instances should also have their icons moved to second position
    expect(byId["child-button-4eo3qAPb"].children).toEqual([
      "child-label-uhhihiiA", // Label now at first position
      "child-icon-MAFDy9IN", // Icon now at second position
    ])
    expect(byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-label-aqt5mR8N", // Label now at first position
      "child-icon-LHLzFHuF", // Icon now at second position
    ])
  })

  it("should not move a variant node (only instances can be moved)", () => {
    const result = handleAiMoveNode(
      {
        nodeId: "variant-button-default",
        target: {
          parentId: "variant-barButtons-default",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The workspace should remain unchanged since variants cannot be moved
    expect(result).toEqual(WORKSPACE_FIXTURE)
  })

  it("should handle moving a node that is already at the target location", () => {
    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-MAFDy9IN",
        target: {
          parentId: "child-button-4eo3qAPb",
          index: 0,
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The workspace should remain the same since the icon is already at index 0
    expect(byId["child-button-4eo3qAPb"].children).toEqual([
      "child-icon-MAFDy9IN",
      "child-label-uhhihiiA",
    ])
  })

  it("should handle moving a node to the end of the children array when index is beyond array length", () => {
    const { byId } = handleAiMoveNode(
      {
        nodeId: "child-icon-MAFDy9IN",
        target: {
          parentId: "child-button-ZvZ8kmVr",
          index: 10, // Beyond the current children array length
        },
      },
      WORKSPACE_FIXTURE,
    )

    // The icon should be moved to the end of the children
    expect(byId["child-button-ZvZ8kmVr"].children).toEqual([
      "child-icon-LHLzFHuF",
      "child-label-aqt5mR8N",
      "child-icon-MAFDy9IN",
    ])
  })

  it("should handle moving a non-existent node", () => {
    expect(() => {
      handleAiMoveNode(
        {
          nodeId: "child-nonexistent-12345" as InstanceId,
          target: {
            parentId: "child-button-ZvZ8kmVr",
            index: 0,
          },
        },
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })

  it("should handle moving to a non-existent parent", () => {
    expect(() => {
      handleAiMoveNode(
        {
          nodeId: "child-icon-MAFDy9IN",
          target: {
            parentId: "child-nonexistent-67890" as InstanceId,
            index: 0,
          },
        },
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })
})
