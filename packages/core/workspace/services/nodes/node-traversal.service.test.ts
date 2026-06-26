import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type {
  ComponentBoard,
  ExtractPayload,
  Instance,
  Variant,
  Workspace,
} from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { nodeTraversalService as svc } from "./node-traversal.service"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as ComponentBoard).variants[0].id as string
const childId = (board as ComponentBoard).variants[0].children![0].id as string
const variant = ws.nodes[rootId] as Variant
const instance = ws.nodes[childId] as Instance

describe("findParentNode", () => {
  it("finds the parent of a child and null for a root", () => {
    expect(svc.findParentNode(childId, ws)?.id).toBe(rootId)
    expect(svc.findParentNode(rootId, ws)).toBeNull()
  })
})

describe("getNodePath", () => {
  it("returns an empty path for a variant root", () => {
    expect(svc.getNodePath(variant, ws)).toEqual([])
  })

  it("returns an array path for an instance", () => {
    expect(Array.isArray(svc.getNodePath(instance, ws))).toBe(true)
  })
})

describe("findNodeByPath", () => {
  it("returns the start node for an empty path", () => {
    expect(svc.findNodeByPath(variant, [], ws)?.id).toBe(rootId)
  })
})
