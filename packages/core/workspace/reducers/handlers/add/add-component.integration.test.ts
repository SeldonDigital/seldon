import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { setNodeLabel } from "../set/set-node-label"
import { addComponent } from "./add-component"

const addButton = (workspace = createEmptyWorkspace()) =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    workspace,
  )

describe("addComponent", () => {
  it("creates the board and its default variant node", () => {
    const workspace = addButton()

    const board = workspace.boards[ComponentId.BUTTON]
    expect(board).toBeDefined()
    expect(board?.variants.length).toBeGreaterThan(0)

    const defaultNodeId = board!.variants[0]!.id
    expect(workspace.nodes[defaultNodeId]).toBeDefined()
    expect(workspace.nodes[defaultNodeId]!.type).toBe("default")
  })

  it("is a no-op when the board already exists", () => {
    const once = addButton()
    expect(addButton(once)).toBe(once)
  })
})

describe("setNodeLabel rule gate", () => {
  it("leaves a default variant unchanged because rename is blocked", () => {
    const workspace = addButton()
    const defaultNodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

    const result = setNodeLabel(
      { nodeId: defaultNodeId, label: "Renamed" } as ExtractPayload<"set_node_label">,
      workspace,
    )

    expect(result).toBe(workspace)
  })
})
