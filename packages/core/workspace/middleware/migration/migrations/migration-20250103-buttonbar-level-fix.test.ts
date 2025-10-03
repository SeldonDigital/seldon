import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import { Workspace } from "../../../types"
import { migrations, schemaMigrations } from "./index"

describe("Migration: Fix ButtonBar component level from ELEMENT to PART", () => {
  const migration = migrations.find(
    (m) =>
      m.description === "Fix ButtonBar component level from ELEMENT to PART",
  )

  if (!migration) {
    throw new Error("Migration not found")
  }
  it("should update ButtonBar component level from ELEMENT to PART", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {},
      byId: {
        "variant-barButtons-1": {
          id: "variant-barButtons-1",
          level: ComponentLevel.ELEMENT, // This should be updated to PART
          label: "Button Bar",
          theme: null,
          component: ComponentId.BAR_BUTTONS,
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-barButtons-1": {
          id: "child-barButtons-1",
          level: ComponentLevel.ELEMENT, // This should be updated to PART
          label: "Button Bar Instance",
          theme: null,
          component: ComponentId.BAR_BUTTONS,
          properties: {},
          isChild: true,
          variant: "variant-barButtons-1",
          instanceOf: "variant-barButtons-1",
          fromSchema: false,
        },
        "variant-button-1": {
          id: "variant-button-1",
          level: ComponentLevel.ELEMENT, // This should NOT be updated
          label: "Button",
          theme: null,
          component: ComponentId.BUTTON,
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const migratedWorkspace = migration.migrate(workspace)

    // ButtonBar components should be updated to PART level
    expect(migratedWorkspace.byId["variant-barButtons-1"].level).toBe(
      ComponentLevel.PART,
    )
    expect(migratedWorkspace.byId["child-barButtons-1"].level).toBe(
      ComponentLevel.PART,
    )

    // Other components should remain unchanged
    expect(migratedWorkspace.byId["variant-button-1"].level).toBe(
      ComponentLevel.ELEMENT,
    )
  })

  it("should not update ButtonBar components that are already PART level", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {},
      byId: {
        "variant-barButtons-1": {
          id: "variant-barButtons-1",
          level: ComponentLevel.PART, // Already correct level
          label: "Button Bar",
          theme: null,
          component: ComponentId.BAR_BUTTONS,
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const migratedWorkspace = migration.migrate(workspace)

    // Should remain PART level
    expect(migratedWorkspace.byId["variant-barButtons-1"].level).toBe(
      ComponentLevel.PART,
    )
  })

  it("should handle malformed nodes gracefully", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {},
      byId: {
        "variant-barButtons-1": {
          id: "variant-barButtons-1",
          level: ComponentLevel.ELEMENT,
          label: "Button Bar",
          theme: null,
          component: ComponentId.BAR_BUTTONS,
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        // Malformed node - missing required properties
        "malformed-node": null as any,
        // Another malformed node - wrong types
        "malformed-node-2": {
          id: "malformed-node-2",
          level: 123 as any, // Wrong type
          component: null as any, // Wrong type
        } as any,
      },
    }

    const migratedWorkspace = migration.migrate(workspace)

    // Should update the valid ButtonBar component
    expect(migratedWorkspace.byId["variant-barButtons-1"].level).toBe(
      ComponentLevel.PART,
    )

    // Should not crash on malformed nodes
    expect(migratedWorkspace.byId["malformed-node"]).toBeNull()
    expect(migratedWorkspace.byId["malformed-node-2"]).toBeDefined()
  })

  it("should handle empty workspace", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {},
      byId: {},
    }

    const migratedWorkspace = migration.migrate(workspace)

    expect(migratedWorkspace).toEqual(workspace)
  })
})

