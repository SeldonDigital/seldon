import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { coreReducer } from "../../../reducers/core/reducer"
import { Instance, Variant, Workspace } from "../../../types"
import { CURRENT_WORKSPACE_VERSION } from "../middleware"

// Test workspace that should trigger migration (version 3, with google-material-3 theme)
const testWorkspaceV3WithGoogleMaterial3 = {
  version: 3,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon",
      theme: "google-material-3", // Should be renamed to "material"
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
      theme: "google-material-3", // Should be renamed to "material"
      properties: {},
      children: ["child-icon-abc123"],
    } as Omit<Variant, "theme"> & { theme: string },
    "child-icon-abc123": {
      id: "child-icon-abc123",
      isChild: true,
      fromSchema: false,
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Icon",
      theme: "google-material-3", // Should be renamed to "material"
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    } as Omit<Instance, "theme"> & { theme: string },
  },
  customTheme,
}

// Test workspace that should NOT trigger migration (already at current version)
const testWorkspaceV4: Workspace = {
  version: 4,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon",
      theme: "material", // Already using the new theme name
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
      theme: "material", // Already using the new theme name
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
      theme: "material", // Already using the new theme name
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    },
  },
  customTheme,
} as any

// Test workspace that should throw error (contains "reversed" theme)
const testWorkspaceV3WithReversedTheme = {
  version: 3,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon",
      theme: "reversed", // Should cause error
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
      theme: "reversed", // Should cause error
      properties: {},
      children: ["child-icon-abc123"],
    } as Omit<Variant, "theme"> & { theme: string },
    "child-icon-abc123": {
      id: "child-icon-abc123",
      isChild: true,
      fromSchema: false,
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Icon",
      theme: "reversed", // Should cause error
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    } as Omit<Instance, "theme"> & { theme: string },
  },
  customTheme,
}

describe("Migration Version 4 - Theme Rename", () => {
  it("should rename google-material-3 to material in all nodes", () => {
    const result = coreReducer(testWorkspaceV3WithGoogleMaterial3 as any, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV3WithGoogleMaterial3 as any },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that all google-material-3 themes were renamed to material
    expect(result.boards[ComponentId.ICON]!.theme).toBe("material")
    expect(result.byId["variant-icon-default"].theme).toBe("material")
    expect(result.byId["child-icon-abc123"].theme).toBe("material")
  })

  it("should skip migration when workspace is already at current version", () => {
    const result = coreReducer(testWorkspaceV4, {
      type: "set_workspace",
      payload: { workspace: testWorkspaceV4 },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that themes remain unchanged (already using "material")
    expect(result.boards[ComponentId.ICON]!.theme).toBe("material")
    expect(result.byId["variant-icon-default"].theme).toBe("material")
    expect(result.byId["child-icon-abc123"].theme).toBe("material")
  })

  it("should throw error when workspace contains reversed theme", () => {
    expect(() => {
      coreReducer(testWorkspaceV3WithReversedTheme as any, {
        type: "set_workspace",
        payload: { workspace: testWorkspaceV3WithReversedTheme as any },
      })
    }).toThrow(
      "Migration 4 failed: Reversed theme is not supported. Please remove this workspace.",
    )
  })
})
