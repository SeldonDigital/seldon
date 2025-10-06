import { expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../types"
import { insertComponentFunction } from "./insert-component-function"

const nodeIdToClass = {
  "variant-icon-default": "icon",
  "variant-label-default": "label",
  "variant-button-default": "button",
  "child-icon-tZSr_I": "icon-tZSr_I",
}

it("should return the correct JSX string for a JSONTreeNode without children", () => {
  const tree: JSONTreeNode = {
    name: "Icon",
    nodeId: "variant-icon-default",
    level: ComponentLevel.PRIMITIVE,
    dataBinding: {
      interfaceName: "IconProps",
      path: "icon",
      props: {
        icon: {
          defaultValue: "__default__",
          options: ["__default__"],
        },
      },
    },
    children: null,
  }

  // @ts-ignore - This is a test
  const component: ComponentToExport = {
    tree,
    config: {
      react: {
        returns: "HTMLSvg",
      },
    },
  }

  const result = insertComponentFunction("", component, nodeIdToClass)
  expect(result).toInclude("export function Icon")
  expect(result).toInclude("return <HTMLSvg")
})

it("should return the correct JSX string for a JSONTreeNode without children as string", () => {
  const component: ComponentToExport = {
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
        path: "label",
        props: {
          children: {
            defaultValue: "Label",
          },
          htmlElement: {
            defaultValue: "span",
            options: ["span", "label"],
          },
        },
      },
      children: null,
    },
  }
  const result = insertComponentFunction("", component, nodeIdToClass)
  expect(result).toInclude("return <HTMLSpan")
  expect(result).toInclude("export function Label")
})

it("Should return the correct JSX string for a JSONTreeNode with a htmlElement", () => {
  const component: ComponentToExport = {
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
        path: "label",
        props: {
          children: {
            defaultValue: "Label",
          },
          htmlElement: {
            defaultValue: "span",
            options: ["span", "label"],
          },
        },
      },
      children: null,
    },
  }

  const result = insertComponentFunction("", component, nodeIdToClass)

  expect(result).toInclude("switch(htmlElement) {")
  expect(result).toInclude("return <HTMLLabel")
  expect(result).toInclude("default:")
  expect(result).toInclude("return <HTMLSpan")
})

it("should return the correct JSX string for a JSONTreeNode with a children tree", () => {
  const component: ComponentToExport = {
    componentId: ComponentId.BUTTON,
    variantId: "variant-button-default",
    defaultVariantId: "variant-button-default",
    name: "button",
    output: {
      path: "components/seldon/primitives/button.tsx",
    },
    config: {
      react: {
        returns: "HTMLButton",
      },
    },
    tree: {
      name: "button",
      nodeId: "variant-button-default",
      level: ComponentLevel.PRIMITIVE,
      dataBinding: {
        interfaceName: "buttonProps",
        path: "button",
        props: {},
      },
      children: [
        {
          name: "Icon",
          nodeId: "child-icon-tZSr_I",
          level: ComponentLevel.PRIMITIVE,
          dataBinding: {
            interfaceName: "IconProps",
            path: "icon",
            props: {
              icon: {
                defaultValue: "__default__",
              },
              style: {
                defaultValue: {
                  color: "hsl(0 4% 98%)",
                  fontSize: "0.8rem",
                },
              },
            },
          },
          children: null,
        },
      ],
    },
  }

  const result = insertComponentFunction("", component, nodeIdToClass)
  expect(result).toInclude("export function button")
  expect(result).toInclude("return <HTMLButton")
})
