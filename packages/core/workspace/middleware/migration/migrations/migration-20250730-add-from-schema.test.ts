import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { coreReducer } from "../../../reducers/core/reducer"
import { Instance, Variant, Workspace } from "../../../types"
import { CURRENT_WORKSPACE_VERSION } from "../middleware"

// Test workspace that should trigger migration (version 2, instances without fromSchema)
const testWorkspaceV2 = {
  version: 2,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon",
      theme: "default",
      variants: ["variant-icon-default"],
      properties: {},
      order: 0,
    },
  },
  byId: {
    "variant-icon-default": {
      id: "variant-icon-default",
      isChild: false,
      type: "defaultVariant",
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Default",
      theme: null,
      properties: {},
      children: ["child-icon-abc123"],
      // fromSchema is not set - should be set to false by migration
    } as Omit<Variant, "fromSchema">,
    "child-icon-abc123": {
      id: "child-icon-abc123",
      isChild: true,
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Icon",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
      // fromSchema is not set - should be set to false by migration
    } as Omit<Instance, "fromSchema">,
  },
  customTheme,
}

// Test workspace that should NOT trigger migration (already at current version)
const testWorkspaceV3: Workspace = {
  version: 3,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon",
      theme: "default",
      variants: ["variant-icon-default"],
      properties: {},
      order: 0,
    },
  },
  byId: {
    "variant-icon-default": {
      id: "variant-icon-default",
      isChild: false,
      fromSchema: true,
      type: "defaultVariant",
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Default",
      theme: null,
      properties: {},
      children: ["child-icon-abc123"],
    },
    "child-icon-abc123": {
      id: "child-icon-abc123",
      isChild: true,
      fromSchema: false,
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Icon",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    },
  },
  customTheme,
} as any

describe("Migration 20250730 Add From Schema", () => {
  it("should apply migration when workspace version is 2 and instances don't have fromSchema", () => {
    const result = coreReducer(testWorkspaceV2 as any, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV2 as any },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that the instance now has fromSchema: false
    const instance = result.byId["child-icon-abc123"] as Instance
    expect(instance.fromSchema).toBe(false)
  })

  it("should skip migration when workspace is already at current version", () => {
    const result = coreReducer(testWorkspaceV3, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV3 },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that the instance still has fromSchema: false (not changed)
    const instance = result.byId["child-icon-abc123"] as Instance
    expect(instance.fromSchema).toBe(false)
  })
})
