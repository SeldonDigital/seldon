import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { InstanceId, VariantId } from "../types"
import { getNodeIdAddedByAction } from "./get-node-id-added-by-action"

describe("getNodeIdAddedByAction", () => {
  it("should return node ID from add_board action", () => {
    const action = {
      type: "add_board" as const,
      payload: {
        componentId: ComponentId.BUTTON,
        target: {
          parentId: "variant-button-default",
          index: 0,
        },
      },
    }

    expect(getNodeIdAddedByAction(action, WORKSPACE_FIXTURE)).toBe(
      "variant-button-user",
    )
  })

  it("should return node ID from add_variant action", () => {
    const action = {
      type: "add_variant" as const,
      payload: {
        componentId: ComponentId.BUTTON,
      },
    }

    expect(getNodeIdAddedByAction(action, WORKSPACE_FIXTURE)).toBe(
      "variant-button-user",
    )
  })

  it("should return node ID from insert_node action", () => {
    const action = {
      type: "insert_node" as const,
      payload: {
        nodeId: "child-icon-K3GlMKHA" as InstanceId,
        target: {
          parentId: "variant-button-default" as VariantId,
          index: 0,
        },
      },
    }

    expect(getNodeIdAddedByAction(action, WORKSPACE_FIXTURE)).toBe(
      "child-icon-K3GlMKHA",
    )
  })

  it("should return node ID from duplicate_node action", () => {
    const action = {
      type: "duplicate_node" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
      },
    }

    expect(getNodeIdAddedByAction(action, WORKSPACE_FIXTURE)).toBe(
      "variant-button-user",
    )
  })

  it("should throw error for unsupported action type", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    expect(() => {
      getNodeIdAddedByAction(action, WORKSPACE_FIXTURE)
    }).toThrow("Action type set_node_properties does not create a new node")
  })
})
