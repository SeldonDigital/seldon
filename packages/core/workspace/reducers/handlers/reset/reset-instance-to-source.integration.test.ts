import { produce } from "immer"
import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { formatNodeLink } from "../../../model/template-ref"
import type {
  ComponentBoard,
  ComponentTreeRef,
  EntryNode,
  ExtractPayload,
  Workspace,
} from "../../../types"
import { addComponent } from "../add/add-component"
import { addVariant } from "../add/add-variant"
import { insertVariantInstance } from "../insert/insert-variant-instance"
import { setNodeProperties } from "../set/set-node-properties"
import { resetInstanceToSource } from "./reset-instance-to-source"

const boardKey = ComponentId.BUTTON

const overridesOf = (ws: Workspace, id: string) =>
  (ws.nodes[id] as EntryNode).overrides as Record<string, unknown>

const templateOf = (ws: Workspace, id: string) =>
  (ws.nodes[id] as EntryNode).template

const variantIds = (ws: Workspace) =>
  (ws.boards[boardKey] as ComponentBoard).variants.map(
    (v: ComponentTreeRef) => v.id,
  )

const variantRef = (ws: Workspace, id: string) =>
  (ws.boards[boardKey] as ComponentBoard).variants.find(
    (v: ComponentTreeRef) => v.id === id,
  )!

/**
 * Builds a workspace with a user variant (the source) instantiated inside a
 * second user variant (the target). Returns the instance root and child ids
 * alongside the source's matching child id.
 */
function buildInstanceWithChild() {
  let ws = addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

  let prev = variantIds(ws)
  ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
  const sourceId = variantIds(ws).find((id) => !prev.includes(id))!

  prev = variantIds(ws)
  ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
  const targetId = variantIds(ws).find((id) => !prev.includes(id))!

  ws = insertVariantInstance(
    {
      variantId: sourceId,
      target: { parentId: targetId, index: 0 },
    } as ExtractPayload<"insert_variant_instance">,
    ws,
  )

  const instanceRootRef = variantRef(ws, targetId).children![0]!
  const instanceRootId = instanceRootRef.id
  const instanceChildId = instanceRootRef.children![0]!.id
  const sourceChildId = variantRef(ws, sourceId).children![0]!.id

  return { ws, sourceId, instanceRootId, instanceChildId, sourceChildId }
}

describe("resetInstanceToSource", () => {
  it("clears overrides across the instance subtree, root and children", () => {
    const { ws, instanceRootId, instanceChildId } = buildInstanceWithChild()

    let withOverrides = setNodeProperties(
      {
        nodeId: instanceRootId,
        properties: { opacity: { type: ValueType.EXACT, value: 40 } },
      } as ExtractPayload<"set_node_properties">,
      ws,
    )
    withOverrides = setNodeProperties(
      {
        nodeId: instanceChildId,
        properties: { opacity: { type: ValueType.EXACT, value: 60 } },
      } as ExtractPayload<"set_node_properties">,
      withOverrides,
    )
    expect(overridesOf(withOverrides, instanceRootId).opacity).toBeDefined()
    expect(overridesOf(withOverrides, instanceChildId).opacity).toBeDefined()

    const reset = resetInstanceToSource(
      {
        instanceId: instanceRootId,
      } as ExtractPayload<"reset_instance_to_source">,
      withOverrides,
    )

    expect(overridesOf(reset, instanceRootId).opacity).toBeUndefined()
    expect(overridesOf(reset, instanceChildId).opacity).toBeUndefined()
  })

  it("repoints a child template to the source's matching child", () => {
    const { ws, instanceRootId, instanceChildId, sourceChildId } =
      buildInstanceWithChild()

    // Simulate a flattened instance whose child templates a shared baseline
    // instead of the source's child, then carry an override on that child.
    const drifted = produce(ws, (draft) => {
      const child = draft.nodes[instanceChildId] as EntryNode
      child.template = formatNodeLink("component-icon-default")
      child.overrides = { opacity: { type: ValueType.EXACT, value: 80 } }
    })
    expect(templateOf(drifted, instanceChildId)).not.toBe(
      formatNodeLink(sourceChildId),
    )

    const reset = resetInstanceToSource(
      {
        instanceId: instanceRootId,
      } as ExtractPayload<"reset_instance_to_source">,
      drifted,
    )

    expect(templateOf(reset, instanceChildId)).toBe(
      formatNodeLink(sourceChildId),
    )
    expect(overridesOf(reset, instanceChildId).opacity).toBeUndefined()
  })

  it("is a no-op for a non-instance node", () => {
    const { ws, sourceId } = buildInstanceWithChild()
    expect(
      resetInstanceToSource(
        { instanceId: sourceId } as ExtractPayload<"reset_instance_to_source">,
        ws,
      ),
    ).toBe(ws)
  })
})
