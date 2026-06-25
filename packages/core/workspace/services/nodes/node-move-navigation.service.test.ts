import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import {
  canMoveInstance,
  resolveInstanceMoveTarget,
} from "./node-move-navigation.service"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as never,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const defaultRoot = board.variants[0]!
const userVariant = board.variants
  .slice(1)
  .find((variant) => (variant.children?.length ?? 0) >= 2)!

describe("resolveInstanceMoveTarget", () => {
  it("returns null for an unknown node", () => {
    expect(resolveInstanceMoveTarget(workspace, "nope", "forward")).toBeNull()
  })

  it("returns null for instances inside a default variant", () => {
    const instanceId = defaultRoot.children![0]!.id
    expect(resolveInstanceMoveTarget(workspace, instanceId, "forward")).toBeNull()
  })

  it("resolves a target for a forward move in a user variant", () => {
    const firstChild = userVariant.children![0]!.id
    const target = resolveInstanceMoveTarget(workspace, firstChild, "forward")
    expect(target).not.toBeNull()
    expect(typeof target!.parentId).toBe("string")
    expect(typeof target!.index).toBe("number")
  })
})

describe("canMoveInstance", () => {
  it("is false at the front edge and true moving forward", () => {
    const firstChild = userVariant.children![0]!.id
    expect(canMoveInstance(workspace, firstChild, "backward")).toBe(false)
    expect(canMoveInstance(workspace, firstChild, "forward")).toBe(true)
  })
})
