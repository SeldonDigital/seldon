import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { generateReactFunctionSignature } from "./generate-react-function-signature"

describe("generateReactFunctionSignature", () => {
  it("should generate function signature for component with props", () => {
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
          },
        },
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe("export function Button(props: ButtonProps)")
  })

  it("should generate function signature for component without props", () => {
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

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe("export function Icon(props: IconProps)")
  })

  it("should generate function signature for component with complex name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.CARD_PRODUCT,
      variantId: "variant-cardProduct-featured",
      defaultVariantId: "variant-cardProduct-default",
      name: "CardProductFeatured",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/parts/CardProductFeatured.tsx",
      },
      tree: {
        name: "CardProductFeatured",
        nodeId: "variant-cardProduct-featured",
        level: ComponentLevel.PART,
        dataBinding: {
          interfaceName: "CardProductFeaturedProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe(
      "export function CardProductFeatured(props: CardProductFeaturedProps)",
    )
  })

  it("should generate function signature for component with camelCase name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "buttonPrimary",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/buttonPrimary.tsx",
      },
      tree: {
        name: "buttonPrimary",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonPrimaryProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe(
      "export function buttonPrimary(props: ButtonPrimaryProps)",
    )
  })

  it("should generate function signature for component with PascalCase name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "ButtonPrimary",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/ButtonPrimary.tsx",
      },
      tree: {
        name: "ButtonPrimary",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonPrimaryProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe(
      "export function ButtonPrimary(props: ButtonPrimaryProps)",
    )
  })

  it("should generate function signature for component with numbers in name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button2",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button2.tsx",
      },
      tree: {
        name: "Button2",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "Button2Props",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe("export function Button2(props: Button2Props)")
  })

  it("should generate function signature for component with special characters in name", () => {
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
        children: [],
      },
    }

    const result = generateReactFunctionSignature(mockComponent)

    expect(result).toBe("export function Button-V2(props: Button-V2Props)")
  })
})
