import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import customTheme from "../../../themes/custom"
import { coreReducer } from "../../reducers/core/reducer"
import { Workspace } from "../../types"
import { legacyWorkspaces } from "./legacy-workspaces"
import { CURRENT_WORKSPACE_VERSION } from "./middleware"

/** Workspace at version 1 to test migration behavior */
const testOutdatedWorkspace: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme,
}

/** Workspace at current version to test migration skip behavior */
const testExpectedWorkspace: Workspace = {
  version: 2,
  boards: {},
  byId: {},
  customTheme,
}

describe("Migration Middleware", () => {
  it("should apply migration when workspace is outdated", () => {
    const result = coreReducer(testOutdatedWorkspace, {
      type: "set_workspace",
      payload: { workspace: testOutdatedWorkspace },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
  })

  it("should skip migration when workspace is already at current version", () => {
    const result = coreReducer(testExpectedWorkspace, {
      type: "set_workspace",
      payload: { workspace: testExpectedWorkspace },
    })

    expect(result.customTheme).toBeDefined()
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toEqual(customTheme)
  })

  it("should not apply migration for non-set_workspace actions", () => {
    const result = coreReducer(testOutdatedWorkspace, {
      type: "add_board",
      payload: { componentId: ComponentId.BUTTON },
    })

    expect(result.customTheme).toBeDefined()
    expect(result.version).toBe(1)
  })

  it("should handle workspace with no version field", () => {
    // @ts-expect-error - Simulate missing version field
    const workspaceWithoutVersion: Workspace = {
      boards: {},
      byId: {},
      customTheme: undefined as any,
    }

    const result = coreReducer(workspaceWithoutVersion, {
      type: "set_workspace",
      payload: { workspace: workspaceWithoutVersion },
    })

    expect(result.customTheme).toBeDefined()
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toEqual(customTheme)
  })

  it("should migrate legacy workspaces", () => {
    for (const workspace of Object.values(legacyWorkspaces)) {
      const result = coreReducer(workspace, {
        type: "set_workspace",
        payload: { workspace },
      })

      expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    }
  })
})
