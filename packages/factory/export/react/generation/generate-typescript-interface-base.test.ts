import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { generateTypescriptInterfaceBase } from "./generate-typescript-interface-base"

describe("generateTypescriptInterfaceBase", () => {
  it("should generate TypeScript interface for component with props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {
            children: {
              type: "string",
              value: "Click me",
              defaultValue: "Click me",
            },
            disabled: { type: "boolean", value: false, defaultValue: "false" },
            onClick: {
              type: "function",
              value: "() => {}",
              defaultValue: "() => {}",
            },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface ButtonProps")
    expect(result).toContain("children?: string")
    expect(result).toContain("disabled?: boolean")
    expect(result).toContain("onClick?: () => void")
  })

  it("should generate TypeScript interface for component without props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.ICON,
      variantId: "variant-icon-default",
      defaultVariantId: "variant-icon-default",
      name: "Icon",
      config: {
        react: {
          returns: "HTMLSvg",
        },
      },
      output: {
        path: "components/seldon/primitives/Icon.tsx",
      },
      tree: {
        name: "Icon",
        nodeId: "variant-icon-default",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "IconProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface IconProps")
    expect(result).not.toContain("children?:")
    expect(result).not.toContain("disabled?:")
  })

  it("should generate TypeScript interface for component with complex props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.CARD_PRODUCT,
      variantId: "variant-cardProduct-default",
      defaultVariantId: "variant-cardProduct-default",
      name: "Card",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/parts/Card.tsx",
      },
      tree: {
        name: "Card",
        nodeId: "variant-cardProduct-default",
        level: ComponentLevel.PART,
        dataBinding: {
          interfaceName: "CardProps",
          path: "root",
          props: {
            title: {
              type: "string",
              value: "Card Title",
              defaultValue: "Card Title",
            },
            description: {
              type: "string",
              value: "Card description",
              defaultValue: "Card description",
            },
            image: {
              type: "string",
              value: "https://example.com/image.jpg",
              defaultValue: "https://example.com/image.jpg",
            },
            metadata: {
              type: "object",
              value: { id: 1, tags: ["tag1", "tag2"] },
              defaultValue: "{}",
            },
            onClick: {
              type: "function",
              value: "() => {}",
              defaultValue: "() => {}",
            },
            onHover: {
              type: "function",
              value: "(event: MouseEvent) => {}",
              defaultValue: "(event: MouseEvent) => {}",
            },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface CardProps")
    expect(result).toContain("title?: string")
    expect(result).toContain("description?: string")
    expect(result).toContain("image?: string")
    expect(result).toContain("metadata?: object")
    expect(result).toContain("onClick?: () => void")
    expect(result).toContain("onHover?: (event: MouseEvent) => void")
  })

  it("should generate TypeScript interface for component with array props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.LIST_STANDARD,
      variantId: "variant-listStandard-default",
      defaultVariantId: "variant-listStandard-default",
      name: "List",
      config: {
        react: {
          returns: "HTMLUl",
        },
      },
      output: {
        path: "components/seldon/elements/List.tsx",
      },
      tree: {
        name: "List",
        nodeId: "variant-listStandard-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ListProps",
          path: "root",
          props: {
            items: {
              type: "array",
              value: ["item1", "item2", "item3"],
              defaultValue: "[]",
            },
            selectedItems: {
              type: "array",
              value: [1, 2, 3],
              defaultValue: "[]",
            },
            onItemClick: {
              type: "function",
              value: "(item: string) => {}",
              defaultValue: "(item: string) => {}",
            },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface ListProps")
    expect(result).toContain("items?: string[]")
    expect(result).toContain("selectedItems?: number[]")
    expect(result).toContain("onItemClick?: (item: string) => void")
  })

  it("should generate TypeScript interface for component with number props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.ICON,
      variantId: "variant-icon-default",
      defaultVariantId: "variant-icon-default",
      name: "Icon",
      config: {
        react: {
          returns: "HTMLSvg",
        },
      },
      output: {
        path: "components/seldon/primitives/Icon.tsx",
      },
      tree: {
        name: "Icon",
        nodeId: "variant-icon-default",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "IconProps",
          path: "root",
          props: {
            size: { type: "number", value: 24, defaultValue: "24" },
            width: { type: "number", value: 100, defaultValue: "100" },
            height: { type: "number", value: 200, defaultValue: "200" },
            opacity: { type: "number", value: 0.5, defaultValue: "0.5" },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface IconProps")
    expect(result).toContain("size?: number")
    expect(result).toContain("width?: number")
    expect(result).toContain("height?: number")
    expect(result).toContain("opacity?: number")
  })

  it("should generate TypeScript interface for component with boolean props", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {
            disabled: { type: "boolean", value: false, defaultValue: "false" },
            loading: { type: "boolean", value: false, defaultValue: "false" },
            primary: { type: "boolean", value: true, defaultValue: "true" },
            fullWidth: { type: "boolean", value: false, defaultValue: "false" },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface ButtonProps")
    expect(result).toContain("disabled?: boolean")
    expect(result).toContain("loading?: boolean")
    expect(result).toContain("primary?: boolean")
    expect(result).toContain("fullWidth?: boolean")
  })

  it("should handle component with special characters in name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button-V2",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button-V2.tsx",
      },
      tree: {
        name: "Button-V2",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "Button-V2Props",
          path: "root",
          props: {
            children: {
              type: "string",
              value: "Click me",
              defaultValue: "Click me",
            },
          },
        },
        children: [],
      },
    }

    const result = generateTypescriptInterfaceBase(mockComponent)

    expect(result).toContain("export interface Button-V2Props")
    expect(result).toContain("children?: string")
  })
})
