import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { ValueType } from "../../../properties/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addPlayground } from "./add/add-playground"
import { resetNodeEditorData } from "./reset/reset-node-editor-data"
import { resetNodeLabel } from "./reset/reset-node-label"
import { resetNodeState } from "./reset/reset-node-state"
import { resetNodeStateProperty } from "./reset/reset-node-state-property"
import { setNodeEditorData } from "./set/set-node-editor-data"
import { setNodeRef } from "./set/set-node-ref"
import { setNodeStateProperties } from "./set/set-node-state-properties"
import { setPlaygroundLabel } from "./set/set-playground-label"

const boardKey = ComponentId.BUTTON
const componentWorkspace = () =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const rootId = (ws: Workspace) =>
  (ws.boards[boardKey] as any).variants[0].id as string
const instanceId = (ws: Workspace) =>
  (ws.boards[boardKey] as any).variants[0].children[0].id as string

describe("setNodeEditorData / resetNodeEditorData", () => {
  it("sets and clears node editor data", () => {
    const ws = componentWorkspace()
    const id = rootId(ws)
    const set = setNodeEditorData(
      { nodeId: id, editorData: { n: 1 } } as never,
      ws,
    )
    expect(set.nodes[id]!.__editor).toEqual({ n: 1 })
    const reset = resetNodeEditorData(
      { nodeId: id } as ExtractPayload<"reset_node_editor_data">,
      set,
    )
    expect(reset.nodes[id]!.__editor).toBeUndefined()
  })
})

describe("resetNodeLabel", () => {
  it("is a no-op on a default variant (rename blocked)", () => {
    const ws = componentWorkspace()
    expect(
      resetNodeLabel(
        { nodeId: rootId(ws) } as ExtractPayload<"reset_node_label">,
        ws,
      ),
    ).toBe(ws)
  })
})

describe("resetNodeState / resetNodeStateProperty", () => {
  const seed = (ws: Workspace) =>
    setNodeStateProperties(
      {
        nodeId: rootId(ws),
        state: "hover",
        properties: { opacity: { type: ValueType.EXACT, value: 0.5 } },
      } as ExtractPayload<"set_node_state_properties">,
      ws,
    )

  it("clears one state property", () => {
    const ws = componentWorkspace()
    const id = rootId(ws)
    const seeded = seed(ws)
    const reset = resetNodeStateProperty(
      { nodeId: id, state: "hover", propertyKey: "opacity" } as never,
      seeded,
    )
    expect((reset.nodes[id]!.states?.hover ?? {}).opacity).toBeUndefined()
  })

  it("clears an entire state bag", () => {
    const ws = componentWorkspace()
    const id = rootId(ws)
    const seeded = seed(ws)
    const reset = resetNodeState(
      { nodeId: id, state: "hover" } as never,
      seeded,
    )
    expect(reset.nodes[id]!.states?.hover).toBeUndefined()
  })
})

describe("setNodeRef", () => {
  it("applies a ref to an instance and is a no-op on a default variant", () => {
    const ws = componentWorkspace()
    const instance = instanceId(ws)
    const set = setNodeRef({ nodeId: instance, ref: "my-ref" } as never, ws)
    expect(set.nodes[instance]!.ref).toBe("my-ref")

    expect(setNodeRef({ nodeId: rootId(ws), ref: "x" } as never, ws)).toBe(ws)
  })
})

describe("setPlaygroundLabel", () => {
  it("renames a playground", () => {
    const added = addPlayground(
      { boardKey: "pg-1" } as ExtractPayload<"add_playground">,
      createEmptyWorkspace(),
    )
    const renamed = setPlaygroundLabel(
      {
        playgroundKey: "pg-1",
        label: "My Playground",
      } as ExtractPayload<"set_playground_label">,
      added,
    )
    expect(renamed.playgrounds["pg-1"]!.label).toBe("My Playground")
  })
})
