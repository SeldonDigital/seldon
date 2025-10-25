import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleAddBoard } from "./handle-add-board"

describe("handleAddBoard", () => {
  it("should add the correct boards and nodes to the workspace", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAddBoard(
      { componentId: ComponentId.BUTTON },
      workspace,
    )

    // Check that button board was added
    expect(result.boards.button).toBeDefined()
    expect(result.boards.button.id).toBe(ComponentId.BUTTON)
    expect(result.boards.button.label).toBe("Buttons")
    expect(result.boards.button.variants).toContain("variant-button-default")

    // Check that button variant was created
    expect(result.byId["variant-button-default"]).toBeDefined()
    expect(result.byId["variant-button-default"].component).toBe(
      ComponentId.BUTTON,
    )

    // Check that child components were created
    expect(result.boards.icon).toBeDefined()
    expect(result.boards.label).toBeDefined()

    // Check that child variants were created
    expect(result.byId["variant-icon-default"]).toBeDefined()
    expect(result.byId["variant-label-default"]).toBeDefined()

    // 1. default button variant
    // 2. default icon variant
    // 3. default Button Label variant
    // 4. icon child (inside default button variant)
    // 5. label child (inside default button variant)
    expect(Object.values(result.byId).length).toEqual(5)

    expect(Object.values(result.byId)[0]).toMatchObject(
      expect.objectContaining({
        component: expect.any(String),
        id: expect.any(String),
        label: expect.any(String),
        level: expect.any(String),
        properties: expect.any(Object),
        variant: expect.any(String),
        instanceOf: expect.any(String),
      }),
    )
  })

  it("should handle indexed nestedOverrides props correctly for ButtonBar", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAddBoard(
      { componentId: ComponentId.BAR_BUTTONS },
      workspace,
    )

    // Check that ButtonBar board was created
    expect(result.boards[ComponentId.BAR_BUTTONS]).toBeDefined()

    // Check that Button boards were created
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()

    // Check that Label boards were created
    expect(result.boards[ComponentId.LABEL]).toBeDefined()

    // Check that Icon boards were created
    expect(result.boards[ComponentId.ICON]).toBeDefined()

    // Find the ButtonBar variant
    const buttonBarVariant = Object.values(result.byId).find(
      (node) =>
        node.component === ComponentId.BAR_BUTTONS &&
        "type" in node &&
        node.type === "defaultVariant",
    )
    expect(buttonBarVariant).toBeDefined()

    // ButtonBar default variant should have empty properties (not schema properties)
    // This ensures that properties show as white (not overridden) in the UI
    expect(buttonBarVariant?.properties).toEqual({})

    // Find the Button children of ButtonBar
    const buttonChildren = Object.values(result.byId).filter(
      (node) => node.component === ComponentId.BUTTON && node.isChild,
    )
    expect(buttonChildren.length).toBeGreaterThan(0)

    // Verify that Button children still have their overrides correctly applied
    // The first Button should have background color override from the schema
    const firstButton = buttonChildren[0]
    expect(firstButton.properties.background?.color?.value).toBe(
      "@swatch.swatch1",
    )

    // Find the Label children of the Button (should have indexed nestedOverrides props applied)
    const labelChildren = Object.values(result.byId).filter(
      (node) => node.component === ComponentId.LABEL && node.isChild,
    )
    expect(labelChildren.length).toBeGreaterThan(0)

    // Check that we have the expected labels with correct content
    // The ButtonBar schema has nestedOverrides props that should be applied to the Button's Label children
    // - First Button: "label.content": "Add"
    // - Second Button: "label.content": "Remove"
    // - Third Button: default "Button" content

    // Verify the correct behavior:
    // - First Button should have "Add" (Label)
    // - Second Button should have "Remove" (Label)
    // - Third Button should have "Button" (default Label content)

    const addLabels = labelChildren.filter(
      (child) => child.properties?.content?.value === "Add",
    )
    const removeLabels = labelChildren.filter(
      (child) => child.properties?.content?.value === "Remove",
    )
    const buttonLabels = labelChildren.filter(
      (child) => child.properties?.content?.value === "Button",
    )

    // Should have exactly one label with each expected content
    expect(addLabels.length).toBe(1)
    expect(removeLabels.length).toBe(1)
    expect(buttonLabels.length).toBe(2) // 2 labels with "Button" content (default variant + third button)

    // Should have correct number of labels with default content
    // 1 default variant label + 3 Buttons × 1 Label each = 4 total labels
    // 1 default variant ("Button") + 2 Buttons with nestedOverrides ("Add", "Remove") + 1 Button with default ("Button") = 4 labels total
    expect(labelChildren.length).toBe(4) // Total number of labels should be 4
  })

  it("should handle cardProduct component without variant reference errors", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAddBoard(
      { componentId: ComponentId.CARD_PRODUCT },
      workspace,
    )

    // Verify all required boards were created
    expect(result.boards[ComponentId.CARD_PRODUCT]).toBeDefined()
    expect(result.boards[ComponentId.TEXTBLOCK_DETAILS]).toBeDefined()
    expect(result.boards[ComponentId.TAGLINE]).toBeDefined()
    expect(result.boards[ComponentId.TITLE]).toBeDefined()
    expect(result.boards[ComponentId.DESCRIPTION]).toBeDefined()
    expect(result.boards[ComponentId.BAR_BUTTONS]).toBeDefined()
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.boards[ComponentId.ICON]).toBeDefined()
    expect(result.boards[ComponentId.LABEL]).toBeDefined()

    // Verify all instances have valid variant references
    Object.values(result.byId).forEach((node) => {
      if (node.isChild) {
        // Every child instance should reference a variant that exists
        expect(result.byId[node.variant]).toBeDefined()
        expect(result.byId[node.instanceOf]).toBeDefined()

        // The variant should be a default variant
        const variant = result.byId[node.variant]
        expect(variant).toBeDefined()
        expect("type" in variant && variant.type === "defaultVariant").toBe(
          true,
        )
      }
    })

    // Verify the cardProduct variant has children
    const cardProductVariant = Object.values(result.byId).find(
      (node) =>
        node.component === ComponentId.CARD_PRODUCT &&
        "type" in node &&
        node.type === "defaultVariant",
    )
    expect(cardProductVariant).toBeDefined()
    expect(cardProductVariant?.children).toBeDefined()
    expect(cardProductVariant?.children?.length).toBeGreaterThan(0)

    // Verify textblockDetails variant has children (tagline, title, description)
    const textblockDetailsVariant = Object.values(result.byId).find(
      (node) =>
        node.component === ComponentId.TEXTBLOCK_DETAILS &&
        "type" in node &&
        node.type === "defaultVariant",
    )
    expect(textblockDetailsVariant).toBeDefined()
    expect(textblockDetailsVariant?.children).toBeDefined()
    expect(textblockDetailsVariant?.children?.length).toBe(3) // tagline, title, description
  })

  it("should not add a board if it already exists", () => {
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

    const result = handleAddBoard(
      { componentId: ComponentId.BUTTON },
      workspace,
    )

    // Should return the same workspace without modification
    expect(result).toEqual(workspace)
  })

  it("should handle adding a board with no children", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAddBoard({ componentId: ComponentId.ICON }, workspace)

    // Should create the icon board and variant
    expect(result.boards[ComponentId.ICON]).toBeDefined()
    expect(result.boards[ComponentId.ICON]?.variants).toContain(
      "variant-icon-default",
    )
    expect(result.byId["variant-icon-default"]).toBeDefined()
  })
})
