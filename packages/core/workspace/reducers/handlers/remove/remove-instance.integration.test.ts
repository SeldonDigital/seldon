import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type {
  ComponentBoard,
  ComponentTreeRef,
  ExtractPayload,
  Workspace,
} from "../../../../index"
import { Display } from "../../../../properties"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { addVariant } from "../add/add-variant"
import { removeInstance } from "./remove-instance"

const boardKey = ComponentId.BUTTON

const baseWithButton = (): Workspace =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const defaultRef = (ws: Workspace) =>
  (ws.boards[boardKey] as ComponentBoard).variants[0]

const withUserVariant = (): { ws: Workspace; userVariantId: string } => {
  const before = baseWithButton()
  const beforeIds = (before.boards[boardKey] as ComponentBoard).variants.map(
    (v: ComponentTreeRef) => v.id,
  )
  const ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, before)
  const userVariantId = (ws.boards[boardKey] as ComponentBoard).variants
    .map((v: ComponentTreeRef) => v.id)
    .find((id: string) => !beforeIds.includes(id)) as string
  return { ws, userVariantId }
}

describe("removeInstance", () => {
  it("hides a schema-defined instance in the default variant", () => {
    const ws = baseWithButton()
    const childId = defaultRef(ws).children![0].id as string

    const result = removeInstance(
      { instanceId: childId } as ExtractPayload<"remove_instance">,
      ws,
    )

    expect(result.nodes[childId]).toBeDefined()
    expect(
      (result.nodes[childId]!.overrides as { display: { value: unknown } })
        .display.value,
    ).toBe(Display.EXCLUDE)
  })

  it("deletes an instance outright inside a user variant", () => {
    const { ws, userVariantId } = withUserVariant()
    const variant = (w: Workspace) =>
      (w.boards[boardKey] as ComponentBoard).variants.find(
        (v: ComponentTreeRef) => v.id === userVariantId,
      )!
    const childId = variant(ws).children![0].id as string
    const before = variant(ws).children!.length

    const result = removeInstance(
      { instanceId: childId } as ExtractPayload<"remove_instance">,
      ws,
    )

    expect(variant(result).children!.length).toBe(before - 1)
    expect(
      variant(result).children!.map((c: ComponentTreeRef) => c.id),
    ).not.toContain(childId)
  })

  it("is a no-op for a non-instance node", () => {
    const ws = baseWithButton()
    const rootId = defaultRef(ws).id as string
    expect(
      removeInstance(
        { instanceId: rootId } as ExtractPayload<"remove_instance">,
        ws,
      ),
    ).toBe(ws)
  })
})
