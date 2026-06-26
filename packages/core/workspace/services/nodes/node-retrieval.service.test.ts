import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { nodeRetrievalService as svc } from "./node-retrieval.service"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as any).variants[0].id as string
const childId = (board as any).variants[0].children[0].id as string

describe("getBoard / getObject", () => {
  it("returns boards and throws for unknown keys", () => {
    expect(svc.getBoard(boardKey, ws)).toBe(board)
    expect(() => svc.getBoard("missing" as any, ws)).toThrow()
    expect(svc.getObject(boardKey, ws)).toBe(board)
    expect(svc.getObject(rootId, ws)).toBe(ws.nodes[rootId])
  })
})

describe("getNode / getNodes", () => {
  it("returns nodes and lists all of them", () => {
    expect(svc.getNode(rootId, ws).id).toBe(rootId)
    expect(() => svc.getNode("missing", ws)).toThrow()
    expect(svc.getNodes(ws).length).toBeGreaterThan(0)
  })
})

describe("getVariant / getDefaultVariant / getInstance", () => {
  it("resolves variant and instance rows with type guards", () => {
    expect(svc.getVariant(rootId, ws).type).toBe("default")
    expect(svc.getDefaultVariant(boardKey, ws).id).toBe(rootId)
    expect(svc.getInstance(childId, ws).type).toBe("instance")
  })

  it("throws when the type does not match", () => {
    expect(() => svc.getVariant(childId, ws)).toThrow()
    expect(() => svc.getInstance(rootId, ws)).toThrow()
  })
})
