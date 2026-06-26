import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type {
  Board,
  ComponentBoard,
  ComponentTreeRef,
  ExtractPayload,
  Workspace,
} from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import {
  collectDescendantTreeIds,
  collectReferencedTreeIdsExcludingSubtree,
  findTreeRef,
  insertComponentTreeChild,
  removeComponentTreeChild,
} from "./component-tree-helpers"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const rootId = (ws.boards[boardKey] as ComponentBoard).variants[0].id as string
const childId = (ws.boards[boardKey] as ComponentBoard).variants[0].children![0]
  .id as string

const cloneBoard = (): Board => structuredClone(ws.boards[boardKey]) as Board

describe("collectDescendantTreeIds", () => {
  it("collects the root and every descendant id", () => {
    const ids = collectDescendantTreeIds(
      (ws.boards[boardKey] as ComponentBoard).variants[0],
    )
    expect(ids).toContain(rootId)
    expect(ids).toContain(childId)
    expect(ids.length).toBeGreaterThan(1)
  })
})

describe("findTreeRef", () => {
  it("finds a ref by id, null when absent", () => {
    expect(findTreeRef(cloneBoard(), childId)?.id).toBe(childId)
    expect(findTreeRef(cloneBoard(), "missing")).toBeNull()
  })
})

describe("insert/remove component tree child", () => {
  it("inserts under a parent and removes again", () => {
    const board = cloneBoard()
    const ref = { id: "new-child" } as ComponentTreeRef

    expect(insertComponentTreeChild(board, rootId, ref, 0)).toBe(true)
    expect(findTreeRef(board, "new-child")?.id).toBe("new-child")

    expect(removeComponentTreeChild(board, "new-child")).toBe(true)
    expect(findTreeRef(board, "new-child")).toBeNull()
  })

  it("reports false when the target is missing", () => {
    const board = cloneBoard()
    expect(
      insertComponentTreeChild(board, "missing", {
        id: "x",
      } as ComponentTreeRef),
    ).toBe(false)
    expect(removeComponentTreeChild(board, "missing")).toBe(false)
  })
})

describe("collectReferencedTreeIdsExcludingSubtree", () => {
  it("excludes the subtree rooted at the given id", () => {
    const board = cloneBoard()

    const excludingRoot = collectReferencedTreeIdsExcludingSubtree(
      [board],
      rootId,
    )
    expect(excludingRoot.has(rootId)).toBe(false)
    expect(excludingRoot.has(childId)).toBe(false)

    const excludingChild = collectReferencedTreeIdsExcludingSubtree(
      [board],
      childId,
    )
    expect(excludingChild.has(rootId)).toBe(true)
    expect(excludingChild.has(childId)).toBe(false)
  })
})
