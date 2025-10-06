import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import {
  EXPORT_OPTIONS_FIXTURE,
  FACTORY_WORKSPACE_FIXTURE,
  NODE_ID_TO_CLASS_FIXTURE,
  SIMPLE_WORKSPACE_FIXTURE,
} from "../../../helpers/fixtures/workspace"
import { ExportOptions } from "../../types"
import { getComponentsToExport } from "./get-components-to-export"

describe("getComponentsToExport", () => {
  it("should return components to export from simple workspace", () => {
    const result = getComponentsToExport(
      SIMPLE_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty("name", "Button")
    expect(result[0]).toHaveProperty("componentId", ComponentId.BUTTON)
    expect(result[0]).toHaveProperty("variantId", "variant-button-default")
    expect(result[0]).toHaveProperty("output")
    expect(result[0].output.path).toContain("elements/Button.tsx")
  })

  it("should return multiple components from complex workspace", () => {
    const result = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    expect(result.length).toBeGreaterThan(1)

    const buttonComponent = result.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    const iconComponent = result.find((c) => c.componentId === ComponentId.ICON)
    const labelComponent = result.find(
      (c) => c.componentId === ComponentId.LABEL,
    )
    const barButtonsComponent = result.find(
      (c) => c.componentId === ComponentId.BAR_BUTTONS,
    )

    expect(buttonComponent).toBeDefined()
    expect(iconComponent).toBeDefined()
    expect(labelComponent).toBeDefined()
    expect(barButtonsComponent).toBeDefined()

    // Verify component structure
    expect(buttonComponent!.tree.children!.length).toBeGreaterThan(0)
    expect(iconComponent!.tree.children).toBeNull()
    expect(barButtonsComponent!.tree.children!.length).toBeGreaterThan(1)
  })

  it("should exclude frame components", () => {
    const workspaceWithFrame: Workspace = {
      ...FACTORY_WORKSPACE_FIXTURE,
      boards: {
        ...FACTORY_WORKSPACE_FIXTURE.boards,
        [ComponentId.FRAME]: {
          id: ComponentId.FRAME,
          label: "Frame",
          order: 4,
          theme: "default",
          properties: {},
          variants: ["variant-frame-default"],
        },
      },
      byId: {
        ...FACTORY_WORKSPACE_FIXTURE.byId,
        "variant-frame-default": {
          id: "variant-frame-default",
          component: ComponentId.FRAME,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = getComponentsToExport(
      workspaceWithFrame,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    // Should not include frame components
    expect(result.some((c) => c.componentId === ComponentId.FRAME)).toBe(false)
    // Should still include other components
    expect(result.some((c) => c.componentId === ComponentId.BUTTON)).toBe(true)
    expect(result.some((c) => c.componentId === ComponentId.ICON)).toBe(true)
  })

  it("should handle empty workspace", () => {
    const result = getComponentsToExport(
      { version: 1, customTheme: customTheme, boards: {}, byId: {} },
      EXPORT_OPTIONS_FIXTURE,
      {},
    )

    expect(result).toHaveLength(0)
  })

  it("should exclude child instances", () => {
    const result = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    // Should only include variant components, not child instances
    const variantIds = result.map((c) => c.variantId)
    expect(variantIds).not.toContain("child-label-1")
    expect(variantIds).not.toContain("child-icon-1")
    expect(variantIds).not.toContain("child-button-1")

    // Should include the actual variants
    expect(variantIds).toContain("variant-button-default")
    expect(variantIds).toContain("variant-icon-default")
    expect(variantIds).toContain("variant-label-default")
  })

  it("should handle workspace with multiple variants of same component", () => {
    const result = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    // Should include both button variants
    const buttonComponents = result.filter(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponents.length).toBeGreaterThan(0)

    // Verify each button variant has correct structure
    buttonComponents.forEach((button) => {
      expect(button.componentId).toBe(ComponentId.BUTTON)
      expect(button.tree.level).toBe(ComponentLevel.ELEMENT)
      expect(button.output.path).toContain("elements/Button")
    })
  })
})
