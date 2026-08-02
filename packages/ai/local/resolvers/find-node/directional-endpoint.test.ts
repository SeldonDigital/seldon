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
    // An unpositioned node in the cluster must not veto the row pick. The
    // TEXT board's default root is one: it exists in the workspace (the
    // seed's inserts created that board) but sits outside the active list
    // board's walk, so it has no position entry here at all. (Variant roots
    // of the ACTIVE board no longer qualify -- they are positioned among
    // the board's variants now, which is the feature.)
    const offBoardTextId = "component-text-default"
    expect(workspace.nodes[offBoardTextId]).toBeDefined()
    const picked = pickDirectionalEndpoint(workspace, boardKey, "last text", [
      ...textNodeIds,
      offBoardTextId,
    ])
    expect(picked).toBe(textNodeIds[textNodeIds.length - 1])
  })

  it('resolves "the last variant" across the board\'s variant roots', () => {
    const { workspace, boardKey } = seededTextCluster()
    const board = workspace.boards[boardKey]
    if (!board || !isComponentBoard(board)) throw new Error("no list board")
    const variantRootIds = board.variants.map((variantRef) => variantRef.id)
    const picked = pickDirectionalEndpoint(
      workspace,
      boardKey,
      "the last variant",
      variantRootIds,
    )
    expect(picked).toBe(variantRootIds[variantRootIds.length - 1])
  })
})
