import { describe, expect, it } from "vitest"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import type { BoardKey } from "@seldon/core/workspace/types"

import {
  TEXT_LIST_BOARD,
  seedTextListWorkspace,
} from "../../../eval/seed"
import { pickDirectionalEndpoint } from "./geometry-labels"

/**
 * The seeded list board is exactly the shape that defeats label matching:
 * the user variant's column carries three inherited listItem refs after the
 * five texts, so "last" as a label belongs to an inherited node the user
 * never sees, and no text is ever labeled "last". Order arithmetic over the
 * tied texts themselves must resolve what the labels cannot.
 */
function seededTextCluster() {
  const { workspace, textNodeIds } = seedTextListWorkspace()
  return { workspace, textNodeIds, boardKey: TEXT_LIST_BOARD as BoardKey }
}

describe("pickDirectionalEndpoint", () => {
  it('resolves "the last text" to the final text of the shared row', () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "last text",
      textNodeIds,
    )
    expect(picked).toBe(textNodeIds[textNodeIds.length - 1])
  })

  it('resolves "the first text" to the top of the shared row', () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "first text",
      textNodeIds,
    )
    expect(picked).toBe(textNodeIds[0])
  })

  it("refuses when the query names no direction", () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "the red text",
      textNodeIds,
    )
    expect(picked).toBeUndefined()
  })

  it("refuses when the query names both ends", () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "the first and last text",
      textNodeIds,
    )
    expect(picked).toBeUndefined()
  })

  it("still asks when the tied cluster spans several rows", () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    // A positioned node from a different parent: the default variant's own
    // first child (the catalog listItem row), which has two siblings of its
    // own -- exactly the second-row shape build 1's ambiguity rule protects.
    const board = workspace.boards[boardKey]
    if (!board || !isComponentBoard(board)) throw new Error("no list board")
    const defaultVariantFirstChildId = board.variants[0]!.children![0]!.id
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "last text",
      [...textNodeIds, defaultVariantFirstChildId],
    )
    expect(picked).toBeUndefined()
  })

  it("ignores only-children riding along in the cluster", () => {
    const { workspace, textNodeIds, boardKey } = seededTextCluster()
    // The board root variants themselves have no labelable siblings from the
    // walk's perspective; an unpositioned node in the cluster must not veto
    // the row pick. Use a node id with no sibling entry at all: the board's
    // own variant root.
    const board = workspace.boards[boardKey]
    if (!board || !isComponentBoard(board)) throw new Error("no list board")
    const variantRootId = board.variants[board.variants.length - 1]!.id
    const picked = pickDirectionalEndpoint(workspace, boardKey, "last text", [
      ...textNodeIds,
      variantRootId,
    ])
    expect(picked).toBe(textNodeIds[textNodeIds.length - 1])
  })
})
