import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ComponentTreeRef, ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { moveInstanceDirectional } from "./move-instance-directional"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const variants = board.variants as ComponentTreeRef[]
const defaultRoot = variants[0]!
const userVariant = variants
  .slice(1)
  .find((variant) => (variant.children?.length ?? 0) >= 2)!

const directional = (instanceId: string, direction: string) =>
  moveInstanceDirectional(
    { instanceId, direction } as ExtractPayload<"move_instance_directional">,
    workspace,
  )

describe("moveInstanceDirectional", () => {
  it("is a no-op for an instance inside a default variant", () => {
    const instanceId = defaultRoot.children![0]!.id
    expect(directional(instanceId, "forward")).toBe(workspace)
  })

  it("is a no-op moving the front instance backward", () => {
    const firstChild = userVariant.children![0]!.id
    expect(directional(firstChild, "backward")).toBe(workspace)
  })

  it("moves the front instance forward in a user variant", () => {
    const firstChild = userVariant.children![0]!.id
    expect(directional(firstChild, "forward")).not.toBe(workspace)
  })
})
