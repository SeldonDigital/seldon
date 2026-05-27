import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../../../helpers/components/entry-node-ids"
import { getNodeCatalogId } from "../../../helpers/nodes/get-node-catalog-id"
import type { ComponentBoard, ComponentTreeRef, Workspace } from "../../../types"
import { addComponent } from "./add-component"

function findPrimitiveChildId(
  ref: ComponentTreeRef,
  catalogId: ComponentId,
  workspace: Workspace,
): string | undefined {
  for (const child of ref.children ?? []) {
    const node = workspace.nodes[child.id]
    if (node && getNodeCatalogId(node, workspace) === catalogId) {
      return child.id
    }
    const nested = findPrimitiveChildId(child, catalogId, workspace)
    if (nested) return nested
  }
  return undefined
}

describe("addComponent shared child instances", () => {
  it("reuses default label instance on matching label catalog variant", () => {
    let workspace = createEmptyWorkspace()
    workspace = addComponent({ componentId: ComponentId.BUTTON }, workspace)

    const board = workspace.components[ComponentId.BUTTON] as ComponentBoard
    const defaultRef = board.variants[0]
    const labelVariantRef = board.variants.find(
      (variant) =>
        variant.id ===
        componentBoardSchemaVariantNodeId(ComponentId.BUTTON, "label"),
    )

    expect(defaultRef?.id).toBe(componentBoardDefaultNodeId(ComponentId.BUTTON))
    expect(labelVariantRef).toBeDefined()

    const defaultLabelId = findPrimitiveChildId(
      defaultRef!,
      ComponentId.LABEL,
      workspace,
    )
    const labelVariantLabelId = findPrimitiveChildId(
      labelVariantRef!,
      ComponentId.LABEL,
      workspace,
    )

    expect(defaultLabelId).toBeDefined()
    expect(labelVariantLabelId).toBe(defaultLabelId)
  })

  it("uses a distinct label instance when schema slot overrides differ", () => {
    let workspace = createEmptyWorkspace()
    workspace = addComponent({ componentId: ComponentId.BUTTON }, workspace)

    const board = workspace.components[ComponentId.BUTTON] as ComponentBoard
    const defaultRef = board.variants[0]!
    const socialVariantRef = board.variants.find(
      (variant) =>
        variant.id ===
        componentBoardSchemaVariantNodeId(ComponentId.BUTTON, "social"),
    )!

    const defaultLabelId = findPrimitiveChildId(
      defaultRef,
      ComponentId.LABEL,
      workspace,
    )
    const socialLabelId = findPrimitiveChildId(
      socialVariantRef,
      ComponentId.LABEL,
      workspace,
    )

    expect(defaultLabelId).toBeDefined()
    expect(socialLabelId).toBeDefined()
    expect(socialLabelId).not.toBe(defaultLabelId)
  })
})
