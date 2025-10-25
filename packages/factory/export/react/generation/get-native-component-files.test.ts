import { describe, expect, it, mock } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { getNativeComponentFiles } from "./get-native-component-files"

// Mock the node:fs module
const mockReaddirSync = mock(() => [
  {
    isFile: () => true,
    name: "HTML.Button.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Button.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Span.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Span.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Input.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Input.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Textarea.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Textarea.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Select.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Select.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Img.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Img.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Anchor.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Anchor.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Form.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Form.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Svg.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
  {
    isFile: () => true,
    name: "HTML.Svg.test.tsx",
    parentPath: "/test/packages/core/components/native-react",
  },
])

const mockReadFileSync = mock(
  () => "export const HTMLButton = () => <button />",
)

const mockExistsSync = mock(() => true)

// Mock the node:fs module
mock.module("node:fs", () => ({
  default: {
    readdirSync: mockReaddirSync,
    readFileSync: mockReadFileSync,
    existsSync: mockExistsSync,
  },
}))

describe("getNativeComponentFiles", () => {
  it("should return native component files for HTML elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Button.tsx"))).toBe(
      true,
    )
    expect(result[1].path).toContain("HTML.Button.test.tsx")
  })

  it("should return native component files for SVG elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

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

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Svg.tsx"))).toBe(true)
    expect(result.some((file) => file.path.includes("HTML.Svg.test.tsx"))).toBe(
      true,
    )
  })

  it("should return native component files for div elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

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
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Button.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Button.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for span elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.LABEL,
      variantId: "variant-label-default",
      defaultVariantId: "variant-label-default",
      name: "Label",
      config: {
        react: {
          returns: "HTMLSpan",
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
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Span.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Span.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for input elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.INPUT,
      variantId: "variant-input-default",
      defaultVariantId: "variant-input-default",
      name: "Input",
      config: {
        react: {
          returns: "HTMLInput",
        },
      },
      output: {
        path: "components/seldon/elements/Input.tsx",
      },
      tree: {
        name: "Input",
        nodeId: "variant-input-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "InputProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Input.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Input.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for textarea elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.INPUT_TEXT,
      variantId: "variant-inputText-default",
      defaultVariantId: "variant-inputText-default",
      name: "Textarea",
      config: {
        react: {
          returns: "HTMLTextarea",
        },
      },
      output: {
        path: "components/seldon/elements/Textarea.tsx",
      },
      tree: {
        name: "Textarea",
        nodeId: "variant-inputText-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "TextareaProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Textarea.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Textarea.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for select elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.SELECT,
      variantId: "variant-select-default",
      defaultVariantId: "variant-select-default",
      name: "Select",
      config: {
        react: {
          returns: "HTMLSelect",
        },
      },
      output: {
        path: "components/seldon/elements/Select.tsx",
      },
      tree: {
        name: "Select",
        nodeId: "variant-select-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "SelectProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Select.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Select.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for img elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.IMAGE,
      variantId: "variant-image-default",
      defaultVariantId: "variant-image-default",
      name: "Image",
      config: {
        react: {
          returns: "HTMLImg",
        },
      },
      output: {
        path: "components/seldon/elements/Image.tsx",
      },
      tree: {
        name: "Image",
        nodeId: "variant-image-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ImageProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Img.tsx"))).toBe(true)
    expect(result.some((file) => file.path.includes("HTML.Img.test.tsx"))).toBe(
      true,
    )
  })

  it("should return native component files for anchor elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.LINK,
      variantId: "variant-link-default",
      defaultVariantId: "variant-link-default",
      name: "Link",
      config: {
        react: {
          returns: "HTMLAnchor",
        },
      },
      output: {
        path: "components/seldon/elements/Link.tsx",
      },
      tree: {
        name: "Link",
        nodeId: "variant-link-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "LinkProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Anchor.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Anchor.test.tsx")),
    ).toBe(true)
  })

  it("should return native component files for form elements", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Form",
      config: {
        react: {
          returns: "HTMLForm",
        },
      },
      output: {
        path: "components/seldon/elements/Form.tsx",
      },
      tree: {
        name: "Form",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "FormProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Form.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Form.test.tsx")),
    ).toBe(true)
  })

  it("should handle component with htmlElement type", () => {
    const mockOptions = {
      rootDirectory: "/test",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

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

    const result = getNativeComponentFiles(mockOptions)

    expect(result).toHaveLength(18)
    expect(result.some((file) => file.path.includes("HTML.Span.tsx"))).toBe(
      true,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Span.test.tsx")),
    ).toBe(true)
    expect(result.some((file) => file.path.includes("HTML.Label.tsx"))).toBe(
      false,
    )
    expect(
      result.some((file) => file.path.includes("HTML.Label.test.tsx")),
    ).toBe(false)
  })
})
