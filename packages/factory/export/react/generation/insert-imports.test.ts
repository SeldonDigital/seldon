import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { insertImports } from "./insert-imports"

describe("insertImports", () => {
  it("should insert imports for HTML element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {ButtonHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLButton} from "../native-react/HTML.Button"',
    )
  })

  it("should insert imports for SVG element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {SVGAttributes} from "react"')
    expect(result).toContain('import {HTMLSvg} from "../native-react/HTML.Svg"')
  })

  it("should insert imports for div element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {HTMLAttributes} from "react"')
    expect(result).toContain('import {HTMLDiv} from "../native-react/HTML.Div"')
  })

  it("should insert imports for span element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {HTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLSpan} from "../native-react/HTML.Span"',
    )
  })

  it("should insert imports for input element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {InputHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLInput} from "../native-react/HTML.Input"',
    )
  })

  it("should insert imports for textarea element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {TextareaHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLTextarea} from "../native-react/HTML.Textarea"',
    )
  })

  it("should insert imports for select element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {SelectHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLSelect} from "../native-react/HTML.Select"',
    )
  })

  it("should insert imports for img element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {ImgHTMLAttributes} from "react"')
    expect(result).toContain('import {HTMLImg} from "../native-react/HTML.Img"')
  })

  it("should insert imports for anchor element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {AnchorHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLAnchor} from "../native-react/HTML.Anchor"',
    )
  })

  it("should insert imports for form element component", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {FormHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLForm} from "../native-react/HTML.Form"',
    )
  })

  it("should insert imports for component with htmlElement type", () => {
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

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {HTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLSpan} from "../native-react/HTML.Span"',
    )
    expect(result).toContain(
      'import {HTMLLabel} from "../native-react/HTML.Label"',
    )
  })

  it("should append imports to existing content", () => {
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
          props: {},
        },
        children: [],
      },
    }

    const result = insertImports(existingContent, mockComponent)

    expect(result).toContain('import {ButtonHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLButton} from "../native-react/HTML.Button"',
    )
    expect(result).toContain("export function Button(props: ButtonProps) {")
    expect(result).toContain("return <HTMLButton />")
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
        children: [],
      },
    }

    const result = insertImports("", mockComponent)

    expect(result).toContain('import {ButtonHTMLAttributes} from "react"')
    expect(result).toContain(
      'import {HTMLButton} from "../native-react/HTML.Button"',
    )
  })
})
