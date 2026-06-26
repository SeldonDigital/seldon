import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { ValueType } from "../../../../properties/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { setNodeStateProperties } from "./set-node-state-properties"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const defaultRoot = workspace.boards[ComponentId.BUTTON]!.variants[0]!

const hoverOpacity = (nodeId: string) =>
  setNodeStateProperties(
    {
      nodeId,
      state: "hover",
      properties: { opacity: { type: ValueType.EXACT, value: 0.5 } },
    } as ExtractPayload<"set_node_state_properties">,
    workspace,
  )

describe("setNodeStateProperties", () => {
  it("writes a hover override onto a variant node", () => {
    const next = hoverOpacity(defaultRoot.id)
    const states = next.nodes[defaultRoot.id]!.states

    expect(states?.hover).toBeDefined()
    expect(states!.hover).toMatchObject({
      opacity: { type: ValueType.EXACT, value: 0.5 },
    })
  })

  it("is a no-op on an instance because state authoring is blocked", () => {
    const instanceId = defaultRoot.children![0]!.id
    expect(hoverOpacity(instanceId)).toBe(workspace)
  })
})
