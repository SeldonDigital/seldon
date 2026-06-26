import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type {
  ComponentBoard,
  EntryNode,
  ExtractPayload,
  Workspace,
} from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { insertDefaultInstance } from "./insert-default-instance"
import { insertDuplicateInstance } from "./insert-duplicate-instance"

const boardKey = ComponentId.BUTTON

const componentWorkspace = () =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const defaultRootId = (ws: Workspace) =>
  (ws.boards[boardKey] as ComponentBoard).variants[0].id as string

const anyInstanceId = (ws: Workspace) =>
  Object.values(ws.nodes).find((n: EntryNode) => n.type === "instance")!
    .id as string

describe("insertDefaultInstance", () => {
  it("is a no-op when the target parent is a default variant", () => {
    const ws = componentWorkspace()
    const result = insertDefaultInstance(
      { parentId: defaultRootId(ws), boardKey } as never,
      ws,
    )
    expect(result).toBe(ws)
  })
})

describe("insertDuplicateInstance", () => {
  it("is a no-op when the source is not an instance", () => {
    const ws = componentWorkspace()
    const result = insertDuplicateInstance(
      {
        instanceId: defaultRootId(ws),
        target: { parentId: defaultRootId(ws) },
      } as never,
      ws,
    )
    expect(result).toBe(ws)
  })

  it("is a no-op when the target parent is a default variant", () => {
    const ws = componentWorkspace()
    const result = insertDuplicateInstance(
      {
        instanceId: anyInstanceId(ws),
        target: { parentId: defaultRootId(ws) },
      } as never,
      ws,
    )
    expect(result).toBe(ws)
  })
})
