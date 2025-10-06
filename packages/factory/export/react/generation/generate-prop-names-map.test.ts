import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentExport } from "@seldon/core/components/types"
import { ComponentToExport } from "../../types"
import { generatePropNamesMap } from "./generate-prop-names-map"

describe("generatePropNamesMap", () => {
  it("generates unique prop names for different paths", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {} as ComponentExport,
      output: { path: "test" },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {},
        },
        children: [
          {
            name: "Title",
            nodeId: "child-title-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "TitleProps",
              path: "root.title",
              props: {},
            },
            children: [],
          },
          {
            name: "Button",
            nodeId: "child-button-1",
            level: ComponentLevel.ELEMENT,
            dataBinding: {
              interfaceName: "ButtonProps",
              path: "root.button",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generatePropNamesMap(mockComponent)

    expect(result.get("root.title")).toBe("titleProps")
    expect(result.get("root.button")).toBe("button")
  })

  it("handles duplicate base names with sequential numbering", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.CARD_PRODUCT,
      variantId: "variant-cardProduct-default",
      defaultVariantId: "variant-cardProduct-default",
      name: "Card",
      config: {} as ComponentExport,
      output: { path: "test" },
      tree: {
        name: "Card",
        nodeId: "variant-cardProduct-default",
        level: ComponentLevel.PART,
        dataBinding: {
          interfaceName: "CardProps",
          path: "root",
          props: {},
        },
        children: [
          {
            name: "Title",
            nodeId: "child-title-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "TitleProps",
              path: "root.title",
              props: {},
            },
            children: [],
          },
          {
            name: "Title",
            nodeId: "child-title-2",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "TitleProps",
              path: "root.title2",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generatePropNamesMap(mockComponent)

    expect(result.get("root.title")).toBe("titleProps")
    expect(result.get("root.title2")).toBe("title2")
  })
})
