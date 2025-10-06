import { expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { generateJSDocComment } from "./generate-jsdoc-comment"

it("should generate correct JSDoc comment for a component with schema", () => {
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

  const result = generateJSDocComment(component)

  const expectedJSDoc = `/**
 * Label
 * 
 * Level: Primitive
 * 
 * Intent: Associates readable text with a form control for accessibility.
 * 
 * Tags: label, form, input, text, accessibility, primitive, UI
 * 
 * @example
 * \`\`\`tsx
 * <Label
 *   children="Label"
 *   htmlElement="span"
 * />
 * \`\`\`
 */`

  expect(result).toBe(expectedJSDoc)
})

it("should generate fallback JSDoc comment when componentId is missing", () => {
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

  const result = generateJSDocComment(component)

  const expectedJSDoc = `/**
 * Icon
 * 
 * Component
 * 
 * React component
 * 
 * @example
 * \`\`\`tsx
 * <Icon
 *   icon="__default__"
 * />
 * \`\`\`
 */`

  expect(result).toBe(expectedJSDoc)
})

it("should generate JSDoc for a complex component with tags and intent", () => {
  const component: ComponentToExport = {
    componentId: ComponentId.TABLE,
    variantId: "variant-table-default",
    defaultVariantId: "variant-table-default",
    name: "Table",
    config: {
      react: {
        returns: "HTMLTable",
      },
    },
    output: {
      path: "components/seldon/modules/Table.tsx",
    },
    tree: {
      name: "Table",
      nodeId: "variant-table-default",
      level: ComponentLevel.MODULE,
      dataBinding: {
        interfaceName: "TableProps",
        path: "table",
        props: {
          ariaLabel: {
            defaultValue: "Data table",
          },
          cellAlign: {
            defaultValue: "left",
            options: ["left", "center", "right"],
          },
        },
      },
      children: null,
    },
  }

  const result = generateJSDocComment(component)

  const expectedJSDoc = `/**
 * Table
 * 
 * Level: Module
 * 
 * Intent: Schema for a standard data table with configurable columns, sorting, filtering, and row rendering options.
 * 
 * Tags: table, standard, ui, data, columns, rows, filter, sort
 * 
 * @example
 * \`\`\`tsx
 * <Table
 *   ariaLabel="Data table"
 *   cellAlign="left"
 * />
 * \`\`\`
 */`

  expect(result).toBe(expectedJSDoc)
})
