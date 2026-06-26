import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { nodeRelationshipService as svc } from "./node-relationship.service"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as any).variants[0].id as string
const childId = (board as any).variants[0].children[0].id as string
const variant = ws.nodes[rootId] as any
const instance = ws.nodes[childId] as any

describe("index lookups", () => {
  it("resolves variant and instance indices", () => {
    expect(svc.getVariantIndex(variant, ws)).toBe(0)
    expect(svc.getInstanceIndex(instance, ws)).toBe(0)
  })
})

describe("board lookups", () => {
  it("finds the owning board for a node and a variant", () => {
    expect(svc.findBoardForNode(instance, ws)).toBe(board)
    expect(svc.findBoardForVariant(variant, ws)).toBe(board)
  })
})

describe("ancestry", () => {
  it("walks to the root variant and groups by variant", () => {
    expect(svc.getRootVariant(instance, ws).id).toBe(rootId)
    expect(svc.areWithinSameVariant(instance, variant, ws)).toBe(true)
  })

  it("isParentOfNode reflects the tree direction", () => {
    expect(svc.isParentOfNode(rootId, childId, ws)).toBe(true)
    expect(svc.isParentOfNode(childId, rootId, ws)).toBe(false)
    expect(svc.isParentOfNode(rootId, rootId, ws)).toBe(false)
  })

  it("isDirectChildOfVariant detects a variant's own child", () => {
    expect(svc.isDirectChildOfVariant(instance, ws)).toBe(true)
  })

  it("hasAncestorWithComponentId matches the button ancestor and board", () => {
    expect(svc.hasAncestorWithComponentId(ComponentId.BUTTON, instance, ws)).toBe(
      true,
    )
    expect(svc.hasAncestorWithComponentId(ComponentId.BUTTON, board, ws)).toBe(true)
  })
})

describe("getComponentName", () => {
  it("resolves the schema name from a component id and a node id", () => {
    const fromCatalog = svc.getComponentName(ComponentId.BUTTON, ws)
    expect(fromCatalog.length).toBeGreaterThan(0)
    expect(svc.getComponentName(rootId, ws)).toBe(fromCatalog)
  })
})

describe("findInstances", () => {
  it("returns an array of linked instances", () => {
    expect(Array.isArray(svc.findInstances(variant, ws))).toBe(true)
  })
})
