import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type {
  Board,
  ComponentBoard,
  ExtractPayload,
  Workspace,
} from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { areBoardVariantsInUse } from "./are-board-variants-in-use"
import { getBoardByNodeId } from "./get-board-by-node-id"
import { getBoardKey } from "./get-board-keys"
import { getBoardThemeRef } from "./get-board-theme-ref"
import { getBoardVariantRootIds } from "./get-board-variant-root-ids"
import { getImmediateParentIdInWorkspace } from "./get-node-parent-id"
import { getImmediateParentId } from "./get-parent-ids"
import { getVariantTree } from "./get-variant-tree"
import { walkBoardTreeRefs } from "./walk-board-tree-refs"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as ComponentBoard).variants[0].id as string
const childId = (board as ComponentBoard).variants[0].children![0].id as string

describe("getBoardByNodeId", () => {
  it("resolves the owning board, null when unknown", () => {
    expect(getBoardByNodeId(ws, rootId)).toBe(board)
    expect(getBoardByNodeId(ws, "nope")).toBeNull()
  })
})

describe("getBoardKey", () => {
  it("resolves the key by reference", () => {
    expect(getBoardKey(ws, board)).toBe(boardKey)
    expect(getBoardKey(ws, { variants: [] } as unknown as Board)).toBeNull()
  })
})

describe("getBoardThemeRef", () => {
  it("reads a non-empty theme ref, undefined otherwise", () => {
    expect(typeof getBoardThemeRef(board)).toBe("string")
    expect(
      getBoardThemeRef({ componentTheme: "" } as unknown as Board),
    ).toBeUndefined()
  })
})

describe("getBoardVariantRootIds / getVariantTree", () => {
  it("lists root ids and resolves a variant tree", () => {
    expect(getBoardVariantRootIds(board)).toContain(rootId)
    expect(getVariantTree(board, rootId)?.id).toBe(rootId)
    expect(getVariantTree(board, "nope")).toBeNull()
  })
})

describe("walkBoardTreeRefs", () => {
  it("visits the root and its descendants", () => {
    const ids: string[] = []
    walkBoardTreeRefs(board.variants, (ref) => {
      ids.push(ref.id)
    })
    expect(ids).toContain(rootId)
    expect(ids.length).toBeGreaterThan(1)
  })

  it("stops early when the visitor returns true", () => {
    let count = 0
    walkBoardTreeRefs(board.variants, () => {
      count++
      return true
    })
    expect(count).toBe(1)
  })
})

describe("parent resolution", () => {
  it("finds the immediate parent of a child and null for a root", () => {
    expect(getImmediateParentId(board, childId)).toBe(rootId)
    expect(getImmediateParentId(board, rootId)).toBeNull()
    expect(getImmediateParentIdInWorkspace(ws, childId)).toBe(rootId)
  })
})

describe("areBoardVariantsInUse", () => {
  it("is false for a freshly added board", () => {
    expect(areBoardVariantsInUse(board, ws)).toBe(false)
  })
})
