import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { JSONTreeNode } from "../../types"
import { validateComponentProps } from "./validate-component-props"

function createNode(
  name: string,
  componentId: ComponentId,
  level: ComponentLevel,
  path: string,
  schemaVariantId: string | null = null,
  children?: JSONTreeNode[],
): JSONTreeNode {
  return {
    name,
    componentId,
    schemaVariantId,
    nodeId: `node-${path}`,
    level,
    dataBinding: {
      interfaceName: `${name}Props`,
      path,
      props: {},
    },
    children: children ?? null,
  }
}

describe("validateComponentProps", () => {
  it("treats nested schema descendants as invalid at the root", () => {
    const title = createNode(
      "Title",
      ComponentId.TITLE,
      ComponentLevel.PRIMITIVE,
      "title",
    )
    const frame = createNode(
      "Frame",
      ComponentId.FRAME,
      ComponentLevel.FRAME,
      "frame",
    )

    const validation = validateComponentProps(ComponentId.AVATAR, null, [
      title,
      frame,
    ])

    expect(validation.validProps.map((node) => node.componentId)).toEqual([
      ComponentId.FRAME,
    ])
    expect(validation.invalidProps.map((node) => node.componentId)).toEqual([
      ComponentId.TITLE,
    ])
  })

  it("validates against the active schema variant instead of unioning all variants", () => {
    const label = createNode(
      "Label",
      ComponentId.LABEL,
      ComponentLevel.PRIMITIVE,
      "label",
    )
    const icon = createNode(
      "Icon",
      ComponentId.ICON,
      ComponentLevel.PRIMITIVE,
      "icon",
    )

    const validation = validateComponentProps(ComponentId.CHIP, "count", [
      label,
      icon,
    ])

    expect(validation.validProps.map((node) => node.componentId)).toEqual([
      ComponentId.LABEL,
    ])
    expect(validation.invalidProps.map((node) => node.componentId)).toEqual([
      ComponentId.ICON,
    ])
  })

  it("distinguishes child schema variants from same-component default slots", () => {
    const checkbox = createNode(
      "Checkbox",
      ComponentId.CHECKBOX,
      ComponentLevel.PRIMITIVE,
      "checkbox",
    )
    const label = createNode(
      "Label",
      ComponentId.LABEL,
      ComponentLevel.PRIMITIVE,
      "label",
    )
    const chip = (path: string, schemaVariantId: string | null = null) =>
      createNode(
        "Chip",
        ComponentId.CHIP,
        ComponentLevel.ELEMENT,
        path,
        schemaVariantId,
      )

    const validation = validateComponentProps(ComponentId.LIST_ITEM_TODO, null, [
      checkbox,
      label,
      chip("chip"),
      chip("chip2"),
      chip("chip3"),
    ])

    expect(validation.validProps.map((node) => node.dataBinding.path)).toEqual([
      "checkbox",
      "label",
      "chip",
      "chip2",
    ])
    expect(validation.invalidProps.map((node) => node.dataBinding.path)).toEqual(
      ["chip3"],
    )
  })
})
