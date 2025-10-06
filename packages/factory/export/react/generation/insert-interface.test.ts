import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import {
  EXPORT_OPTIONS_FIXTURE,
  FACTORY_WORKSPACE_FIXTURE,
  NODE_ID_TO_CLASS_FIXTURE,
  SIMPLE_WORKSPACE_FIXTURE,
} from "../../../helpers/fixtures/workspace"
import { ComponentToExport } from "../../types"
import { getComponentsToExport } from "../discovery/get-components-to-export"
import { insertInterface } from "./insert-interface"

describe("insertInterface", () => {
  it("should insert interface for Button component from real workspace", () => {
    const components = getComponentsToExport(
      SIMPLE_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const buttonComponent = components.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponent).toBeDefined()

    const result = insertInterface("", buttonComponent!)

    expect(result).toContain("export interface ButtonProps")
    expect(result).toContain("extends ButtonHTMLAttributes<HTMLButtonElement>")
    expect(result).toContain("className?: string")
  })

  it("should insert interface for Icon component from real workspace", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const iconComponent = components.find(
      (c) => c.componentId === ComponentId.ICON,
    )
    expect(iconComponent).toBeDefined()

    const result = insertInterface("", iconComponent!)

    expect(result).toContain("export interface IconProps")
    expect(result).toContain("extends SVGAttributes<SVGElement>")
    expect(result).toContain("className?: string")
  })

  it("should insert interface for BarButtons component with children from real workspace", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const barButtonsComponent = components.find(
      (c) => c.componentId === ComponentId.BAR_BUTTONS,
    )
    expect(barButtonsComponent).toBeDefined()

    const result = insertInterface("", barButtonsComponent!)

    expect(result).toContain("export interface BarButtonsProps")
    expect(result).toContain("extends HTMLAttributes<HTMLElement>")
    expect(result).toContain("className?: string")
    // Should have button props for the three buttons
    expect(result).toContain("button?:")
    expect(result).toContain("button2?:")
    expect(result).toContain("button3?:")
  })

  it("should append interface to existing content", () => {
    const existingContent =
      "import React from 'react'\n\nexport function Button(props: ButtonProps) {\n  return <HTMLButton />\n}"

    const components = getComponentsToExport(
      SIMPLE_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const buttonComponent = components.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponent).toBeDefined()

    const result = insertInterface(existingContent, buttonComponent!)

    expect(result).toContain("import React from 'react'")
    expect(result).toContain("export interface ButtonProps")
    expect(result).toContain("export function Button(props: ButtonProps) {")
    expect(result).toContain("return <HTMLButton />")
  })

  it("should handle empty workspace gracefully", () => {
    const components = getComponentsToExport(
      { version: 1, customTheme: {}, boards: {}, byId: {} },
      EXPORT_OPTIONS_FIXTURE,
      {},
    )

    expect(components).toHaveLength(0)
  })

  it("should handle component with no children", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const iconComponent = components.find(
      (c) => c.componentId === ComponentId.ICON,
    )
    expect(iconComponent).toBeDefined()
    expect(iconComponent!.tree.children).toBeNull()

    const result = insertInterface("", iconComponent!)

    expect(result).toContain("export interface IconProps")
    expect(result).toContain("extends SVGAttributes<SVGElement>")
  })

  it("should handle component with multiple children of same type", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const barButtonsComponent = components.find(
      (c) => c.componentId === ComponentId.BAR_BUTTONS,
    )
    expect(barButtonsComponent).toBeDefined()
    expect(barButtonsComponent!.tree.children!.length).toBeGreaterThan(1)

    const result = insertInterface("", barButtonsComponent!)

    expect(result).toContain("export interface BarButtonsProps")
    // Should have numbered props for multiple buttons
    expect(result).toContain("button?:")
    expect(result).toContain("button2?:")
    expect(result).toContain("button3?:")
  })
})
