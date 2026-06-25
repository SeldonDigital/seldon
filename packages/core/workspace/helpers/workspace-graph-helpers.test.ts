import { describe, expect, it } from "vitest"

import { ComponentId } from "../../components/constants"
import type { EntryNode, ExtractPayload, Workspace } from "../../index"
import { addComponent } from "../reducers/handlers/add/add-component"
import { isSpecialBoardVariant } from "./general/is-special-board-variant"
import { getVariantIndex } from "./general/get-variant-index"
import { createEmptyWorkspace } from "./create-empty-workspace"
import { canNodeHaveChildren } from "./nodes/can-node-have-children"
import { getComponentDescendantIds } from "./nodes/get-descendant-ids"
import { getNodeSubtreeIds } from "./nodes/get-node-subtree-ids"

const componentWorkspace = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const rootId = (ws: Workspace) => (ws.boards[ComponentId.BUTTON] as any).variants[0].id as string

describe("getVariantIndex", () => {
  it("returns 0 for the default variant root and -1 for unknown ids", () => {
    const ws = componentWorkspace()
    expect(getVariantIndex(rootId(ws), ws)).toBe(0)
    expect(getVariantIndex("missing" as any, ws)).toBe(-1)
  })
})

describe("getNodeSubtreeIds", () => {
  it("includes the root and its descendants", () => {
    const ws = componentWorkspace()
    const ids = getNodeSubtreeIds(rootId(ws) as any, ws)
    expect(ids).toContain(rootId(ws))
    expect(ids.length).toBeGreaterThan(1)
  })

  it("returns just the id for a node with no tree", () => {
    const ws = componentWorkspace()
    expect(getNodeSubtreeIds("orphan" as any, ws)).toEqual(["orphan"])
  })
})

describe("isSpecialBoardVariant", () => {
  it("is true for a resource board entry and false for a component root", () => {
    const ws = componentWorkspace()
    expect(
      isSpecialBoardVariant({ id: "theme-seldon-default" } as EntryNode, ws),
    ).toBe(true)
    expect(
      isSpecialBoardVariant(ws.nodes[rootId(ws)]!, ws),
    ).toBe(false)
  })
})

describe("canNodeHaveChildren", () => {
  it("is true for a component node and false for null", () => {
    const ws = componentWorkspace()
    expect(canNodeHaveChildren(ws.nodes[rootId(ws)]!, ws)).toBe(true)
    expect(canNodeHaveChildren(null, ws)).toBe(false)
  })
})

describe("getComponentDescendantIds", () => {
  it("lists the root component first", () => {
    const ids = getComponentDescendantIds(ComponentId.BUTTON)
    expect(ids[0]).toBe(ComponentId.BUTTON)
    expect(ids.length).toBeGreaterThan(0)
  })
})
