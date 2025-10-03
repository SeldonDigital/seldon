import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import {
  ValidationOptions,
  validateCircularDependencies,
  validateComponentLevels,
  validateComponentSchema,
  validateCoreOperation,
} from "./validation"

describe("validation", () => {
  it("should validate component schema correctly", () => {
    const validResult = validateComponentSchema(ComponentId.BUTTON)
    expect(validResult.isValid).toBe(true)
    expect(validResult.errors).toHaveLength(0)

    // Test with invalid component ID
    const invalidResult = validateComponentSchema(
      "invalid-component" as ComponentId,
    )
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.errors.length).toBeGreaterThan(0)
  })

  it("should validate component levels correctly", () => {
    // Test valid parent-child relationship
    const validResult = validateComponentLevels(
      ComponentId.BUTTON,
      ComponentId.LABEL,
    )
    expect(validResult.isValid).toBe(true)

    // Test with validation disabled
    const disabledResult = validateComponentLevels(
      ComponentId.BUTTON,
      ComponentId.LABEL,
      { validateLevels: false },
    )
    expect(disabledResult.isValid).toBe(true)
  })

  it("should validate circular dependencies", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    // Test with validation disabled
    const disabledResult = validateCircularDependencies(
      ComponentId.BUTTON,
      ComponentId.LABEL,
      workspace,
      { checkCircularDependencies: false },
    )
    expect(disabledResult.isValid).toBe(true)

    // Test with validation enabled (should pass for non-circular case)
    const enabledResult = validateCircularDependencies(
      ComponentId.BUTTON,
      ComponentId.LABEL,
      workspace,
      { checkCircularDependencies: true },
    )
    expect(enabledResult.isValid).toBe(true)
  })

  it("should validate add_board operation", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    // Test valid add_board operation
    const validResult = validateCoreOperation(
      "add_board",
      { componentId: ComponentId.BUTTON },
      workspace,
      { isAiOperation: true },
    )
    expect(validResult.isValid).toBe(true)

    // Test with existing board (should warn but still be valid)
    const workspaceWithBoard: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          label: "Button",
          id: ComponentId.BUTTON,
          properties: {},
          theme: "default",
          variants: ["variant-button-default"],
          order: 0,
        },
      },
      byId: {},
      customTheme,
    }

    const existingBoardResult = validateCoreOperation(
      "add_board",
      { componentId: ComponentId.BUTTON },
      workspaceWithBoard,
      { isAiOperation: true },
    )
    expect(existingBoardResult.isValid).toBe(true)
    expect(existingBoardResult.warnings.length).toBeGreaterThan(0)
  })

  it("should validate add_variant operation", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          label: "Button",
          id: ComponentId.BUTTON,
          properties: {},
          theme: "default",
          variants: ["variant-button-default"],
          order: 0,
        },
      },
      byId: {},
      customTheme,
    }

    // Test valid add_variant operation
    const validResult = validateCoreOperation(
      "add_variant",
      { componentId: ComponentId.BUTTON },
      workspace,
      { isAiOperation: true },
    )
    expect(validResult.isValid).toBe(true)

    // Test with missing board
    const emptyWorkspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const invalidResult = validateCoreOperation(
      "add_variant",
      { componentId: ComponentId.BUTTON },
      emptyWorkspace,
      { isAiOperation: true },
    )
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.errors.length).toBeGreaterThan(0)
  })

  it("should validate insert_node operation", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          label: "Button",
          id: ComponentId.BUTTON,
          properties: {},
          theme: "default",
          variants: ["variant-button-default"],
          order: 0,
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
      customTheme,
    }

    // Test valid insert_node operation
    const validResult = validateCoreOperation(
      "insert_node",
      {
        nodeId: "variant-button-default",
        target: { parentId: "variant-button-default", index: 0 },
      },
      workspace,
      { isAiOperation: true },
    )
    expect(validResult.isValid).toBe(true)

    // Test with missing source node
    const invalidResult = validateCoreOperation(
      "insert_node",
      {
        nodeId: "missing-node",
        target: { parentId: "variant-button-default", index: 0 },
      },
      workspace,
      { isAiOperation: true },
    )
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.errors.length).toBeGreaterThan(0)
  })

  it("should handle AI operation validation options", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const aiOptions: ValidationOptions = {
      isAiOperation: true,
      strict: true,
      checkCircularDependencies: true,
      validateSchemas: true,
      validateLevels: true,
    }

    const result = validateCoreOperation(
      "add_board",
      { componentId: ComponentId.BUTTON },
      workspace,
      aiOptions,
    )
    expect(result.isValid).toBe(true)
  })

  it("should handle validation errors gracefully", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    // Test with invalid operation
    const invalidOperationResult = validateCoreOperation(
      "invalid_operation" as any,
      {},
      workspace,
      { isAiOperation: true },
    )
    expect(invalidOperationResult.isValid).toBe(false)
    expect(invalidOperationResult.errors.length).toBeGreaterThan(0)
  })
})
