import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import {
  withBoardMutation,
  withInstanceAndParentMutation,
  withNodeMutation,
  withParentNode,
  withVariantAndBoardMutation,
} from "./workspace-operation-helpers"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as any).variants[0].id as string
const childId = (board as any).variants[0].children[0].id as string

describe("withNodeMutation", () => {
  it("mutates a node immutably and throws for unknown ids", () => {
    const next = withNodeMutation(rootId, ws, (node) => {
      node.label = "Renamed"
    })
    expect(next.nodes[rootId]!.label).toBe("Renamed")
    expect(ws.nodes[rootId]!.label).not.toBe("Renamed")
    expect(() => withNodeMutation("missing", ws, () => {})).toThrow()
  })
})

describe("withBoardMutation", () => {
  it("mutates a board immutably", () => {
    const next = withBoardMutation(boardKey, ws, (b) => {
      ;(b as any).label = "Board X"
    })
    expect((next.boards[boardKey] as any).label).toBe("Board X")
  })
})

describe("withParentNode", () => {
  it("returns the parent of a child node", () => {
    expect(withParentNode(childId, ws).id).toBe(rootId)
  })

  it("returns parent plus operation result when given an operation", () => {
    const { parent, result } = withParentNode(childId, ws, (p) => p.type)
    expect(parent.id).toBe(rootId)
    expect(result).toBe("default")
  })

  it("throws at a root variant with no parent", () => {
    expect(() => withParentNode(rootId, ws)).toThrow()
  })
})

describe("withVariantAndBoardMutation", () => {
  it("provides the variant and its board", () => {
    let boardLabel: string | undefined
    const next = withVariantAndBoardMutation(rootId, ws, (variant, b) => {
      boardLabel = (b as any).label
      variant.label = "VarX"
    })
    expect(next.nodes[rootId]!.label).toBe("VarX")
    expect(boardLabel).toBe((board as any).label)
  })
})

describe("withInstanceAndParentMutation", () => {
  it("provides the instance and its parent", () => {
    const next = withInstanceAndParentMutation(childId, ws, (instance, parent) => {
      expect(parent.id).toBe(rootId)
      instance.label = "InstX"
    })
    expect(next.nodes[childId]!.label).toBe("InstX")
  })
})
