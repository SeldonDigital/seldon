import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { generateReactComponentReturnStatements } from "./generate-react-component-return-statements"

// Mock the dependencies

describe("generateReactComponentReturnStatements", () => {
  it("should generate return statement for HTML element", () => {
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
        children: [],
      },
    }

    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
    }

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <HTMLButton")
    expect(result).toContain('className={"sdn-button " + className}')
    expect(result).toContain("{...props}")
  })

  it("should generate return statement for HTML element with children", () => {
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
        ],
      },
    }

    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
      "child-label-1": "sdn-label",
    }

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <HTMLButton")
    expect(result).toContain('className={"sdn-button " + className}')
    expect(result).toContain("{...props}")
  })

  it("should generate return statement for SVG element", () => {
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

    const nodeIdToClass = {
      "variant-icon-default": "sdn-icon",
    }

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <HTMLSvg")
    expect(result).toContain('className={"sdn-icon " + className}')
    expect(result).toContain("{...props}")
  })

  it("should generate return statement for htmlElement type", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.LABEL,
      variantId: "variant-label-default",
      defaultVariantId: "variant-label-default",
      name: "Label",
      config: {
        react: {
          returns: "htmlElement",
        },
      },
      output: {
        path: "components/seldon/primitives/Label.tsx",
      },
      tree: {
        name: "Label",
        nodeId: "variant-label-default",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "LabelProps",
          path: "root",
          props: {
            htmlElement: {
              defaultValue: "span",
              options: ["span", "label"],
            },
          },
        },
        children: [],
      },
    }

    const nodeIdToClass = {
      "variant-label-default": "sdn-label",
    }

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <htmlElement")
    expect(result).toContain('className={"sdn-label " + className}')
    expect(result).toContain("{...props}")
  })

  it("should handle component with no className", () => {
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
        children: [],
      },
    }

    const nodeIdToClass = {}

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <HTMLButton")
    expect(result).toContain('className={"undefined " + className}')
    expect(result).toContain("{...props}")
  })

  it("should handle component with complex children structure", () => {
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
            nodeId: "child-header-1" as any,
            level: ComponentLevel.MODULE,
            dataBinding: {
              interfaceName: "HeaderProps",
              path: "root.header",
              props: {},
            },
            children: [
              {
                name: "Title",
                nodeId: "child-title-1" as any,
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
            nodeId: "child-content-1" as any,
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

    const nodeIdToClass = {
      "variant-cardProduct-default": "sdn-card",
      "child-header-1": "sdn-header",
      "child-title-1": "sdn-title",
      "child-content-1": "sdn-content",
    }

    const result = generateReactComponentReturnStatements.generateSimpleReturn(
      mockComponent,
      nodeIdToClass,
    )

    expect(result).toContain("return <HTMLDiv")
    expect(result).toContain('className={"sdn-card " + className}')
    expect(result).toContain("{...props}")
  })
})
