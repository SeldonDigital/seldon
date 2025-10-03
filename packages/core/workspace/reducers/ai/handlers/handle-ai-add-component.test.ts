import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleAiAddComponent } from "./handle-ai-add-component"

describe("handleAiAddComponent", () => {
  it("should add a component with enhanced validation for AI operations", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAiAddComponent(
      { componentId: ComponentId.BUTTON, ref: "$button" },
      workspace,
    )

    // Should create the button board and all its dependencies
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.boards[ComponentId.ICON]).toBeDefined()
    expect(result.boards[ComponentId.LABEL]).toBeDefined()

    // Should create the default variant
    expect(result.byId["variant-button-default"]).toBeDefined()
    expect(result.byId["variant-icon-default"]).toBeDefined()
    expect(result.byId["variant-label-default"]).toBeDefined()
  })

  it("should handle adding a component that already exists", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Existing Button",
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

    const result = handleAiAddComponent(
      { componentId: ComponentId.BUTTON, ref: "$button" },
      workspace,
    )

    // Should return the same workspace without modification
    expect(result).toEqual(workspace)
  })

  it("should handle adding a complex component with nested dependencies", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAiAddComponent(
      { componentId: ComponentId.CARD_PRODUCT, ref: "$cardProduct" },
      workspace,
    )

    // Should create all required boards
    expect(result.boards[ComponentId.CARD_PRODUCT]).toBeDefined()
    expect(result.boards[ComponentId.TEXTBLOCK_DETAILS]).toBeDefined()
    expect(result.boards[ComponentId.TAGLINE]).toBeDefined()
    expect(result.boards[ComponentId.TITLE]).toBeDefined()
    expect(result.boards[ComponentId.DESCRIPTION]).toBeDefined()
    expect(result.boards[ComponentId.BAR_BUTTONS]).toBeDefined()
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.boards[ComponentId.ICON]).toBeDefined()
    expect(result.boards[ComponentId.LABEL]).toBeDefined()

    // Should create all default variants
    expect(result.byId["variant-cardProduct-default"]).toBeDefined()
    expect(result.byId["variant-textblockDetails-default"]).toBeDefined()
    expect(result.byId["variant-tagline-default"]).toBeDefined()
    expect(result.byId["variant-title-default"]).toBeDefined()
    expect(result.byId["variant-description-default"]).toBeDefined()
    expect(result.byId["variant-barButtons-default"]).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()
    expect(result.byId["variant-icon-default"]).toBeDefined()
    expect(result.byId["variant-label-default"]).toBeDefined()
  })
})
