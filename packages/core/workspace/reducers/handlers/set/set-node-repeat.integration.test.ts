import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { getNodeRepeat } from "../../../helpers/nodes/node-repeat"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { setNodeRepeat } from "./set-node-repeat"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const nodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

describe("setNodeRepeat", () => {
  it("stores a meaningful repeat and clears it again", () => {
    const withRepeat = setNodeRepeat(
      { nodeId, repeat: { count: 3 } } as ExtractPayload<"set_node_repeat">,
      workspace,
    )
    expect(getNodeRepeat(withRepeat.nodes[nodeId]!)).toEqual({ count: 3 })

    const cleared = setNodeRepeat(
      { nodeId, repeat: undefined } as ExtractPayload<"set_node_repeat">,
      withRepeat,
    )
    expect(getNodeRepeat(cleared.nodes[nodeId]!)).toBeUndefined()
  })

  it("ignores a non-meaningful repeat of count 1", () => {
    const next = setNodeRepeat(
      { nodeId, repeat: { count: 1 } } as ExtractPayload<"set_node_repeat">,
      workspace,
    )
    expect(getNodeRepeat(next.nodes[nodeId]!)).toBeUndefined()
  })
})
