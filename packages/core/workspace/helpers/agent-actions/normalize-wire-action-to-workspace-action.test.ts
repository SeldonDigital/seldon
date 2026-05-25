import { describe, expect, it } from "bun:test"
import { ComponentId } from "@seldon/core/components/constants"
import { normalizeWireActionToWorkspaceAction } from "./normalize-wire-action-to-workspace-action"

describe("normalizeWireActionToWorkspaceAction", () => {
  it("returns null for skipped ai helper types", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_return_searched_components",
        payload: {},
      }),
    ).toBeNull()
  })

  it("maps ai_add_component to add_component", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_add_component",
        payload: { componentId: ComponentId.BUTTON },
      }),
    ).toEqual({
      type: "add_component",
      payload: { componentId: ComponentId.BUTTON },
    })
  })

  it("maps ai_remove_component to remove_component", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_remove_component",
        payload: { componentId: ComponentId.BUTTON },
      }),
    ).toEqual({
      type: "remove_component",
      payload: { componentId: ComponentId.BUTTON },
    })
  })

  it("maps ai_set_node_properties by stripping the prefix", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_set_node_properties",
        payload: { nodeId: "n1", properties: {} },
      }),
    ).toEqual({
      type: "set_node_properties",
      payload: { nodeId: "n1", properties: {} },
    })
  })

  it("passes through unified actions unchanged", () => {
    const action = {
      type: "set_node_properties",
      payload: { nodeId: "n1", properties: {} },
    }
    expect(normalizeWireActionToWorkspaceAction(action)).toBe(action)
  })

  it("maps ai_insert_node to insert_variant_instance", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_insert_node",
        payload: {
          nodeId: "variant-button-default",
          target: { parentId: "parent-1", index: 0 },
        },
      }),
    ).toEqual({
      type: "insert_variant_instance",
      payload: {
        variantId: "variant-button-default",
        target: { parentId: "parent-1", index: 0 },
      },
    })
  })

  it("maps ai_remove_node to remove_instance", () => {
    expect(
      normalizeWireActionToWorkspaceAction({
        type: "ai_remove_node",
        payload: { nodeId: "child-1" },
      }),
    ).toEqual({
      type: "remove_instance",
      payload: { instanceId: "child-1" },
    })
  })
})
