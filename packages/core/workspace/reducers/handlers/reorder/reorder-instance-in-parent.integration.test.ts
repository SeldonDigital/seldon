import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { reorderInstanceInParent } from "./reorder-instance-in-parent"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const defaultRoot = board.variants[0]!
const userVariant = board.variants
  .slice(1)
  .find((variant) => (variant.children?.length ?? 0) >= 2)!

describe("reorderInstanceInParent", () => {
  it("moves an instance to a new index within its parent", () => {
    const firstChild = userVariant.children![0]!.id

    const next = reorderInstanceInParent(
      {
        instanceId: firstChild,
        newIndex: 1,
      } as ExtractPayload<"reorder_instance_in_parent">,
      workspace,
    )

    const after = next.boards[ComponentId.BUTTON]!.variants.find(
      (variant) => variant.id === userVariant.id,
    )!.children!.map((child) => child.id)

    expect(next).not.toBe(workspace)
    expect(after[0]).not.toBe(firstChild)
    expect(after).toHaveLength(userVariant.children!.length)
  })

  it("is a no-op for a non-instance node", () => {
    const result = reorderInstanceInParent(
      {
        instanceId: defaultRoot.id,
        newIndex: 1,
      } as ExtractPayload<"reorder_instance_in_parent">,
      workspace,
    )

    expect(result).toBe(workspace)
  })
})
