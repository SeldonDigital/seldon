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
import { insertDefaultInstance } from "./insert-default-instance"
import { insertDuplicateInstance } from "./insert-duplicate-instance"

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

const variantRef = (ws: Workspace, id: string) =>
  (ws.boards[boardKey] as ComponentBoard).variants.find(
    (v: ComponentTreeRef) => v.id === id,
  )!

describe("insertDefaultInstance (happy path)", () => {
  it("inserts a default instance into a non-default user variant", () => {
    const { ws, userVariantId } = withUserVariant()
    const beforeChildren = variantRef(ws, userVariantId).children?.length ?? 0

    const result = insertDefaultInstance(
      { boardKey, parentId: userVariantId, index: 0 } as never,
      ws,
    )

    expect(result).not.toBe(ws)
    expect(variantRef(result, userVariantId).children.length).toBe(
      beforeChildren + 1,
    )
  })
})

describe("insertDuplicateInstance (happy path)", () => {
  it("duplicates an existing instance into a non-default user variant", () => {
    const { ws, userVariantId } = withUserVariant()
    const instanceId = variantRef(ws, userVariantId).children[0].id as string
    const beforeChildren = variantRef(ws, userVariantId).children.length

    const result = insertDuplicateInstance(
      { instanceId, target: { parentId: userVariantId, index: 0 } } as never,
      ws,
    )

    expect(result).not.toBe(ws)
    expect(variantRef(result, userVariantId).children.length).toBe(
      beforeChildren + 1,
    )
  })
})
