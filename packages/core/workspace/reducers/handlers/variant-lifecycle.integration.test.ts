import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { EntryNode, ExtractPayload, Workspace } from "../../types"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addVariant } from "./add/add-variant"
import { duplicateNode } from "./duplicate/duplicate-node"
import { reorderVariantInBoard } from "./reorder/reorder-variant-in-board"

const buttonBoard = (workspace: Workspace) =>
  workspace.boards[ComponentId.BUTTON]!

const addButtonVariant = (workspace: Workspace) =>
  addVariant(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_variant">,
    workspace,
  )

const baseWithButton = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const variantIds = (workspace: Workspace): string[] =>
  buttonBoard(workspace).variants.map((ref) => ref.id)

describe("addVariant", () => {
  it("appends a user variant by duplicating the default", () => {
    const before = baseWithButton()
    const after = addButtonVariant(before)

    expect(variantIds(after).length).toBe(variantIds(before).length + 1)

    const newId = variantIds(after).find((id) => !variantIds(before).includes(id))
    expect((after.nodes[newId!] as EntryNode).type).toBe("variant")
  })
})

describe("reorderVariantInBoard", () => {
  it("moves a user variant while the default stays pinned at index 0", () => {
    const workspace = addButtonVariant(addButtonVariant(baseWithButton()))
    const order = variantIds(workspace)
    const lastVariantId = order[order.length - 1]!

    const result = reorderVariantInBoard(
      {
        variantRootId: lastVariantId,
        newIndex: 1,
      } as ExtractPayload<"reorder_variant_in_board">,
      workspace,
    )

    const newOrder = variantIds(result)
    expect(newOrder[0]).toBe(order[0])
    expect(newOrder[1]).toBe(lastVariantId)
    expect(newOrder).not.toEqual(order)
  })
})

describe("duplicateNode", () => {
  it("copies a user variant into a new node", () => {
    const workspace = addButtonVariant(baseWithButton())
    const userVariantId = variantIds(workspace).find(
      (id) => (workspace.nodes[id] as EntryNode).type === "variant",
    )!

    const result = duplicateNode(
      { nodeId: userVariantId } as ExtractPayload<"duplicate_node">,
      workspace,
    )

    expect(variantIds(result).length).toBe(variantIds(workspace).length + 1)
  })
})
