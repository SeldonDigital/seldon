import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import customTheme from "../../../themes/custom"
import { coreReducer } from "../../reducers/core/reducer"
import { Workspace } from "../../types"
import { legacyWorkspaces } from "./legacy-workspaces"
import { CURRENT_WORKSPACE_VERSION } from "./middleware"

/** Workspace at version 0 to test migration behavior */
const testOutdatedWorkspace: Workspace = {
  version: 0,
  boards: {},
  byId: {},
  customTheme,
}

/** Workspace with no version field to test migration behavior */
const testNoVersionWorkspace = {
  boards: {},
  byId: {},
  // No version field
} as any

/** Workspace at current version to test migration skip behavior */
const testExpectedWorkspace: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme,
}

describe("Migration Middleware", () => {
  it("should apply migration when workspace has no version field", () => {
    const result = coreReducer(testNoVersionWorkspace, {
      type: "set_workspace",
      payload: { workspace: testNoVersionWorkspace },
    })

    // The middleware should set the version to current version
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toBeDefined()
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
    expect(result.version).toBe(0)
  })

  it("should handle workspace with version 0", () => {
    const result = coreReducer(testOutdatedWorkspace, {
      type: "set_workspace",
      payload: { workspace: testOutdatedWorkspace },
    })

    // Version 0 should be migrated to the current version
    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(result.customTheme).toBeDefined()
  })

  it("should migrate legacy workspaces", () => {
    for (const workspace of Object.values(legacyWorkspaces)) {
      const result = coreReducer(workspace, {
        type: "set_workspace",
        payload: { workspace },
      })

      // All legacy workspaces should be migrated to the current version
      // (higher versions are baselined to 0 and then migrated up)
      expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)
    }
  })

  it("should not baseline new workspaces with modern board structure", () => {
    // Test workspace with version 1 and modern board structure (should not be baselined)
    const workspaceV1 = {
      ...testNoVersionWorkspace,
      version: 1,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
          component: ComponentId.BUTTON, // Modern board structure
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: "element" as const,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant" as const,
          fromSchema: true,
        },
      },
    }

    const resultV1 = coreReducer(workspaceV1, {
      type: "set_workspace",
      payload: { workspace: workspaceV1 },
    })

    // Version 1 with modern structure should be migrated to current version, not baselined
    expect(resultV1.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Test workspace with version 4 and modern board structure (should not be baselined)
    const workspaceV4 = {
      ...testNoVersionWorkspace,
      version: 4,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
          component: ComponentId.BUTTON, // Modern board structure
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: "element" as const,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant" as const,
          fromSchema: true,
        },
      },
    }

    const resultV4 = coreReducer(workspaceV4, {
      type: "set_workspace",
      payload: { workspace: workspaceV4 },
    })

    // Version 4 with modern structure should remain at version 4 (higher than current)
    expect(resultV4.version).toBe(4)
  })
})
