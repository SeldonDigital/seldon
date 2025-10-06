import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { validateComponentProps } from "./validate-component-props"

describe("validateComponentProps", () => {
  it("should identify valid and invalid props for TextblockDetails", () => {
    // Mock TextblockDetails children - according to schema it should have tagline, title, and description
    const validChildren: JSONTreeNode[] = [
      {
        name: "Tagline",
        nodeId: "child-tagline-abc123",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "TaglineProps",
          path: "textblockDetails.tagline",
          props: {},
        },
      },
      {
        name: "Title",
        nodeId: "child-title-def456",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "TitleProps",
          path: "textblockDetails.titleProps",
          props: {},
        },
      },
      {
        name: "Description",
        nodeId: "child-description-ghi789",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "DescriptionProps",
          path: "textblockDetails.description",
          props: {},
        },
      },
    ]

    const invalidChildren: JSONTreeNode[] = [
      {
        name: "Button",
        nodeId: "child-button-jkl012",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "textblockDetails.button",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-mno345",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "textblockDetails.button2",
          props: {},
        },
      },
    ]

    const allChildren = [...validChildren, ...invalidChildren]

    const result = validateComponentProps(
      "TextblockDetails",
      ComponentId.TEXTBLOCK_DETAILS,
      allChildren,
    )

    // Should identify the valid props (tagline, title, description)
    expect(result.validProps).toHaveLength(3)
    expect(result.validProps.map((p) => p.name)).toEqual([
      "Tagline",
      "Title",
      "Description",
    ])

    // Should identify the invalid props (button, button2)
    expect(result.invalidProps).toHaveLength(2)
    expect(result.invalidProps.map((p) => p.name)).toEqual(["Button", "Button"])

    // Component should not have fewer props than schema (it has exactly the right ones plus extras)
    expect(result.componentHasFewerPropsThanSchema).toBe(false)
  })

  it("should handle component with fewer props than schema", () => {
    // TextblockDetails schema expects tagline, title, and description but we only provide title
    const partialChildren: JSONTreeNode[] = [
      {
        name: "Title",
        nodeId: "child-title-xyz789",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "TitleProps",
          path: "textblockDetails.titleProps",
          props: {},
        },
      },
    ]

    const result = validateComponentProps(
      "TextblockDetails",
      ComponentId.TEXTBLOCK_DETAILS,
      partialChildren,
    )

    expect(result.validProps).toHaveLength(1)
    expect(result.invalidProps).toHaveLength(0)
    expect(result.componentHasFewerPropsThanSchema).toBe(true)
  })

  it("should handle unknown component gracefully", () => {
    const children: JSONTreeNode[] = [
      {
        name: "Button",
        nodeId: "child-button-1",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "unknown.button",
          props: {},
        },
      },
    ]

    const result = validateComponentProps(
      "UnknownComponent",
      "unknownId" as ComponentId,
      children,
    )

    // Should treat all props as valid when schema is not found
    expect(result.validProps).toHaveLength(1)
    expect(result.invalidProps).toHaveLength(0)
    expect(result.componentHasFewerPropsThanSchema).toBe(false)
  })

  it("should handle flexible component ordering for BarButtons", () => {
    // BarButtons schema expects 3 Button components, but in different order
    const reorderedChildren: JSONTreeNode[] = [
      {
        name: "Button",
        nodeId: "child-button-2",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button2",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-1",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-3",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button3",
          props: {},
        },
      },
    ]

    const result = validateComponentProps(
      "BarButtons",
      ComponentId.BAR_BUTTONS,
      reorderedChildren,
    )

    // Should identify all 3 buttons as valid props regardless of order
    expect(result.validProps).toHaveLength(3)
    expect(result.invalidProps).toHaveLength(0)
    expect(result.componentHasFewerPropsThanSchema).toBe(false)
  })

  it("should handle components exceeding schema limits", () => {
    // BarButtons schema expects 3 Button components, but we provide 4
    const tooManyChildren: JSONTreeNode[] = [
      {
        name: "Button",
        nodeId: "child-button-1",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-2",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button2",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-3",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button3",
          props: {},
        },
      },
      {
        name: "Button",
        nodeId: "child-button-4",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "barButtons.button4",
          props: {},
        },
      },
    ]

    const result = validateComponentProps(
      "BarButtons",
      ComponentId.BAR_BUTTONS,
      tooManyChildren,
    )

    // Should identify first 3 buttons as valid, 4th as invalid
    expect(result.validProps).toHaveLength(3)
    expect(result.invalidProps).toHaveLength(1)
    expect(result.invalidProps[0].name).toBe("Button")
    expect(result.componentHasFewerPropsThanSchema).toBe(false)
  })
})
