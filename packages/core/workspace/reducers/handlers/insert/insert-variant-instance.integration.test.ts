import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { insertVariantInstance } from "./insert-variant-instance"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const defaultRoot = board.variants[0]!
const userVariant = board.variants[1]!

const insert = (variantId: string, parentId: string) =>
  insertVariantInstance(
    {
      variantId,
      target: { parentId, index: 0 },
    } as ExtractPayload<"insert_variant_instance">,
    workspace,
  )

describe("insertVariantInstance", () => {
  it("is a no-op when the source is not a variant", () => {
    const instanceId = defaultRoot.children![0]!.id
    expect(insert(instanceId, userVariant.id)).toBe(workspace)
  })

  it("is a no-op when the target is a default variant", () => {
    expect(insert(userVariant.id, defaultRoot.id)).toBe(workspace)
  })
})
