import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComputedFunction, Unit, ValueType } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { WORKSPACE_FIXTURE } from "@seldon/core/helpers/fixtures/workspace"
import testTheme from "@seldon/core/themes/test/test-theme"
import { buildContext, computeWorkspace } from "./compute-workspace"

describe("computeWorkspace", () => {
  it("should compute properties for all nodes in workspace", () => {
    const result = computeWorkspace(WORKSPACE_FIXTURE)

    expect(result).toBeDefined()
    expect(result.version).toBe(WORKSPACE_FIXTURE.version)
    expect(result.customTheme).toBe(WORKSPACE_FIXTURE.customTheme)
    expect(result.boards).toEqual(WORKSPACE_FIXTURE.boards)

    // Verify that all nodes have computed properties
    const nodeIds = Object.keys(result.byId)
    expect(nodeIds.length).toBeGreaterThan(0)

    // Check that properties are computed for each node
    for (const nodeId of nodeIds) {
      expect(result.byId[nodeId]).toBeDefined()
      expect(result.byId[nodeId].properties).toBeDefined()
    }
  })

  it("should compute computed properties with auto fit function", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            font: {
              size: {
                type: ValueType.EXACT,
                value: { unit: Unit.REM, value: 2 },
              },
            },
            size: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#font.size",
                  factor: 1.5,
                },
              },
            },
          },
          children: [],
        },
      },
    }

    const result = computeWorkspace(workspace)

    expect(result).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()

    // The computed property should be resolved to an exact value
    const size = result.byId["variant-button-default"].properties.size
    expect(size).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 3 }, // 2 * 1.5
    })
  })

  it("should handle workspace with parent-child relationships and property inheritance", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icons",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            font: {
              size: {
                type: ValueType.EXACT,
                value: { unit: Unit.REM, value: 1.5 },
              },
            },
          },
          children: ["child-icon-1"],
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          type: "defaultVariant",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {
            size: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.font.size",
                  factor: 0.8,
                },
              },
            },
          },
          children: [],
        },
      },
    }

    const result = computeWorkspace(workspace)

    expect(result).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()
    expect(result.byId["child-icon-1"]).toBeDefined()

    // The child's computed property should be resolved based on parent
    const childSize = result.byId["child-icon-1"].properties.size
    expect(childSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.2 }, // 1.5 * 0.8
    })
  })

  it("should handle empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {},
      byId: {},
    }

    const result = computeWorkspace(emptyWorkspace)

    expect(result).toBeDefined()
    expect(result.version).toBe(1)
    expect(result.customTheme).toBe(testTheme)
    expect(result.boards).toEqual({})
    expect(result.byId).toEqual({})
  })

  it("should preserve workspace structure", () => {
    const result = computeWorkspace(WORKSPACE_FIXTURE)

    expect(result.version).toBe(WORKSPACE_FIXTURE.version)
    expect(result.customTheme).toBe(WORKSPACE_FIXTURE.customTheme)
    expect(result.boards).toEqual(WORKSPACE_FIXTURE.boards)

    // Verify that all original nodes are preserved
    const originalNodeIds = Object.keys(WORKSPACE_FIXTURE.byId)
    const resultNodeIds = Object.keys(result.byId)
    expect(resultNodeIds).toEqual(originalNodeIds)

    // Verify that node structure is preserved
    for (const nodeId of originalNodeIds) {
      const originalNode = WORKSPACE_FIXTURE.byId[nodeId]
      const resultNode = result.byId[nodeId]

      expect(resultNode.id).toBe(originalNode.id)
      expect(resultNode.component).toBe(originalNode.component)
      expect(resultNode.level).toBe(originalNode.level)
      expect(resultNode.children).toEqual(originalNode.children)
    }
  })

  it("should handle theme categorical properties", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.custom1",
            },
          },
          children: [],
        },
      },
    }

    const result = computeWorkspace(workspace)

    expect(result).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()

    // Theme categorical properties should remain as theme values
    const color = result.byId["variant-button-default"].properties.color
    expect(color.type).toBe(ValueType.THEME_CATEGORICAL)
    expect(color.value).toBe("@swatch.custom1")
  })

  it("should handle invalid computed property references gracefully", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            size: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#nonExistentProperty",
                  factor: 1.5,
                },
              },
            },
          },
          children: [],
        },
      },
    }

    // Should throw an error for invalid property references
    expect(() => {
      computeWorkspace(workspace)
    }).toThrow("Based on value not found for #nonExistentProperty.")
  })

  it("should handle workspace with null custom theme gracefully", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: null as any,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    // Should not throw error, but handle gracefully
    const result = computeWorkspace(workspace)
    expect(result).toBeDefined()
    expect(result.version).toBe(1)
    expect(result.customTheme).toBeNull()
  })

  it("should handle workspace with malformed properties gracefully", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            color: {
              type: "invalid-type" as any,
              value: "invalid-value",
            },
            fontSize: {
              type: ValueType.EXACT,
              value: "not-a-number" as any,
            },
          },
          children: [],
        },
      },
    }

    // Should not throw error, but handle gracefully
    const result = computeWorkspace(workspace)
    expect(result).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()
  })

  it("should throw error for circular parent-child references", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {
            size: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.size", // References itself through parent
                  factor: 1.5,
                },
              },
            },
          },
          children: ["child-button-1"],
        },
        "child-button-1": {
          id: "child-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button Child",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-button-default",
          instanceOf: "variant-button-default",
          properties: {
            size: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.size", // Creates circular reference
                  factor: 0.8,
                },
              },
            },
          },
          children: [],
        },
      },
    }

    // Should throw error for missing computed values
    expect(() => {
      computeWorkspace(workspace)
    }).toThrow("Based on value not found for #parent.size.")
  })
})

