import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload } from "../../../index"
import { ValueType } from "../../../properties/constants"
import { BackgroundKind } from "../../../properties/values/appearance/background/background-kind"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addNodeLayer } from "./add/add-node-layer"
import { removeNodeLayer } from "./remove/remove-node-layer"
import { setNodeLayerKind } from "./set/set-node-layer-kind"

const base = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const nodeId = base.boards[ComponentId.BUTTON]!.variants[0]!.id

const withTwoLayers = addNodeLayer(
  {
    nodeId,
    property: "background",
    seed: { tag: "extra" },
  } as ExtractPayload<"add_node_layer">,
  base,
)

const backgroundOf = (ws: typeof base) =>
  (ws.nodes[nodeId]!.overrides as Record<string, unknown>).background as Record<
    string,
    unknown
  >[]

describe("removeNodeLayer", () => {
  it("removes a non-base layer and shortens the stack", () => {
    const length = backgroundOf(withTwoLayers).length
    const next = removeNodeLayer(
      {
        nodeId,
        property: "background",
        index: length - 1,
      } as ExtractPayload<"remove_node_layer">,
      withTwoLayers,
    )
    expect(backgroundOf(next)).toHaveLength(length - 1)
  })

  it("refuses to remove the base layer at index 0", () => {
    expect(
      removeNodeLayer(
        {
          nodeId,
          property: "background",
          index: 0,
        } as ExtractPayload<"remove_node_layer">,
        withTwoLayers,
      ),
    ).toBe(withTwoLayers)
  })

  it("is a no-op for a missing node", () => {
    expect(
      removeNodeLayer(
        {
          nodeId: "ghost",
          property: "background",
          index: 1,
        } as ExtractPayload<"remove_node_layer">,
        withTwoLayers,
      ),
    ).toBe(withTwoLayers)
  })
})

describe("setNodeLayerKind", () => {
  it("retypes a layer slot to the kind's seed facets", () => {
    const next = setNodeLayerKind(
      {
        nodeId,
        property: "background",
        layerIndex: 0,
        kind: BackgroundKind.COLOR,
      } as ExtractPayload<"set_node_layer_kind">,
      base,
    )
    expect(backgroundOf(next)[0].kind).toEqual({
      type: ValueType.OPTION,
      value: BackgroundKind.COLOR,
    })
  })

  it("is a no-op for a kind with no seed", () => {
    expect(
      setNodeLayerKind(
        {
          nodeId,
          property: "background",
          kind: "bogus",
        } as ExtractPayload<"set_node_layer_kind">,
        base,
      ),
    ).toBe(base)
  })
})
