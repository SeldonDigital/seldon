import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import type { EntryNode, ExtractPayload, Workspace } from "../../../types"
import { addComponent } from "../add/add-component"
import { setNodeProperties } from "../set/set-node-properties"
import { resetNode } from "./reset-node"

const overridesOf = (workspace: Workspace, id: string) =>
  (workspace.nodes[id] as EntryNode).overrides as Record<string, unknown>

describe("resetNode", () => {
  it("clears every override on the node", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
      createEmptyWorkspace(),
    )
    const nodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

    const withOverride = setNodeProperties(
      {
        nodeId,
        properties: { opacity: { type: ValueType.EXACT, value: 50 } },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )
    expect(overridesOf(withOverride, nodeId).opacity).toBeDefined()

    const reset = resetNode(
      { nodeId } as ExtractPayload<"reset_node">,
      withOverride,
    )
    expect(overridesOf(reset, nodeId).opacity).toBeUndefined()
  })
})
