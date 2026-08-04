import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { Unit, ValueType } from "../../../properties/constants"
import { getInheritedNodeProperties } from "../../compute/compute-node-properties"
import { componentBoardSchemaVariantNodeId } from "../../helpers/components/entry-node-ids"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { resetNodeProperty } from "./reset/reset-node-property"
import { setNodeProperties } from "./set/set-node-properties"

import type { EntryNode, ExtractPayload, Workspace } from "../../types"

const baseWithButton = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const baseWithPricingCard = () =>
  addComponent(
    { boardKey: ComponentId.PRICING_CARD } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const popularVariantNodeId = () =>
  componentBoardSchemaVariantNodeId(ComponentId.PRICING_CARD, "popular")

const defaultNodeId = (workspace: Workspace) =>
  workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

const overridesOf = (workspace: Workspace, id: string) =>
  (workspace.nodes[id] as EntryNode).overrides as Record<string, unknown>

describe("setNodeProperties then resetNodeProperty", () => {
  it("stores an override and then drops it on reset", () => {
    const workspace = baseWithButton()
    const nodeId = defaultNodeId(workspace)

    const afterSet = setNodeProperties(
      {
        nodeId,
        properties: {
          opacity: {
            type: ValueType.EXACT,
            value: { value: 50, unit: Unit.PERCENT },
          },
        },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )

    expect(overridesOf(afterSet, nodeId).opacity).toEqual({
      type: ValueType.EXACT,
      value: { value: 50, unit: Unit.PERCENT },
    })

    const afterReset = resetNodeProperty(
      {
        nodeId,
        propertyKey: "opacity",
      } as ExtractPayload<"reset_node_property">,
      afterSet,
    )

    expect(overridesOf(afterReset, nodeId).opacity).toBeUndefined()
  })
})

describe("setNodeProperties cleanup against the inherited baseline", () => {
  it("does not store a write that equals the inherited value", () => {
    const workspace = baseWithButton()
    const nodeId = defaultNodeId(workspace)
    const inheritedGap = getInheritedNodeProperties(nodeId, workspace).gap

    const afterSet = setNodeProperties(
      {
        nodeId,
        properties: { gap: inheritedGap },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )

    expect(overridesOf(afterSet, nodeId).gap).toBeUndefined()
  })

  it("stores a write that differs from the inherited value", () => {
    const workspace = baseWithButton()
    const nodeId = defaultNodeId(workspace)
    const spaciousGap = { type: ValueType.THEME_ORDINAL, value: "@gap.spacious" }

    const afterSet = setNodeProperties(
      {
        nodeId,
        properties: { gap: spaciousGap },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )

    expect(overridesOf(afterSet, nodeId).gap).toEqual(spaciousGap)
  })
})

describe("whole-compound reset on a schema variant", () => {
  it("restores the variant baseline regardless of a user facet added on top", () => {
    const workspace = baseWithPricingCard()
    const nodeId = popularVariantNodeId()

    expect(overridesOf(workspace, nodeId).border).toMatchObject({
      preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.normal" },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
    })

    // The border a plain reset produces, with no user facet in the way.
    const cleanReset = resetNodeProperty(
      { nodeId, propertyKey: "border" } as ExtractPayload<"reset_node_property">,
      workspace,
    )
    const cleanBorder = overridesOf(cleanReset, nodeId).border

    const withWidth = setNodeProperties(
      {
        nodeId,
        properties: {
          border: { width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.large" } },
        },
        options: { mergeSubProperties: true },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )

    expect(overridesOf(withWidth, nodeId).border).toHaveProperty("width")

    const afterReset = resetNodeProperty(
      { nodeId, propertyKey: "border" } as ExtractPayload<"reset_node_property">,
      withWidth,
    )

    expect(overridesOf(afterReset, nodeId).border).toEqual(cleanBorder)
  })

  it("restores a single shipped facet without disturbing its siblings", () => {
    const workspace = baseWithPricingCard()
    const nodeId = popularVariantNodeId()

    // The popular variant ships border.preset = @border.normal. Change that one
    // facet, then reset it, and confirm the shipped preset comes back while the
    // sibling color facet is untouched.
    const afterSet = setNodeProperties(
      {
        nodeId,
        properties: {
          border: { preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.none" } },
        },
        options: { mergeSubProperties: true },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )

    expect(overridesOf(afterSet, nodeId).border).toMatchObject({
      preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.none" },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
    })

    const afterReset = resetNodeProperty(
      {
        nodeId,
        propertyKey: "border",
        subpropertyKey: "preset",
      } as ExtractPayload<"reset_node_property">,
      afterSet,
    )

    expect(overridesOf(afterReset, nodeId).border).toMatchObject({
      preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.normal" },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
    })
  })
})
