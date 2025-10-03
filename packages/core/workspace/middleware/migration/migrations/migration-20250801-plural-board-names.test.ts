import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { coreReducer } from "../../../reducers/core/reducer"
import { Instance, Variant, Workspace } from "../../../types"
import { CURRENT_WORKSPACE_VERSION } from "../middleware"

// Test workspace that should trigger migration
const workspaceWithSingularBoardNames = {
  version: 4,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icon", // Singular
      theme: "material",
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
      label: "Default", // Change be changed to schema name
      theme: "material",
      properties: {},
      children: ["child-icon-abc123"],
    } as Omit<Variant, "theme"> & { theme: string },
    "child-icon-abc123": {
      id: "child-icon-abc123",
      isChild: true,
      fromSchema: false,
      level: ComponentLevel.PRIMITIVE,
      component: ComponentId.ICON,
      label: "Icon", // Singular
      theme: "material",
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    } as Omit<Instance, "theme"> & { theme: string },
  },
  customTheme,
}

// Test workspace that should NOT trigger migration (already at current version)
const workspaceWithPluralBoardNames: Workspace = {
  version: 5,
  boards: {
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      label: "Icons",
      theme: "material",
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
      label: "Icon",
      theme: "material",
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
      theme: "material",
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
    },
  },
  customTheme,
} as any

describe("Migration Version 5 - Plural Board Names", () => {
  it("should rename boards", () => {
    const result = coreReducer(workspaceWithSingularBoardNames as any, {
      type: "set_workspace",
      payload: { workspace: workspaceWithSingularBoardNames as any },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that all material themes were renamed to material
    expect(result.boards[ComponentId.ICON]!.theme).toBe("material")
    expect(result.byId["variant-icon-default"].theme).toBe("material")
    expect(result.byId["child-icon-abc123"].theme).toBe("material")
  })

  it("should skip migration when workspace is already at current version", () => {
    const result = coreReducer(workspaceWithPluralBoardNames, {
      type: "set_workspace",
      payload: { workspace: workspaceWithPluralBoardNames },
    })

    expect(result.version).toBe(CURRENT_WORKSPACE_VERSION)

    // Check that themes remain unchanged (already using "material")
    expect(result.boards[ComponentId.ICON]!.theme).toBe("material")
    expect(result.byId["variant-icon-default"].theme).toBe("material")
    expect(result.byId["child-icon-abc123"].theme).toBe("material")
  })
})
