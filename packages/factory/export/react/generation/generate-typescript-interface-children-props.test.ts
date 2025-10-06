import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { generateTypescriptInterfaceChildrenProps } from "./generate-typescript-interface-children-props"

// Mock the dependencies

describe("generateTypescriptInterfaceChildrenProps", () => {
  it("should generate children props interface for component with children", () => {
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
          props: {},
        },
        children: [
          {
            name: "Label",
            nodeId: "child-label-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "LabelProps",
              path: "root.label",
              props: {},
            },
            children: [],
          },
          {
            name: "Icon",
            nodeId: "child-icon-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "IconProps",
              path: "root.icon",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface ButtonChildrenProps")
    expect(result).toContain("label?: LabelProps")
    expect(result).toContain("icon?: IconProps")
  })

  it("should generate children props interface for component without children", () => {
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

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface IconChildrenProps")
    expect(result).not.toContain("label?:")
    expect(result).not.toContain("icon?:")
  })

  it("should generate children props interface for component with nested children", () => {
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
          props: {},
        },
        children: [
          {
            name: "Header",
            nodeId: "child-headerPanel-1",
            level: ComponentLevel.MODULE,
            dataBinding: {
              interfaceName: "HeaderProps",
              path: "root.header",
              props: {},
            },
            children: [
              {
                name: "Title",
                nodeId: "child-title-1",
                level: ComponentLevel.PRIMITIVE,
                dataBinding: {
                  interfaceName: "TitleProps",
                  path: "root.header.title",
                  props: {},
                },
                children: [],
              },
            ],
          },
          {
            name: "Content",
            nodeId: "child-sectionBrand-1",
            level: ComponentLevel.MODULE,
            dataBinding: {
              interfaceName: "ContentProps",
              path: "root.content",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface CardChildrenProps")
    expect(result).toContain("header?: HeaderProps")
    expect(result).toContain("content?: ContentProps")
  })

  it("should generate children props interface for component with duplicate child types", () => {
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
          props: {},
        },
        children: [
          {
            name: "ListItem",
            nodeId: "child-listItem-1",
            level: ComponentLevel.ELEMENT,
            dataBinding: {
              interfaceName: "ListItemProps",
              path: "root.item1",
              props: {},
            },
            children: [],
          },
          {
            name: "ListItem",
            nodeId: "child-listItem-2",
            level: ComponentLevel.ELEMENT,
            dataBinding: {
              interfaceName: "ListItemProps",
              path: "root.item2",
              props: {},
            },
            children: [],
          },
          {
            name: "ListItem",
            nodeId: "child-listItem-3",
            level: ComponentLevel.ELEMENT,
            dataBinding: {
              interfaceName: "ListItemProps",
              path: "root.item3",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface ListChildrenProps")
    expect(result).toContain("item1?: ListItemProps")
    expect(result).toContain("item2?: ListItemProps")
    expect(result).toContain("item3?: ListItemProps")
  })

  it("should handle component with null children", () => {
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
        children: null,
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface IconChildrenProps")
    expect(result).not.toContain("label?:")
    expect(result).not.toContain("icon?:")
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
          props: {},
        },
        children: [
          {
            name: "Label",
            nodeId: "child-label-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "LabelProps",
              path: "root.label",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface Button-V2ChildrenProps")
    expect(result).toContain("label?: LabelProps")
  })

  it("should handle component with mixed child types", () => {
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
          {
            name: "Icon",
            nodeId: "child-icon-1",
            level: ComponentLevel.PRIMITIVE,
            dataBinding: {
              interfaceName: "IconProps",
              path: "root.icon",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const result = generateTypescriptInterfaceChildrenProps(mockComponent)

    expect(result).toContain("export interface CardChildrenProps")
    expect(result).toContain("titleProps?: TitleProps")
    expect(result).toContain("button?: ButtonProps")
    expect(result).toContain("icon?: IconProps")
  })
})
