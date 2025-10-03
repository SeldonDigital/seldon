import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { coreReducer } from "../../../reducers/core/reducer"
import { Workspace } from "../../../types"
import { CURRENT_WORKSPACE_VERSION } from "../middleware"

// Test workspace that should trigger migration (version 1, no customTheme)
const testWorkspaceV1: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme: undefined as any, // Simulate missing customTheme for migration
}

// Test workspace that should NOT trigger migration (already at current version)
const testWorkspaceV2: Workspace = {
  version: 2,
  boards: {},
  byId: {},
  customTheme,
}

describe("Migration 20250717 Add Custom Theme", () => {
  it("should apply migration when workspace version is 1 and has no customTheme", () => {
    const result = coreReducer(testWorkspaceV1, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV1 },
    })

    expect(result.customTheme).toBeDefined()
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toEqual(customTheme)
  })

  it("should skip migration when workspace is already at current version", () => {
    const result = coreReducer(testWorkspaceV2, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV2 },
    })

    expect(result.customTheme).toBeDefined()
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toEqual(customTheme)
  })
})
