import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { Workspace } from "../../index"
import customTheme from "../../themes/custom"
import { areSiblingNodes } from "./are-sibling-nodes"

describe("areSiblingNodes", () => {
  it("should return true when nodes are siblings", () => {
    const node1 = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    const node2 = WORKSPACE_FIXTURE.byId["child-label-wCHRir3I"]!
    const result = areSiblingNodes(node1, node2, WORKSPACE_FIXTURE)
    expect(result).toBe(true)
  })

  it("should return false when nodes are not siblings", () => {
    const node1 = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    const node2 = WORKSPACE_FIXTURE.byId["child-icon-MAFDy9IN"]!
    const result = areSiblingNodes(node1, node2, WORKSPACE_FIXTURE)
    expect(result).toBe(false)
  })

  it("should return false when nodes are the same", () => {
    const node1 = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    const node2 = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]!
    const result = areSiblingNodes(node1, node2, WORKSPACE_FIXTURE)
    expect(result).toBe(false)
  })

  it("should throw error when parent is not found", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "child-icon-orphan1": {
          id: "child-icon-orphan1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Orphan 1",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
          children: [],
        },
        "child-icon-orphan2": {
          id: "child-icon-orphan2",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Orphan 2",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
          children: [],
        },
      },
      customTheme,
    }

    const node1 = workspace.byId["child-icon-orphan1"]!
    const node2 = workspace.byId["child-icon-orphan2"]!

    expect(() => {
      areSiblingNodes(node1, node2, workspace)
    }).toThrow("Parent not found for node child-icon-orphan1")
  })
})