describe("buildContext", () => {
  it("should build context for a node with no parent", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    const node = workspace.byId["variant-button-default"]
    const context = buildContext(node, workspace)

    expect(context).toBeDefined()
    expect(context.properties).toBeDefined()
    expect(context.parentContext).toBeNull()
    expect(context.theme).toBeDefined()
    expect(context.theme.id).toBe("default")
  })

  it("should build context for a child node with parent", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icons",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: ["child-icon-1"],
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          type: "defaultVariant",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
          children: [],
        },
      },
    }

    const childNode = workspace.byId["child-icon-1"]
    const context = buildContext(childNode, workspace)

    expect(context).toBeDefined()
    expect(context.properties).toBeDefined()
    expect(context.parentContext).toBeDefined()
    expect(context.parentContext?.properties).toBeDefined()
    expect(context.parentContext?.parentContext).toBeNull()
    expect(context.theme).toBeDefined()
    expect(context.theme.id).toBe("default")
  })

  it("should handle nested parent-child relationships", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme: testTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icons",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
        [ComponentId.LABEL]: {
          id: ComponentId.LABEL,
          label: "Labels",
          order: 2,
          theme: "default",
          properties: {},
          variants: ["variant-label-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: ["child-icon-1"],
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          type: "defaultVariant",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
        "variant-label-default": {
          id: "variant-label-default",
          type: "defaultVariant",
          component: ComponentId.LABEL,
          level: ComponentLevel.PRIMITIVE,
          label: "Label",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
          children: ["child-label-1"],
        },
        "child-label-1": {
          id: "child-label-1",
          component: ComponentId.LABEL,
          level: ComponentLevel.PRIMITIVE,
          label: "Label",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-label-default",
          instanceOf: "variant-label-default",
          properties: {},
          children: [],
        },
      },
    }

    const grandchildNode = workspace.byId["child-label-1"]
    const context = buildContext(grandchildNode, workspace)

    expect(context).toBeDefined()
    expect(context.properties).toBeDefined()
    expect(context.parentContext).toBeDefined()
    expect(context.parentContext?.parentContext).toBeDefined()
    expect(context.parentContext?.parentContext?.parentContext).toBeNull()
    expect(context.theme).toBeDefined()
    expect(context.theme.id).toBe("default")
  })
})
