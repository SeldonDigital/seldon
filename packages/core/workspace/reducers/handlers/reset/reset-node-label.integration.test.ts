import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type {
  ComponentBoard,
  ComponentTreeRef,
  ExtractPayload,
  Workspace,
} from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { addVariant } from "../add/add-variant"
import { resetNodeLabel } from "./reset-node-label"

const boardKey = ComponentId.BUTTON

const withUserVariant = (): { ws: Workspace; userVariantId: string } => {
  let ws = addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )
  const before = (ws.boards[boardKey] as ComponentBoard).variants.map(
    (v: ComponentTreeRef) => v.id,
  )
  ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
  const userVariantId = (ws.boards[boardKey] as ComponentBoard).variants
    .map((v: ComponentTreeRef) => v.id)
    .find((id: string) => !before.includes(id)) as string
  return { ws, userVariantId }
}

describe("resetNodeLabel", () => {
  it("resets a user variant label to 'Custom'", () => {
    const { ws, userVariantId } = withUserVariant()
    const result = resetNodeLabel(
      { nodeId: userVariantId } as ExtractPayload<"reset_node_label">,
      ws,
    )
    expect(result.nodes[userVariantId]!.label).toBe("Custom")
  })

  it("resets an instance label to its template-derived name", () => {
    const { ws, userVariantId } = withUserVariant()
    const instanceId = (ws.boards[boardKey] as ComponentBoard).variants.find(
      (v: ComponentTreeRef) => v.id === userVariantId,
    )!.children![0].id as string

    const result = resetNodeLabel(
      { nodeId: instanceId } as ExtractPayload<"reset_node_label">,
      ws,
    )
    const label = result.nodes[instanceId]!.label
    expect(typeof label).toBe("string")
    expect(label.length).toBeGreaterThan(0)
  })
})
