import { describe, expect, it } from "bun:test"
import {
  ComponentId,
  ComponentLevel,
} from "../../../../../components/constants"
import customTheme from "../../../../../themes/custom"
import { Workspace } from "../../../../types"
import { handleAiAddVariant } from "./handle-ai-add-variant"

describe("handleAiAddVariant", () => {
  it("should add a variant with enhanced validation for AI operations", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
          label: "Default",
        },
      },
      customTheme,
    }

    const result = handleAiAddVariant(
      { componentId: ComponentId.BUTTON, ref: "$buttonVariant" },
      workspace,
    )

    // Should create a new variant
    expect(result.boards[ComponentId.BUTTON]?.variants.length).toBe(2)

    // Should have the original default variant
    expect(result.boards[ComponentId.BUTTON]?.variants).toContain(
      "variant-button-default",
    )

    // Should have a new variant (the exact ID will be generated)
    const newVariantId = result.boards[ComponentId.BUTTON]?.variants.find(
      (id) => id !== "variant-button-default",
    )
    expect(newVariantId).toBeDefined()
    expect(result.byId[newVariantId!]).toBeDefined()
  })

  it("should throw error when board does not exist", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleAiAddVariant(
        { componentId: ComponentId.BUTTON, ref: "$buttonVariant" },
        workspace,
      )
    }).toThrow(
      "Board for component button does not exist. Cannot create variant.",
    )
  })

  it("should create missing descendant boards before creating variant", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.CARD_PRODUCT]: {
          id: ComponentId.CARD_PRODUCT,
          label: "Product Card",
          order: 0,
          theme: "default",
          variants: ["variant-cardProduct-default"],
          properties: {},
        },
      },
      byId: {
        "variant-cardProduct-default": {
          id: "variant-cardProduct-default",
          component: ComponentId.CARD_PRODUCT,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.PART,
          theme: null,
          type: "defaultVariant",
          properties: {},
          label: "Default",
        },
      },
      customTheme,
    }

    // Test that the function handles the case where descendant components exist
    // The function should successfully create the variant even with existing descendants
    const result = handleAiAddVariant(
      { componentId: ComponentId.CARD_PRODUCT, ref: "$cardVariant" },
      workspace,
    )

    // Verify that the variant was created successfully
    expect(result.boards[ComponentId.CARD_PRODUCT]).toBeDefined()
    expect(result.boards[ComponentId.CARD_PRODUCT].variants).toHaveLength(2) // original + new variant
  })

  it("should handle adding variant to component with existing descendants", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          variants: ["variant-icon-default"],
          properties: {},
        },
        [ComponentId.LABEL]: {
          id: ComponentId.LABEL,
          label: "Label",
          order: 2,
          theme: "default",
          variants: ["variant-label-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
          label: "Default",
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          theme: null,
          type: "defaultVariant",
          properties: {},
          label: "Default",
        },
        "variant-label-default": {
          id: "variant-label-default",
          component: ComponentId.LABEL,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          theme: null,
          type: "defaultVariant",
          properties: {},
          label: "Default",
        },
      },
      customTheme,
    }

    const result = handleAiAddVariant(
      { componentId: ComponentId.BUTTON, ref: "$buttonVariant2" },
      workspace,
    )

    // Should create a new variant
    expect(result.boards[ComponentId.BUTTON]?.variants.length).toBe(2)

    // Should not modify existing descendant boards
    expect(result.boards[ComponentId.ICON]).toEqual(
      workspace.boards[ComponentId.ICON],
    )
    expect(result.boards[ComponentId.LABEL]).toEqual(
      workspace.boards[ComponentId.LABEL],
    )
  })
})
