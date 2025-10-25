import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { migrations } from "./index"

// Test workspace with missing structure (should trigger migration)
const emptyWorkspace = {
  version: 0,
} as any

// Test workspace with partial structure (should trigger migration)
const partialWorkspace: Workspace = {
  version: 0,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      label: "Button",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Default",
      theme: "default",
      properties: {},
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
    },
  },
  // Missing customTheme
}

// Test workspace that's already valid (should not be changed)
const validWorkspace: Workspace = {
  version: 1,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      label: "Button",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Default",
      theme: "default",
      properties: {},
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      children: [],
    },
  },
  customTheme,
}

describe("Baseline Migration", () => {
  it("should initialize completely empty workspace", () => {
    const migration = migrations.find((m) => m.version === 1)!
    const result = migration.migrate(emptyWorkspace)

    expect(result.boards).toEqual({})
    expect(result.byId).toEqual({})
    expect(result.customTheme).toEqual(customTheme)
    expect(result.version).toBe(0) // Version should remain unchanged by migration
  })

  it("should initialize missing workspace structure", () => {
    const migration = migrations.find((m) => m.version === 1)!
    const result = migration.migrate(partialWorkspace)

    // Should preserve existing structure
    expect(result.boards).toEqual(partialWorkspace.boards)

    // Should add missing customTheme
    expect(result.customTheme).toEqual(customTheme)

    // Should ensure all nodes have required properties
    const node = result.byId["variant-button-default"]
    expect(node.properties).toBeDefined()
    expect(node.children).toBeDefined()
    expect(node.children).toEqual([]) // Should be initialized to empty array

    // Should ensure all boards have required properties
    const board = result.boards[ComponentId.BUTTON]
    expect(board.properties).toBeDefined()
    expect(board.variants).toBeDefined()
    expect(board.order).toBe(0)
    expect(board.theme).toBe("default")
  })

  it("should not modify already valid workspaces", () => {
    const migration = migrations.find((m) => m.version === 1)!
    const result = migration.migrate(validWorkspace)

    // Should be identical to input
    expect(result).toEqual(validWorkspace)
  })

  it("should handle nodes with missing properties", () => {
    const workspaceWithMissingProps: Workspace = {
      version: 0,
      boards: {},
      byId: {
        "node-without-props": {
          id: "node-without-props",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Test",
          theme: "default",
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          // Missing properties and children
        } as any,
      },
      customTheme,
    }

    const migration = migrations.find((m) => m.version === 1)!
    const result = migration.migrate(workspaceWithMissingProps)

    const node = result.byId["node-without-props"]
    expect(node.properties).toEqual({})
    expect(node.children).toEqual([])
  })

  it("should handle boards with missing properties", () => {
    const workspaceWithMissingBoardProps: Workspace = {
      version: 0,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          // Missing other required properties
        } as any,
      },
      byId: {},
      customTheme,
    }

    const migration = migrations.find((m) => m.version === 1)!
    const result = migration.migrate(workspaceWithMissingBoardProps)

    const board = result.boards[ComponentId.BUTTON]
    expect(board.properties).toEqual({})
    expect(board.variants).toEqual([])
    expect(board.order).toBe(0)
    expect(board.theme).toBe("default")
  })
})
