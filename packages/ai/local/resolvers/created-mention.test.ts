import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import type { WorkspaceAction } from "@seldon/core/workspace/types"
import { describe, expect, it } from "vitest"

import { commit } from "../commit"
import { resolveContext } from "../editor-context"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { resolveCreatedMention } from "./resolve-target-with-hint"

/** A context whose turn has already committed one add_component (button). */
function contextAfterCreate(): TurnContext {
  const state = createTurnState(createEmptyWorkspace())
  commit(state, {
    type: "add_component",
    payload: { boardKey: ComponentId.BUTTON },
  } as WorkspaceAction)
  return {
    state,
    resolved: resolveContext({
      workspace: state.workspace,
      activeBoardKey: ComponentId.BUTTON,
    }),
    message: "unused",
    calls: [],
    steps: [],
  }
}

describe("createdIds tracking in commit()", () => {
  it("records every node id the action minted", () => {
    const context = contextAfterCreate()
    expect(context.state.createdIds.size).toBeGreaterThan(0)
    for (const id of context.state.createdIds) {
      expect(context.state.workspace.nodes[id]).toBeDefined()
    }
  })
})

describe("resolveCreatedMention", () => {
  it("resolves 'the new button' to a node created this turn", () => {
    const context = contextAfterCreate()
    const mention = resolveCreatedMention(context, "the new button")
    expect(mention?.kind).toBe("exact")
    if (mention?.kind === "exact") {
      expect(context.state.createdIds.has(mention.nodeId)).toBe(true)
    }
  })

  it("splits a part-reference into the created root plus a remainder", () => {
    const context = contextAfterCreate()
    const mention = resolveCreatedMention(context, "the text of the new button")
    expect(mention?.kind).toBe("within")
    if (mention?.kind === "within") {
      expect(mention.remainder).toBe("text")
      expect(context.state.createdIds.has(mention.nodeId)).toBe(true)
    }
  })

  it("returns undefined when nothing was created this turn", () => {
    const context = contextAfterCreate()
    context.state.createdIds.clear()
    expect(resolveCreatedMention(context, "the new button")).toBeUndefined()
  })

  it("returns undefined for a phrase naming nothing created", () => {
    const context = contextAfterCreate()
    expect(resolveCreatedMention(context, "the hero heading")).toBeUndefined()
  })
})
