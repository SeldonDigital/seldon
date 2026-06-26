import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload } from "../../../index"
import { ValueType } from "../../../properties/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addNodeLayer } from "./add/add-node-layer"
import { reorderNodeLayer } from "./reorder/reorder-node-layer"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const nodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

const seed = (value: string) => ({ color: { type: ValueType.EXACT, value } })

const addLayer = (ws: typeof workspace, value: string) =>
  addNodeLayer(
    {
      nodeId,
      property: "background",
      seed: seed(value),
    } as ExtractPayload<"add_node_layer">,
    ws,
  )

const backgroundOf = (ws: typeof workspace) =>
  (ws.nodes[nodeId]!.overrides as Record<string, unknown>).background as Record<
    string,
    unknown
  >[]

describe("addNodeLayer", () => {
  it("appends a seeded layer to the top of the stack", () => {
    const next = addLayer(workspace, "#aaaaaa")
    const layers = backgroundOf(next)
    expect(layers[layers.length - 1].color).toEqual({
      type: ValueType.EXACT,
      value: "#aaaaaa",
    })
  })

  it("is a no-op for a missing node", () => {
    const result = addNodeLayer(
      {
        nodeId: "ghost",
        property: "background",
      } as ExtractPayload<"add_node_layer">,
      workspace,
    )
    expect(result).toBe(workspace)
  })
})

describe("reorderNodeLayer", () => {
  const stacked = addLayer(addLayer(workspace, "#aaaaaa"), "#bbbbbb")
  const length = backgroundOf(stacked).length

  it("moves the top layer to the base index", () => {
    const next = reorderNodeLayer(
      {
        nodeId,
        property: "background",
        fromIndex: length - 1,
        toIndex: 0,
      } as ExtractPayload<"reorder_node_layer">,
      stacked,
    )
    const layers = backgroundOf(next)
    expect(layers).toHaveLength(length)
    expect(layers[0].color).toEqual({ type: ValueType.EXACT, value: "#bbbbbb" })
  })

  it("is a no-op when the indices match", () => {
    const result = reorderNodeLayer(
      {
        nodeId,
        property: "background",
        fromIndex: 0,
        toIndex: 0,
      } as ExtractPayload<"reorder_node_layer">,
      stacked,
    )
    expect(result).toBe(stacked)
  })
})
