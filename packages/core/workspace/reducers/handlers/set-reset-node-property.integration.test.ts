import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { ValueType } from "../../../properties/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import type { EntryNode, ExtractPayload, Workspace } from "../../types"
import { addComponent } from "./add/add-component"
import { resetNodeProperty } from "./reset/reset-node-property"
import { setNodeProperties } from "./set/set-node-properties"

const baseWithButton = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const defaultNodeId = (workspace: Workspace) =>
  workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

const overridesOf = (workspace: Workspace, id: string) =>
  (workspace.nodes[id] as EntryNode).overrides as Record<string, unknown>

describe("setNodeProperties then resetNodeProperty", () => {
  it("stores an override and then drops it on reset", () => {
    const workspace = baseWithButton()
    const nodeId = defaultNodeId(workspace)

    const afterSet = setNodeProperties(
      {
        nodeId,
        properties: { opacity: { type: ValueType.EXACT, value: 50 } },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )
    expect(overridesOf(afterSet, nodeId).opacity).toEqual({
      type: ValueType.EXACT,
      value: 50,
    })

    const afterReset = resetNodeProperty(
      {
        nodeId,
        propertyKey: "opacity",
      } as ExtractPayload<"reset_node_property">,
      afterSet,
    )
    expect(overridesOf(afterReset, nodeId).opacity).toBeUndefined()
  })
})
