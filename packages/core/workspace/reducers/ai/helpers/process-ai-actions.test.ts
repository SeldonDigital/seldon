import { describe, expect, it } from "bun:test"
import {
  ComponentId,
  ComponentLevel,
  Properties,
  Unit,
  ValueType,
} from "../../../../index"
import customTheme from "../../../../themes/custom"
import { ReferenceId, Workspace } from "../../../types"
import { processAiActions } from "./process-ai-actions"

describe("processAiActions", () => {
  it("should process a simple ai_add_component action", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const actions = [
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$button" as const,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should create a new button board
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.boards[ComponentId.BUTTON].id).toEqual(ComponentId.BUTTON)
    expect(result.boards[ComponentId.BUTTON].variants).toHaveLength(1)

    // Should create the default variant
    const variantId = result.boards[ComponentId.BUTTON].variants[0]
    expect(result.byId[variantId]).toBeDefined()
    expect(result.byId[variantId].component).toEqual(ComponentId.BUTTON)
    expect(result.byId[variantId].level).toEqual(ComponentLevel.ELEMENT)
  })

  it("should skip ai_add_component for existing components", () => {
    const existingVariantId = "variant-button-default"
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: [existingVariantId],
        },
      },
      byId: {
        [existingVariantId]: {
          id: existingVariantId,
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          theme: "default",
          component: ComponentId.BUTTON,
          properties: {},
          children: [],
        },
      },
    }

    const actions = [
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$button" as const,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should not create duplicate board
    expect(result.boards[ComponentId.BUTTON].variants).toEqual([
      existingVariantId,
    ])
    expect(result.byId[existingVariantId]).toEqual(
      workspace.byId[existingVariantId],
    )
  })

  it("should handle ai_add_variant actions", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
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
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          theme: "default",
          component: ComponentId.BUTTON,
          properties: {},
          children: [],
        },
      },
    }

    const actions = [
      {
        type: "ai_add_variant" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$buttonVariant" as const,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should add a new variant to the button board
    expect(result.boards[ComponentId.BUTTON].variants).toHaveLength(2)

    // Should create the new variant
    const newVariantId = result.boards[ComponentId.BUTTON].variants[1]
    expect(result.byId[newVariantId]).toBeDefined()
    expect(result.byId[newVariantId].component).toEqual(ComponentId.BUTTON)
    if ("type" in result.byId[newVariantId]) {
      expect(result.byId[newVariantId].type).toEqual("userVariant")
    }
  })

  it("should process multiple actions in sequence", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const actions = [
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$button" as const,
        },
      },
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.LABEL,
          ref: "$label" as const,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should create both components
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.boards[ComponentId.LABEL]).toBeDefined()

    // Should have separate variants for each
    expect(result.boards[ComponentId.BUTTON].variants).toHaveLength(1)
    expect(result.boards[ComponentId.LABEL].variants).toHaveLength(1)
  })

  it("should handle ai_set_node_properties actions", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
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
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          theme: "default",
          component: ComponentId.BUTTON,
          properties: {},
          children: [],
        },
      },
    }

    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "Test Content" },
    }

    const actions = [
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$buttonVariant" as const,
        },
      },
      {
        type: "ai_set_node_properties" as const,
        payload: {
          nodeId: "$buttonVariant" as ReferenceId,
          properties,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should update the properties
    expect(result.byId["variant-button-default"].properties).toEqual({
      content: { type: ValueType.EXACT, value: "Test Content" },
    })
  })

  it("should handle ai_transcript_add_message actions", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const actions = [
      {
        type: "ai_transcript_add_message" as const,
        payload: {
          chatMessage: "Test message",
          expectUserAnswer: false,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should not modify the workspace structure
    expect(result.boards).toEqual(workspace.boards)
    expect(result.byId).toEqual(workspace.byId)
  })

  it("should handle empty action list", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = processAiActions(workspace, [])

    expect(result).toEqual(workspace)
  })

  it("should handle actions with missing nodes gracefully", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "Test Content" },
    }

    const actions = [
      {
        type: "ai_set_node_properties" as const,
        payload: {
          nodeId: "$nonExistentNode" as ReferenceId,
          properties,
        },
      },
    ]

    // Should not throw an error
    const result = processAiActions(workspace, actions)
    expect(result).toEqual(workspace)
  })

  it("should handle complex component creation with children", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const actions = [
      {
        type: "ai_add_component" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          ref: "$button" as const,
        },
      },
    ]

    const result = processAiActions(workspace, actions)

    // Should create button with its child components (icon and label)
    const variantId = result.boards[ComponentId.BUTTON].variants[0]
    const buttonVariant = result.byId[variantId]

    expect(buttonVariant.children).toBeDefined()
    expect(buttonVariant.children!.length).toBeGreaterThan(0)

    // Should create child components
    buttonVariant.children!.forEach((childId) => {
      expect(result.byId[childId]).toBeDefined()
      expect(result.byId[childId].isChild).toBe(true)
      if ("variant" in result.byId[childId]) {
        expect(result.byId[childId].variant).toBeDefined()
      }
    })
  })
})
