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
import {
  areCatalogIdsUsedInOtherBoardTrees,
  areThemeBoardRootsReferencedByEffectiveTheme,
  shouldBlockDeletableBoardRemoval,
} from "./board-removal-guards"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as ComponentBoard).variants[0].id as string

describe("shouldBlockDeletableBoardRemoval", () => {
  it("does not block a component board whose variants are unused", () => {
    expect(shouldBlockDeletableBoardRemoval(board, ws, boardKey)).toBe(false)
  })
})

describe("areCatalogIdsUsedInOtherBoardTrees", () => {
  it("is false for an empty candidate set", () => {
    expect(areCatalogIdsUsedInOtherBoardTrees(ws, boardKey, new Set())).toBe(
      false,
    )
  })

  it("is false when no other board references the ids", () => {
    expect(
      areCatalogIdsUsedInOtherBoardTrees(ws, boardKey, new Set([rootId])),
    ).toBe(false)
  })
})

describe("areThemeBoardRootsReferencedByEffectiveTheme", () => {
  it("is false for a non-theme board", () => {
    expect(areThemeBoardRootsReferencedByEffectiveTheme(board, ws)).toBe(false)
  })
})
