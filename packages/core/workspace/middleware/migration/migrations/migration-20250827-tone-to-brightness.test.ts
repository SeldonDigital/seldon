import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../../components/constants"
import { Workspace } from "../../../types"
import { migrations } from "./index"

describe("Migration: Rename tone properties to brightness properties", () => {
  const migration = migrations.find(
    (m) => m.description === "Rename tone properties to brightness properties",
  )

  if (!migration) {
    throw new Error("Migration not found")
  }

  it("should rename tone properties to brightness properties in all locations", () => {
    const mockWorkspace: Workspace = {
      version: 12,
      customTheme: {
        id: "custom",
        name: "Custom Theme",
        swatches: {},
        borders: {},
        shadows: {},
        gradients: {},
        // Test customTheme tone properties
        background: {
          color: { type: "theme_categorical", value: "@swatch.primary" },
          tone: { type: "exact", value: { unit: "percent", value: 20 } },
          opacity: { type: "empty", value: null },
        },
      } as any,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Test Component",
          order: 0,
          theme: "material",
          properties: {
            // Test board-level tone properties
            tone: { type: "exact", value: { unit: "percent", value: 15 } },
            background: {
              color: { type: "theme_categorical", value: "@swatch.secondary" },
              tone: { type: "exact", value: { unit: "percent", value: 25 } },
            },
            border: {
              color: { type: "theme_categorical", value: "@swatch.black" },
              tone: { type: "exact", value: { unit: "percent", value: 30 } },
              topTone: { type: "exact", value: { unit: "percent", value: 35 } },
              rightTone: {
                type: "exact",
                value: { unit: "percent", value: 40 },
              },
              bottomTone: {
                type: "exact",
                value: { unit: "percent", value: 45 },
              },
              leftTone: {
                type: "exact",
                value: { unit: "percent", value: 50 },
              },
            },
            shadow: {
              color: { type: "theme_categorical", value: "@swatch.black" },
              tone: { type: "exact", value: { unit: "percent", value: 55 } },
            },
            gradient: {
              startColor: {
                type: "theme_categorical",
                value: "@swatch.primary",
              },
              endColor: {
                type: "theme_categorical",
                value: "@swatch.secondary",
              },
              startTone: {
                type: "exact",
                value: { unit: "percent", value: 60 },
              },
              endTone: { type: "exact", value: { unit: "percent", value: 65 } },
            },
          },
        } as any,
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          level: "variant",
          label: "Test Variant",
          theme: "material",
          component: ComponentId.BUTTON,
          properties: {
            // Test variant-level tone properties
            tone: { type: "exact", value: { unit: "percent", value: 70 } },
            background: {
              color: { type: "theme_categorical", value: "@swatch.tertiary" },
              tone: { type: "exact", value: { unit: "percent", value: 75 } },
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        } as any,
        "child-button-abc123": {
          id: "child-button-abc123",
          level: "child",
          label: "Test Child",
          theme: "material",
          component: "test-component",
          properties: {
            // Test child-level tone properties
            tone: { type: "exact", value: { unit: "percent", value: 80 } },
            border: {
              color: { type: "theme_categorical", value: "@swatch.black" },
              topTone: { type: "exact", value: { unit: "percent", value: 85 } },
            },
          },
          isChild: true,
          variant: "variant-button-default",
          instanceOf: "variant-button-default",
          fromSchema: false,
        } as any,
      },
    }

    const migratedWorkspace = migration.migrate(mockWorkspace)

    // Test customTheme properties
    expect(migratedWorkspace.customTheme.background).toBeDefined()
    expect(migratedWorkspace.customTheme.background.brightness).toBeDefined()
    expect(migratedWorkspace.customTheme.background.tone).toBeUndefined()
    expect(migratedWorkspace.customTheme.background.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 20 },
    })

    // Test board properties
    const board = migratedWorkspace.boards[ComponentId.BUTTON]
    expect(board?.properties.tone).toBeUndefined()
    expect(board?.properties.brightness).toBeDefined()
    expect(board?.properties.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 15 },
    })

    // Test background properties
    expect(board?.properties.background?.tone).toBeUndefined()
    expect(board?.properties.background?.brightness).toBeDefined()
    expect(board?.properties.background?.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 25 },
    })

    // Test border properties
    expect(board?.properties.border?.tone).toBeUndefined()
    expect(board?.properties.border?.brightness).toBeDefined()
    expect(board?.properties.border?.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 30 },
    })
    expect(board?.properties.border?.topTone).toBeUndefined()
    expect(board?.properties.border?.topBrightness).toBeDefined()
    expect(board?.properties.border?.topBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 35 },
    })
    expect(board?.properties.border?.rightTone).toBeUndefined()
    expect(board?.properties.border?.rightBrightness).toBeDefined()
    expect(board?.properties.border?.rightBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 40 },
    })
    expect(board?.properties.border?.bottomTone).toBeUndefined()
    expect(board?.properties.border?.bottomBrightness).toBeDefined()
    expect(board?.properties.border?.bottomBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 45 },
    })
    expect(board?.properties.border?.leftTone).toBeUndefined()
    expect(board?.properties.border?.leftBrightness).toBeDefined()
    expect(board?.properties.border?.leftBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 50 },
    })

    // Test shadow properties
    expect(board?.properties.shadow?.tone).toBeUndefined()
    expect(board?.properties.shadow?.brightness).toBeDefined()
    expect(board?.properties.shadow?.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 55 },
    })

    // Test gradient properties
    expect(board?.properties.gradient?.startTone).toBeUndefined()
    expect(board?.properties.gradient?.startBrightness).toBeDefined()
    expect(board?.properties.gradient?.startBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 60 },
    })
    expect(board?.properties.gradient?.endTone).toBeUndefined()
    expect(board?.properties.gradient?.endBrightness).toBeDefined()
    expect(board?.properties.gradient?.endBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 65 },
    })

    // Test variant properties
    const variant = migratedWorkspace.byId["variant-button-default"]
    expect(variant?.properties.tone).toBeUndefined()
    expect(variant?.properties.brightness).toBeDefined()
    expect(variant?.properties.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 70 },
    })
    expect(variant?.properties.background?.tone).toBeUndefined()
    expect(variant?.properties.background?.brightness).toBeDefined()
    expect(variant?.properties.background?.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 75 },
    })

    // Test child properties
    const child = migratedWorkspace.byId["child-button-abc123"]
    expect(child?.properties.tone).toBeUndefined()
    expect(child?.properties.brightness).toBeDefined()
    expect(child?.properties.brightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 80 },
    })
    expect(child?.properties.border?.topTone).toBeUndefined()
    expect(child?.properties.border?.topBrightness).toBeDefined()
    expect(child?.properties.border?.topBrightness).toEqual({
      type: "exact",
      value: { unit: "percent", value: 85 },
    })
  })

  it("should handle workspaces with no tone properties", () => {
    const mockWorkspace: Workspace = {
      version: 12,
      customTheme: {
        id: "custom",
        name: "Custom Theme",
        swatches: {},
        borders: {},
        shadows: {},
        gradients: {},
      } as any,
      boards: {},
      byId: {},
    }

    const migratedWorkspace = migration.migrate(mockWorkspace)

    // Should not crash and should return the same workspace structure
    expect(migratedWorkspace).toBeDefined()
    expect(migratedWorkspace.version).toBe(12)
    expect(migratedWorkspace.customTheme).toBeDefined()
  })
})