describe("Schema Migration: Fix ButtonBar component ID from buttonBar to barButtons", () => {
  const migration = schemaMigrations.find(
    (m) =>
      m.description ===
      "Fix ButtonBar component ID from buttonBar to barButtons",
  )

  if (!migration) {
    throw new Error("Migration not found")
  }

  it("should update component ID from buttonBar to barButtons", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {
        buttonBar: {
          id: "buttonBar",
          label: "Button Bar Board",
          properties: {},
          variants: ["variant-buttonBar-default"],
        } as any,
        button: {
          id: "button",
          label: "Button Board",
          properties: {},
          variants: ["variant-button-default"],
        } as any,
      } as any,
      byId: {
        "variant-buttonBar-default": {
          id: "variant-buttonBar-default" as any,
          level: ComponentLevel.PART,
          label: "Button Bar",
          theme: null,
          component: "buttonBar" as any, // This should be updated to ComponentId.BAR_BUTTONS
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "variant-barButtons-1": {
          id: "variant-barButtons-1",
          level: ComponentLevel.PART,
          label: "Button Bar",
          theme: null,
          component: "buttonBar" as any, // This should be updated to ComponentId.BAR_BUTTONS
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-barButtons-1": {
          id: "child-barButtons-1",
          level: ComponentLevel.PART,
          label: "Button Bar Instance",
          theme: null,
          component: "buttonBar" as any, // This should be updated to ComponentId.BAR_BUTTONS
          properties: {},
          isChild: true,
          variant: "variant-buttonBar-default" as any, // This should be updated to variant-barButtons-default
          instanceOf: "variant-buttonBar-default" as any, // This should be updated to variant-barButtons-default
          fromSchema: false,
        },
        "variant-button-1": {
          id: "variant-button-1",
          level: ComponentLevel.ELEMENT,
          label: "Button",
          theme: null,
          component: ComponentId.BUTTON, // This should NOT be updated
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const migratedWorkspace = migration.migrate(workspace)

    // ButtonBar components should be updated to barButtons component ID
    expect(migratedWorkspace.byId["variant-barButtons-1"].component).toBe(
      ComponentId.BAR_BUTTONS,
    )
    expect(migratedWorkspace.byId["child-barButtons-1"].component).toBe(
      ComponentId.BAR_BUTTONS,
    )

    // Child node variant and instanceOf references should be updated
    expect((migratedWorkspace.byId["child-barButtons-1"] as any).variant).toBe(
      "variant-barButtons-default",
    )
    expect(
      (migratedWorkspace.byId["child-barButtons-1"] as any).instanceOf,
    ).toBe("variant-barButtons-default")

    // Variant ID should be updated from variant-buttonBar-default to variant-barButtons-default
    expect(migratedWorkspace.byId["variant-barButtons-default"]).toBeDefined()
    expect(migratedWorkspace.byId["variant-barButtons-default"].component).toBe(
      ComponentId.BAR_BUTTONS,
    )
    expect(migratedWorkspace.byId["variant-buttonBar-default"]).toBeUndefined()

    // ButtonBar board should be updated to barButtons board ID
    expect((migratedWorkspace.boards as any)["barButtons"]).toBeDefined()
    expect((migratedWorkspace.boards as any)["barButtons"].id).toBe(
      "barButtons",
    )
    expect((migratedWorkspace.boards as any)["barButtons"].variants).toEqual([
      "variant-barButtons-default",
    ])
    expect((migratedWorkspace.boards as any)["buttonBar"]).toBeUndefined()

    // Other components and boards should remain unchanged
    expect(migratedWorkspace.byId["variant-button-1"].component).toBe(
      ComponentId.BUTTON,
    )
    expect(migratedWorkspace.boards["button"]).toBeDefined()
  })

  it("should handle empty workspace", () => {
    const workspace: Workspace = {
      version: 13,
      customTheme: {} as any,
      boards: {},
      byId: {},
    }

    const migratedWorkspace = migration.migrate(workspace)

    expect(migratedWorkspace).toEqual(workspace)
  })
})
