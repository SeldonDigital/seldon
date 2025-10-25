import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getNodeProperties } from "./get-node-properties"

describe("getNodeProperties", () => {
  it("should return properties for board", () => {
    const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]!
    const properties = getNodeProperties(board, WORKSPACE_FIXTURE)

    expect(properties).toBeDefined()
    expect(typeof properties).toBe("object")
  })

  it("should return properties for variant", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    const properties = getNodeProperties(variant, WORKSPACE_FIXTURE)

    expect(properties).toBeDefined()
    expect(typeof properties).toBe("object")
  })

  it("should return properties for instance", () => {
    const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    const properties = getNodeProperties(instance, WORKSPACE_FIXTURE)

    expect(properties).toBeDefined()
    expect(typeof properties).toBe("object")
  })

  it("should merge properties from schema and node", () => {
    const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]!
    const properties = getNodeProperties(variant, WORKSPACE_FIXTURE)

    expect(properties).toBeDefined()
    expect(typeof properties).toBe("object")
  })

  it("should handle invalid component IDs gracefully", () => {
    const nodeWithInvalidComponent = {
      id: "test-invalid-component",
      component: "invalid-component" as any,
      level: ComponentLevel.ELEMENT,
      label: "Test",
      isChild: false,
      fromSchema: true,
      theme: null,
      type: "defaultVariant" as const,
      properties: {
        color: { type: "exact" as const, value: "#ff0000" },
      },
      children: [],
    }

    const properties = getNodeProperties(
      nodeWithInvalidComponent,
      WORKSPACE_FIXTURE,
    )

    // Should return the node's properties without throwing an error
    expect(properties).toEqual({
      color: { type: "exact", value: "#ff0000" },
    })
  })
})
