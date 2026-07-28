import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit } from "./commit"
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
})
