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
import { insertVariantInstance } from "./insert-variant-instance"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const defaultRoot = board.variants[0]! as ComponentTreeRef
const userVariant = board.variants[1]!

const insert = (variantId: string, parentId: string) =>
  insertVariantInstance(
    {
      variantId,
      target: { parentId, index: 0 },
    } as ExtractPayload<"insert_variant_instance">,
    workspace,
  )

describe("insertVariantInstance", () => {
  it("is a no-op when the source is not a variant", () => {
    const instanceId = defaultRoot.children![0]!.id
    expect(insert(instanceId, userVariant.id)).toBe(workspace)
  })

  it("is a no-op when the target is a default variant", () => {
    expect(insert(userVariant.id, defaultRoot.id)).toBe(workspace)
  })
})

describe("insertVariantInstance (happy path)", () => {
  const boardKey = ComponentId.BUTTON

  const twoUserVariants = (): {
    ws: Workspace
    sourceId: string
    targetId: string
  } => {
    let ws = addComponent(
      { boardKey } as ExtractPayload<"add_component">,
      createEmptyWorkspace(),
    )
    const baseIds = (ws.boards[boardKey] as ComponentBoard).variants.map(
      (v: ComponentTreeRef) => v.id,
    )
    ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
    ws = addVariant({ boardKey } as ExtractPayload<"add_variant">, ws)
    const newIds = (ws.boards[boardKey] as ComponentBoard).variants
      .map((v: ComponentTreeRef) => v.id)
      .filter((id: string) => !baseIds.includes(id))
    return { ws, sourceId: newIds[0], targetId: newIds[1] }
  }

  it("instantiates a user variant into another user variant", () => {
    const { ws, sourceId, targetId } = twoUserVariants()
    const targetRef = (w: Workspace) =>
      (w.boards[boardKey] as ComponentBoard).variants.find(
        (v: ComponentTreeRef) => v.id === targetId,
      )!
    const before = targetRef(ws).children?.length ?? 0

    const result = insertVariantInstance(
      {
        variantId: sourceId,
        target: { parentId: targetId, index: 0 },
      } as ExtractPayload<"insert_variant_instance">,
      ws,
    )

    expect(result).not.toBe(ws)
    expect(targetRef(result).children!.length).toBe(before + 1)
  })
})
