import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { Workspace } from "@seldon/core/workspace/types"
import { migrations } from "./index"

describe("Migration Version 2 - Legacy Workspace", () => {
  const migration = migrations.find((m) => m.version === 2)!

  it("should migrate version 10 workspace to version 2", () => {
    const workspace: Workspace = {
      version: 10,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          theme: null,
          properties: {},
          fromSchema: false as any,
        },
      },
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.byId["variant-button-default"]).not.toHaveProperty(
      "fromSchema",
    )
  })

  it("should migrate version 20 workspace to version 2", () => {
    const workspace: Workspace = {
      version: 20,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
  })

  it("should not modify version 21+ workspaces", () => {
    const workspace: Workspace = {
      version: 21,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(21)
  })

  it("should handle nodes with missing children and properties", () => {
    const workspace: Workspace = {
      version: 15,
      customTheme,
      boards: {},
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          theme: null,
          properties: undefined as any,
          fromSchema: false as any,
        },
      },
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.byId["variant-button-default"].children).toEqual([])
    expect(result.byId["variant-button-default"].properties).toEqual({})
    expect(result.byId["variant-button-default"]).not.toHaveProperty(
      "fromSchema",
    )
  })

  it("should handle boards with missing variants, order, and theme", () => {
    const workspace: Workspace = {
      version: 8,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: undefined as any,
          theme: undefined as any,
          properties: {},
          variants: undefined as any,
        },
      },
      byId: {},
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.boards[ComponentId.BUTTON]!.variants).toEqual([])
    expect(result.boards[ComponentId.BUTTON]!.order).toBe(0)
    expect(result.boards[ComponentId.BUTTON]!.theme).toBe("default")
  })

  it("should replace complex customTheme with baseline", () => {
    const complexCustomTheme = {
      ...customTheme,
      id: "complex" as any,
      name: "Complex Theme",
      description: "A complex legacy theme",
    }

    const workspace: Workspace = {
      version: 12,
      customTheme: complexCustomTheme,
      boards: {},
      byId: {},
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.customTheme.id).toBe("custom")
    expect(result.customTheme.name).toBe("Custom")
    expect(result.customTheme.description).toBe(
      "A clean and versatile theme with a neutral color palette. It features a range of customizable typography, layout, and color options to suit various design needs.",
    )
  })

  it("should handle completely empty workspace", () => {
    const workspace: Workspace = {
      version: 5,
      customTheme: undefined as any,
      boards: undefined as any,
      byId: undefined as any,
    }

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.boards).toEqual({})
    expect(result.byId).toEqual({})
    expect(result.customTheme.id).toBe("custom")
    expect(result.customTheme.name).toBe("Custom")
  })

  it("should remove deleted components and their nodes", () => {
    const workspace = {
      version: 15,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        ["buttonIconic"]: {
          id: "buttonIconic" as any,
          label: "Button Iconic",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-buttonIconic-default"],
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          isChild: false,
          theme: null,
          properties: {},
          fromSchema: true,
        },
        ["variant-buttonIconic-default"]: {
          id: "variant-buttonIconic-default",
          type: "defaultVariant",
          component: "buttonIconic" as any,
          level: ComponentLevel.ELEMENT,
          label: "Button Iconic",
          isChild: false,
          theme: null,
          properties: {},
          fromSchema: true,
        },
      },
    } as any

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.boards["buttonIconic"]).toBeUndefined()
    expect(result.byId["variant-buttonIconic-default"]).toBeUndefined()
    expect(result.boards[ComponentId.BUTTON]).toBeDefined()
    expect(result.byId["variant-button-default"]).toBeDefined()
  })

  it("should update renamed component IDs", () => {
    const workspace = {
      version: 12,
      customTheme,
      boards: {
        ["headerPanels"]: {
          id: "headerPanels" as any,
          label: "Header Panels",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-headerPanels-default"],
        },
      },
      byId: {
        ["variant-headerPanels-default"]: {
          id: "variant-headerPanels-default",
          type: "defaultVariant",
          component: "headerPanels" as any,
          level: ComponentLevel.ELEMENT,
          label: "Header Panels",
          isChild: false,
          theme: null,
          properties: {},
          fromSchema: true,
        },
      },
    } as any

    const result = migration.migrate(workspace)

    expect(result.version).toBe(2)
    expect(result.boards["headerPanels"]).toBeUndefined()
    expect(result.boards[ComponentId.BAR_HEADER]).toBeDefined()
    expect(result.byId["variant-headerPanels-default"].component).toBe(
      ComponentId.BAR_HEADER,
    )
  })
})
