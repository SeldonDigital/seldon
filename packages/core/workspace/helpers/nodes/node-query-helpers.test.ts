import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { EntryNode, ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { findParentNode } from "./find-parent-node"
import { getChildIndex } from "./get-child-index"
import { getNodeCatalogId } from "./get-node-catalog-id"
import { isVariantNode } from "./is-variant-node"
import { resolveLayoutMode } from "./resolve-layout-mode"
import { resolveNodeRepeat } from "./resolve-node-repeat"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const rootId = (ws.boards[boardKey] as any).variants[0].id as string
const childId = (ws.boards[boardKey] as any).variants[0].children[0].id as string

describe("findParentNode", () => {
  it("finds the parent of a child and null for a root", () => {
    expect(findParentNode(childId, ws)?.id).toBe(rootId)
    expect(findParentNode(rootId, ws)).toBeNull()
  })
})

describe("getChildIndex", () => {
  it("returns the index of the first child", () => {
    expect(getChildIndex(childId, ws)).toBe(0)
  })
})

describe("getNodeCatalogId", () => {
  it("resolves the catalog id of the root node", () => {
    expect(getNodeCatalogId(ws.nodes[rootId]!, ws)).toBe(ComponentId.BUTTON)
  })
})

describe("isVariantNode", () => {
  it("matches variant rows and rejects instances", () => {
    expect(isVariantNode(ws.nodes[rootId])).toBe(true)
    expect(isVariantNode(ws.nodes[childId])).toBe(false)
    expect(isVariantNode(undefined)).toBe(false)
  })
})

describe("resolveLayoutMode", () => {
  it("resolves to a known layout mode", () => {
    expect(["flexbox", "grid"]).toContain(resolveLayoutMode(ws.nodes[rootId]!, ws))
  })

  it("falls back to flexbox for a node with no catalog id", () => {
    expect(
      resolveLayoutMode({ id: "x", template: "node:missing" } as EntryNode, ws),
    ).toBe("flexbox")
  })
})

describe("resolveNodeRepeat", () => {
  it("is undefined when no repeat is set anywhere", () => {
    expect(resolveNodeRepeat(rootId, ws)).toBeUndefined()
  })
})
