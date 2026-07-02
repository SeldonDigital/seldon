import { describe, expect, it } from "vitest"

import { ComponentId } from "../../components/constants"
import { createEmptyWorkspace } from "../helpers/create-empty-workspace"
import type { Workspace, WorkspaceAction } from "../types"
import { applyActions } from "./apply-actions"
import { workspaceReducer } from "./reducer"

const dispatch = (ws: Workspace, action: WorkspaceAction) =>
  workspaceReducer(ws, action)

describe("workspaceReducer dispatch", () => {
  it("routes add_component through the middleware stack", () => {
    const result = dispatch(createEmptyWorkspace(), {
      type: "add_component",
      payload: { boardKey: ComponentId.BUTTON },
    } as WorkspaceAction)
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
  })

  it("routes a passthrough workspace-metadata action", () => {
    const result = dispatch(createEmptyWorkspace(), {
      type: "set_workspace_label",
      payload: { value: "My Workspace" },
    } as WorkspaceAction)
    expect(result.metadata.label).toBe("My Workspace")
  })

  it("treats a stubbed resource-map action as a no-op", () => {
    const ws = createEmptyWorkspace()
    const result = dispatch(ws, {
      type: "stubs_add_media_row",
      payload: {},
    } as unknown as WorkspaceAction)
    expect(Object.keys(result.boards)).toEqual(Object.keys(ws.boards))
  })

  it("replaces the workspace for set_workspace", () => {
    const replacement = dispatch(createEmptyWorkspace(), {
      type: "set_workspace_label",
      payload: { value: "Replacement" },
    } as WorkspaceAction)

    const result = dispatch(createEmptyWorkspace(), {
      type: "set_workspace",
      payload: { workspace: replacement },
    } as unknown as WorkspaceAction)

    expect(result.metadata.label).toBe("Replacement")
  })
})

describe("applyActions", () => {
  it("folds a sequence of actions through the reducer", () => {
    const result = applyActions(createEmptyWorkspace(), [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      { type: "set_workspace_label", payload: { value: "Folded" } },
      { type: "set_workspace_intent", payload: { value: "Test intent" } },
    ] as WorkspaceAction[])

    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.metadata.label).toBe("Folded")
    expect(result.metadata.intent).toBe("Test intent")
  })
})
