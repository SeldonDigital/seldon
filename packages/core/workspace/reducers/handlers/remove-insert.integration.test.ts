import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type {
  EntryNode,
  ExtractPayload,
  InsertDefaultInstance,
  Workspace,
} from "../../types"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addVariant } from "./add/add-variant"
import { insertDefaultInstance } from "./insert/insert-default-instance"
import { removeVariant } from "./remove/remove-variant"

const baseWithButton = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const withUserVariant = () =>
  addVariant(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_variant">,
    baseWithButton(),
  )

const variantIds = (workspace: Workspace): string[] =>
  workspace.boards[ComponentId.BUTTON]!.variants.map((ref) => ref.id)

const userVariantId = (workspace: Workspace): string =>
  variantIds(workspace).find(
    (id) => (workspace.nodes[id] as EntryNode).type === "variant",
  )!

describe("removeVariant", () => {
  it("removes a user variant from its board", () => {
    const workspace = withUserVariant()
    const targetId = userVariantId(workspace)

    const result = removeVariant(
      { variantRootId: targetId } as ExtractPayload<"remove_variant">,
      workspace,
    )

    expect(variantIds(result)).not.toContain(targetId)
    expect(result.nodes[targetId]).toBeUndefined()
  })

  it("leaves the default variant in place because delete is blocked", () => {
    const workspace = withUserVariant()
    const defaultId = variantIds(workspace)[0]!

    expect(
      removeVariant(
        { variantRootId: defaultId } as ExtractPayload<"remove_variant">,
        workspace,
      ),
    ).toBe(workspace)
  })
})

describe("insertDefaultInstance", () => {
  it("inserts a default instance into a user variant", () => {
    const workspace = withUserVariant()
    const parentId = userVariantId(workspace)
    const childBoardKey =
      Object.keys(workspace.boards).find(
        (key) =>
          key !== ComponentId.BUTTON &&
          workspace.boards[key]!.type === "component",
      ) ?? ComponentId.BUTTON

    const result = insertDefaultInstance(
      { boardKey: childBoardKey, parentId, index: 0 } as InsertDefaultInstance,
      workspace,
    )

    expect(Object.keys(result.nodes).length).toBeGreaterThan(
      Object.keys(workspace.nodes).length,
    )
  })

  it("refuses to insert into the default variant", () => {
    const workspace = withUserVariant()
    const defaultId = variantIds(workspace)[0]!

    expect(
      insertDefaultInstance(
        {
          boardKey: ComponentId.BUTTON,
          parentId: defaultId,
          index: 0,
        } as InsertDefaultInstance,
        workspace,
      ),
    ).toBe(workspace)
  })
})
