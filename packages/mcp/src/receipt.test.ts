/**
 * Direct coverage for the diff-derived receipts. `buildReceipt` is otherwise
 * only reached through apply_actions; these tests pin the diff semantics
 * themselves — above all the Immer contract the module header documents:
 * reference equality proves "unchanged", while an entry a handler rebuilt
 * with identical contents must be confirmed equal by the deep comparison,
 * never counted as modified.
 */
import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { type BatchStep, buildReceipt, diffEntityMaps } from "./receipt"

/** Folds actions through the real reducer, capturing before/after steps. */
function stepsThrough(
  start: Workspace,
  actions: WorkspaceAction[],
): { steps: BatchStep[]; final: Workspace } {
  const steps: BatchStep[] = []
  let current = start
  for (const action of actions) {
    const next = workspaceReducer(current, action)
    steps.push({ type: action.type, before: current, after: next })
    current = next
  }
  return { steps, final: current }
}

/** An empty workspace plus a Button board, and a variant safe to edit. */
function buttonFixture(): { workspace: Workspace; editableVariantId: string } {
  const { final } = stepsThrough(createEmptyWorkspace(), [
    {
      type: "add_component",
      payload: { boardKey: ComponentId.BUTTON },
    } as WorkspaceAction,
  ])
  const board = final.boards[ComponentId.BUTTON]!
  const editableVariantId = (board.variants as Array<{ id: string }>)
    .map((ref) => ref.id)
    .find((id) => id !== `component-${ComponentId.BUTTON}-default`)!
  return { workspace: final, editableVariantId }
}

describe("diffEntityMaps", () => {
  it("returns all-zero on the same reference without walking entries", () => {
    const map = { a: { x: 1 } }
    expect(diffEntityMaps(map, map)).toEqual({
      addedIds: [],
      modified: 0,
      removed: 0,
    })
  })

  it("reports added ids and removed counts", () => {
    const before = { a: { x: 1 }, b: { x: 2 } }
    const after = { a: { x: 1 }, c: { x: 3 } }
    const diff = diffEntityMaps(before, after)
    expect(diff.addedIds).toEqual(["c"])
    expect(diff.removed).toBe(1)
    expect(diff.modified).toBe(0)
  })

  it("counts a changed entry as modified", () => {
    const diff = diffEntityMaps({ a: { x: 1 } }, { a: { x: 2 } })
    expect(diff.modified).toBe(1)
  })

  it("does NOT count a rebuilt-but-identical entry as modified", () => {
    // Distinct references, deep-equal contents — the case where a handler
    // re-merges a bag without changing values. Reference inequality alone
    // must not read as a modification.
    const diff = diffEntityMaps({ a: { x: 1 } }, { a: { x: 1 } })
    expect(diff.modified).toBe(0)
    expect(diff.addedIds).toEqual([])
    expect(diff.removed).toBe(0)
  })
})

describe("buildReceipt", () => {
  it("counts created entities and returns their ids per collection", () => {
    const { steps, final } = stepsThrough(createEmptyWorkspace(), [
      {
        type: "add_component",
        payload: { boardKey: ComponentId.BUTTON },
      } as WorkspaceAction,
    ])
    const receipt = buildReceipt(steps)

    expect(receipt.applied).toBe(1)
    expect(receipt.summary.boards.added).toBeGreaterThanOrEqual(1)
    expect(receipt.summary.nodes.added).toBeGreaterThan(0)
    expect(receipt.createdIds.nodes).toHaveLength(receipt.summary.nodes.added)
    // The follow-up-batch contract: created ids are real keys in the
    // post-batch workspace, usable as the next batch's targets.
    for (const id of receipt.createdIds.nodes) {
      expect(final.nodes[id]).toBeDefined()
    }
    expect(receipt.actions[0]!.noop).toBe(false)
    expect(receipt.actions[0]!.createdIds.length).toBeGreaterThan(0)
  })

  it("flags a step whose reference did not change as a no-op", () => {
    const workspace = createEmptyWorkspace()
    const receipt = buildReceipt([
      { type: "anything", before: workspace, after: workspace },
    ])
    expect(receipt.actions[0]!).toMatchObject({
      index: 0,
      noop: true,
      createdIds: [],
    })
    expect(receipt.summary.nodes).toEqual({
      added: 0,
      modified: 0,
      removed: 0,
    })
  })

  it("flags an accepted action that changed nothing as a no-op", () => {
    const { workspace, editableVariantId } = buttonFixture()
    const currentLabel = workspace.nodes[editableVariantId]!.label
    const { steps } = stepsThrough(workspace, [
      {
        type: "set_node_label",
        payload: { nodeId: editableVariantId, label: currentLabel },
      } as WorkspaceAction,
    ])
    const receipt = buildReceipt(steps)
    expect(receipt.actions[0]!.noop).toBe(true)
    expect(receipt.summary.nodes.modified).toBe(0)
  })

  it("nets out reverted changes overall while reporting per-action outcomes", () => {
    const { workspace, editableVariantId } = buttonFixture()
    const originalLabel = workspace.nodes[editableVariantId]!.label
    const { steps } = stepsThrough(workspace, [
      {
        type: "set_node_label",
        payload: { nodeId: editableVariantId, label: "Temporarily renamed" },
      } as WorkspaceAction,
      {
        type: "set_node_label",
        payload: { nodeId: editableVariantId, label: originalLabel },
      } as WorkspaceAction,
    ])
    const receipt = buildReceipt(steps)

    // Each step changed the node...
    expect(receipt.actions[0]!.noop).toBe(false)
    expect(receipt.actions[1]!.noop).toBe(false)
    // ...but the batch-level summary diffs first.before against last.after,
    // where the rename cancelled out.
    expect(receipt.summary.nodes).toEqual({
      added: 0,
      modified: 0,
      removed: 0,
    })
  })
})
