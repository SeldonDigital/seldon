import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { parseNodeLink } from "../../../model/template-ref"
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
import { resetVariantInstances } from "./reset-variant-instances"

const boardKey = ComponentId.BUTTON

const overridesOf = (ws: Workspace, id: string) =>
  (ws.nodes[id] as EntryNode).overrides as Record<string, unknown>

const variantIds = (ws: Workspace) =>
  (ws.boards[boardKey] as ComponentBoard).variants.map(
    (v: ComponentTreeRef) => v.id,
  )

const addUserVariant = (ws: Workspace): [Workspace, string] => {
  const prev = variantIds(ws)
  const next = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
  return [next, variantIds(next).find((id) => !prev.includes(id))!]
}

const instanceOf = (ws: Workspace, variantId: string) =>
  Object.values(ws.nodes).find(
    (node) =>
      (node as EntryNode).type === "instance" &&
      parseNodeLink((node as EntryNode).template)?.nodeId === variantId,
  )!.id

const setOpacity = (ws: Workspace, nodeId: string) =>
  setNodeProperties(
    {
      nodeId,
      properties: { opacity: { type: ValueType.EXACT, value: 50 } },
    } as ExtractPayload<"set_node_properties">,
    ws,
  )

/** Instantiates two distinct source variants into a third target variant. */
function buildTwoInstances() {
  let ws = addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )
  const defaultRootId = variantIds(ws)[0]!

  const [wsAfterA, sourceA] = addUserVariant(ws)
  const [wsAfterB, sourceB] = addUserVariant(wsAfterA)
  const [wsAfterTarget, target] = addUserVariant(wsAfterB)
  ws = wsAfterTarget

  ws = insertVariantInstance(
    {
      variantId: sourceA,
      target: { parentId: target, index: 0 },
    } as ExtractPayload<"insert_variant_instance">,
    ws,
  )
  ws = insertVariantInstance(
    {
      variantId: sourceB,
      target: { parentId: target, index: 0 },
    } as ExtractPayload<"insert_variant_instance">,
    ws,
  )

  const instanceA = instanceOf(ws, sourceA)
  const instanceB = instanceOf(ws, sourceB)
  return { ws, defaultRootId, sourceA, sourceB, target, instanceA, instanceB }
}

describe("resetVariantInstances", () => {
  it("resets every direct instance of the variant, leaving others untouched", () => {
    const { ws, sourceA, instanceA, instanceB } = buildTwoInstances()

    let withOverrides = setOpacity(ws, instanceA)
    withOverrides = setOpacity(withOverrides, instanceB)
    expect(overridesOf(withOverrides, instanceA).opacity).toBeDefined()
    expect(overridesOf(withOverrides, instanceB).opacity).toBeDefined()

    const reset = resetVariantInstances(
      { variantRootId: sourceA } as ExtractPayload<"reset_variant_instances">,
      withOverrides,
    )

    expect(overridesOf(reset, instanceA).opacity).toBeUndefined()
    expect(overridesOf(reset, instanceB).opacity).toBeDefined()
  })

  it("is a no-op for a default variant root", () => {
    const { ws, defaultRootId } = buildTwoInstances()
    expect(
      resetVariantInstances(
        {
          variantRootId: defaultRootId,
        } as ExtractPayload<"reset_variant_instances">,
        ws,
      ),
    ).toBe(ws)
  })

  it("is a no-op for a user variant with no instances", () => {
    const { ws, target } = buildTwoInstances()
    expect(
      resetVariantInstances(
        { variantRootId: target } as ExtractPayload<"reset_variant_instances">,
        ws,
      ),
    ).toBe(ws)
  })
})
