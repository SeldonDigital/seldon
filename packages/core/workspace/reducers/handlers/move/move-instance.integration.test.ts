import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ComponentTreeRef, ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { moveInstance } from "./move-instance"

const buildButton = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const defaultTree = (workspace: ReturnType<typeof buildButton>) =>
  workspace.boards[ComponentId.BUTTON]!.variants[0]! as ComponentTreeRef

describe("moveInstance", () => {
  it("moves a schema instance to a new index under its parent", () => {
    const workspace = buildButton()
    const tree = defaultTree(workspace)
    const parentId = tree.id
    const before = (tree.children ?? []).map((child) => child.id)
    const moved = before[before.length - 1]!

    const next = moveInstance(
      {
        instanceId: moved,
        target: { parentId, index: 0 },
      } as ExtractPayload<"move_instance">,
      workspace,
    )

    const after = (defaultTree(next).children ?? []).map((child) => child.id)
    expect(after[0]).toBe(moved)
    expect(after).toHaveLength(before.length)
    expect(next).not.toBe(workspace)
  })

  it("is a no-op when the target is a default variant root (move blocked)", () => {
    const workspace = buildButton()
    const parentId = defaultTree(workspace).id

    const result = moveInstance(
      {
        instanceId: parentId,
        target: { parentId, index: 0 },
      } as ExtractPayload<"move_instance">,
      workspace,
    )

    expect(result).toBe(workspace)
  })
})
