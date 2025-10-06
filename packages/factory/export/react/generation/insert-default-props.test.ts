import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { insertDefaultProps } from "./insert-default-props"

describe("insertDefaultProps", () => {
  it("should insert default props for component with props", () => {
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
            size: { type: "string", value: "medium", defaultValue: "medium" },
          },
        },
        children: [],
      },
    }

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: ButtonProps = {")
    expect(result).toContain('"button": {')
    expect(result).toContain('"children": "Click me"')
    expect(result).toContain('"disabled": false')
    expect(result).toContain('"size": "medium"')
    expect(result).toContain("}")
  })

  it("should insert default props for component without props", () => {
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toBe("")
  })

  it("should insert default props for component with complex props", () => {
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: CardProps = {")
    expect(result).toContain('"card": {')
    expect(result).toContain('"title": "Card Title"')
    expect(result).toContain('"description": "Card description"')
    expect(result).toContain('"image": "https://example.com/image.jpg"')
    expect(result).toContain('"metadata": {')
    expect(result).toContain('"id": 1')
    expect(result).toContain('"tags": [')
    expect(result).toContain('"tag1"')
    expect(result).toContain('"tag2"')
    expect(result).toContain("}")
    expect(result).toContain('"onClick": "() => {}"')
    expect(result).toContain('"onHover": "(event: MouseEvent) => {}"')
    expect(result).toContain("}")
  })

  it("should insert default props for component with array props", () => {
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: ListProps = {")
    expect(result).toContain('"list": {')
    expect(result).toContain('"items": [')
    expect(result).toContain('"item1"')
    expect(result).toContain('"item2"')
    expect(result).toContain('"item3"')
    expect(result).toContain("]")
    expect(result).toContain('"selectedItems": [')
    expect(result).toContain("1")
    expect(result).toContain("2")
    expect(result).toContain("3")
    expect(result).toContain("]")
    expect(result).toContain('"onItemClick": "(item: string) => {}"')
    expect(result).toContain("}")
  })

  it("should insert default props for component with number props", () => {
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: IconProps = {")
    expect(result).toContain('"icon": {')
    expect(result).toContain('"size": 24')
    expect(result).toContain('"width": 100')
    expect(result).toContain('"height": 200')
    expect(result).toContain('"opacity": 0.5')
    expect(result).toContain("}")
  })

  it("should insert default props for component with boolean props", () => {
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: ButtonProps = {")
    expect(result).toContain('"button": {')
    expect(result).toContain('"disabled": false')
    expect(result).toContain('"loading": false')
    expect(result).toContain('"primary": true')
    expect(result).toContain('"fullWidth": false')
    expect(result).toContain("}")
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

    const result = insertDefaultProps("", mockComponent)

    expect(result).toContain("const sdn: Button-V2Props = {")
    expect(result).toContain('"button-v2": {')
    expect(result).toContain('"children": "Click me"')
    expect(result).toContain("}")
  })

  it("should append default props to existing content", () => {
    const existingContent =
      "export function Button(props: ButtonProps) {\n  return <HTMLButton />\n}"
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
          },
        },
        children: [],
      },
    }

    const result = insertDefaultProps(existingContent, mockComponent)

    expect(result).toContain("export function Button(props: ButtonProps) {")
    expect(result).toContain("return <HTMLButton />")
    expect(result).toContain("const sdn: ButtonProps = {")
    expect(result).toContain('"button": {')
    expect(result).toContain('"children": "Click me"')
    expect(result).toContain("}")
  })
})
