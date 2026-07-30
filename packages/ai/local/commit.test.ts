import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { IneffectiveActionError, commit } from "./commit"
import { createTurnState } from "./turn-state"

describe("commit", () => {
  it("records a valid action and advances the working copy", () => {
    const state = createTurnState(createEmptyWorkspace())
    const action = {
      type: "add_component",
      payload: { boardKey: ComponentId.BUTTON },
    } as WorkspaceAction

    const message = commit(state, action)

    expect(message).toBe("Applied add_component.")
    expect(state.actions).toHaveLength(1)
    expect(state.rejected).toHaveLength(0)
    expect(state.workspace.boards[ComponentId.BUTTON]).toBeDefined()
  })

  it("records a reducer rejection and rethrows, leaving the working copy untouched", () => {
    const seeded = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const state = createTurnState(seeded)
    const action = {
      type: "add_component",
      payload: { boardKey: ComponentId.BUTTON },
    } as WorkspaceAction

    expect(() => commit(state, action)).toThrow()
    expect(state.rejected).toHaveLength(1)
    expect(state.rejected[0]?.type).toBe("add_component")
    expect(state.actions).toHaveLength(0)
    expect(state.workspace).toBe(seeded)
  })

  it("throws on an action that validates but changes nothing", () => {
    const seeded = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const state = createTurnState(seeded)
    // Re-writing a node's existing label: valid, applies cleanly, changes
    // nothing. (An unknown node id would be a reducer REJECTION, a different
    // failure mode.)
    const board = seeded.boards[ComponentId.BUTTON]!
    const rootId = (board as { variants: { id: string }[] }).variants[0]!.id
    const currentLabel = seeded.nodes[rootId]!.label
    const action = {
      type: "set_node_label",
      payload: { nodeId: rootId, label: currentLabel },
    } as WorkspaceAction

    // Must THROW, not return: a silent return is one a handler can forget to
    // read, and then it reports a change the workspace never got.
    expect(() => commit(state, action)).toThrow(IneffectiveActionError)
    expect(state.ineffective).toContain("set_node_label")
    expect(state.actions).toHaveLength(0)
    expect(state.workspace).toBe(seeded)
  })
})
