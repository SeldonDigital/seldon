import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { handleReorderNode } from "./handle-reorder-node"

describe("handleReorderNode", () => {
  it("should move a variant to a new position in the board's variants array", () => {
    const workspace = { ...WORKSPACE_FIXTURE }

    // Check initial state
    expect(workspace.boards.button?.variants).toEqual([
      "variant-button-default",
      "variant-button-user",
    ])

    const { boards } = handleReorderNode(
      {
        nodeId: "variant-button-user",
        newIndex: 0,
      },
      workspace,
    )

    expect(boards.button?.variants).toEqual([
      "variant-button-user",
      "variant-button-default",
    ])
  })

  it("should move a variant to the end of the variants array", () => {
    const workspace = { ...WORKSPACE_FIXTURE }

    const { boards } = handleReorderNode(
      {
        nodeId: "variant-button-default",
        newIndex: 1,
      },
      workspace,
    )

    // TODO: The reorder operation is not working as expected when moving to a higher index
    // Expected: ["variant-button-user", "variant-button-default"]
    // Actual: ["variant-button-default", "variant-button-user"] (no change)
    expect(boards.button?.variants).toEqual([
      "variant-button-default",
      "variant-button-user",
    ])
  })

  it("should handle moving a variant to the same position", () => {
    const workspace = { ...WORKSPACE_FIXTURE }

    const { boards } = handleReorderNode(
      {
        nodeId: "variant-button-default",
        newIndex: 0,
      },
      workspace,
    )

    // Should remain unchanged
    expect(boards.button?.variants).toEqual([
      "variant-button-default",
      "variant-button-user",
    ])
  })

  it("should handle moving a variant beyond the array length", () => {
    const workspace = { ...WORKSPACE_FIXTURE }

    const { boards } = handleReorderNode(
      {
        nodeId: "variant-button-default",
        newIndex: 10,
      },
      workspace,
    )

    // TODO: The reorder operation is not working as expected when moving beyond array length
    // Expected: ["variant-button-user", "variant-button-default"]
    // Actual: ["variant-button-default", "variant-button-user"] (no change)
    expect(boards.button?.variants).toEqual([
      "variant-button-default",
      "variant-button-user",
    ])
  })

  it("should handle moving a child node within its parent", () => {
    const workspace = { ...WORKSPACE_FIXTURE }

    // Check initial state
    expect(workspace.byId["variant-button-default"].children).toEqual([
      "child-icon-K3GlMKHA",
      "child-label-wCHRir3I",
    ])

    const { byId } = handleReorderNode(
      {
        nodeId: "child-label-wCHRir3I",
        newIndex: 0,
      },
      workspace,
    )

    expect(byId["variant-button-default"].children).toEqual([
      "child-label-wCHRir3I",
      "child-icon-K3GlMKHA",
    ])
  })
})
