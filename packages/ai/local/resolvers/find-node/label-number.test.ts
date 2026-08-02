import { describe, expect, it } from "vitest"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import {
  TEXT_LIST_BOARD,
  seedTextListWorkspace,
} from "../../../eval/seed"
import { labelNumberTieBreak } from "./index"

/**
 * The seeded list board plus two more user variants, so the sidebar reads
 * [List, Ordered, Variant 01, Variant 02, Variant 03] -- the exact shape
 * where the label numbering and the positional reading disagree: the
 * positionally-second variant is the catalog preset "Ordered", but a user
 * saying "the second variant" reads the numbers.
 */
function boardWithNumberedVariants(): {
  workspace: Workspace
  variantRootIds: string[]
  labelByNodeId: Map<string, string>
} {
  let { workspace } = seedTextListWorkspace()
  workspace = applyActions(workspace, [
    { type: "add_variant", payload: { boardKey: TEXT_LIST_BOARD } },
    { type: "add_variant", payload: { boardKey: TEXT_LIST_BOARD } },
  ] as WorkspaceAction[])
  const board = workspace.boards[TEXT_LIST_BOARD]
  if (!board || !isComponentBoard(board)) throw new Error("no list board")
  const variantRootIds = board.variants.map((variantRef) => variantRef.id)
  const labelByNodeId = new Map(
    variantRootIds.map((nodeId) => [
      nodeId,
      workspace.nodes[nodeId]?.label ?? "",
    ]),
  )
  return { workspace, variantRootIds, labelByNodeId }
}

describe("labelNumberTieBreak", () => {
  it('resolves "the second variant" to the label Variant 02, not the second position', () => {
    const { workspace, variantRootIds, labelByNodeId } =
      boardWithNumberedVariants()
    const picked = labelNumberTieBreak(
      workspace,
      "the second variant",
      variantRootIds,
    )
    expect(picked).toBeDefined()
    expect(labelByNodeId.get(picked!)).toBe("Variant 02")
    // The positional reading would have landed on the catalog preset.
    expect(picked).not.toBe(variantRootIds[1])
  })

  it("matches a bare digit too", () => {
    const { workspace, variantRootIds, labelByNodeId } =
      boardWithNumberedVariants()
    const picked = labelNumberTieBreak(workspace, "variant 3", variantRootIds)
    expect(labelByNodeId.get(picked!)).toBe("Variant 03")
  })

  it("refuses when the query names no number", () => {
    const { workspace, variantRootIds } = boardWithNumberedVariants()
    expect(
      labelNumberTieBreak(workspace, "the last variant", variantRootIds),
    ).toBeUndefined()
  })

  it("refuses when the query names two numbers", () => {
    const { workspace, variantRootIds } = boardWithNumberedVariants()
    expect(
      labelNumberTieBreak(
        workspace,
        "the second and third variant",
        variantRootIds,
      ),
    ).toBeUndefined()
  })

  it("refuses when no label carries the number", () => {
    const { workspace, variantRootIds } = boardWithNumberedVariants()
    expect(
      labelNumberTieBreak(workspace, "the ninth variant", variantRootIds),
    ).toBeUndefined()
  })

  it("never matches numbers in content, only labels", () => {
    const { workspace, textNodeIds } = seedTextListWorkspace()
    // The recipe text's CONTENT contains "two cups of flour"; its label
    // carries no number, so a numbered query must not land on it.
    const picked = labelNumberTieBreak(
      workspace,
      "the second text",
      textNodeIds,
    )
    expect(picked).toBeUndefined()
  })
})
