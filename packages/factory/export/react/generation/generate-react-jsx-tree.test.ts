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
import { generateReactJsxTree } from "./generate-react-jsx-tree"

describe("generateReactJsxTree", () => {
  it("should generate JSX tree for Button component with children from real workspace", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const buttonComponent = components.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponent).toBeDefined()
    expect(buttonComponent!.tree.children!.length).toBeGreaterThan(0)

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      buttonComponent!,
      NODE_ID_TO_CLASS_FIXTURE,
      propNamesMap,
    )

    expect(result).toContain("<Label")
    expect(result).toContain("className={frameClassName}")
    expect(result).toContain("{...labelProps}")
  })

  it("should generate JSX tree for Icon component without children from real workspace", () => {
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

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      iconComponent!,
      NODE_ID_TO_CLASS_FIXTURE,
      propNamesMap,
    )

    expect(result).toContain("return (")
    expect(result).toContain("<iconMap")
    expect(result).toContain("className={frameClassName}")
  })

  it("should generate JSX tree for BarButtons component with multiple children from real workspace", () => {
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

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      barButtonsComponent!,
      NODE_ID_TO_CLASS_FIXTURE,
      propNamesMap,
    )

    expect(result).toContain("<Button")
    expect(result).toContain("className={frameClassName}")
    expect(result).toContain("{...buttonProps}")
    expect(result).toContain("{...button1Props}")
    expect(result).toContain("{...button2Props}")
  })

  it("should handle component with no className mapping", () => {
    const components = getComponentsToExport(
      SIMPLE_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      {}, // Empty nodeIdToClass mapping
    )

    const buttonComponent = components.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponent).toBeDefined()

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      buttonComponent!,
      {}, // Empty className mapping
      propNamesMap,
    )

    expect(result).toContain("className={frameClassName}")
    expect(result).toContain("return (")
  })

  it("should handle empty workspace gracefully", () => {
    const components = getComponentsToExport(
      { version: 1, customTheme: {}, boards: {}, byId: {} },
      EXPORT_OPTIONS_FIXTURE,
      {},
    )

    expect(components).toHaveLength(0)
  })

  it("should handle component with complex prop names from real workspace", () => {
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    const buttonComponent = components.find(
      (c) => c.componentId === ComponentId.BUTTON,
    )
    expect(buttonComponent).toBeDefined()
    expect(buttonComponent!.tree.children!.length).toBeGreaterThan(0)

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      buttonComponent!,
      NODE_ID_TO_CLASS_FIXTURE,
      propNamesMap,
    )

    expect(result).toContain("<Label")
    expect(result).toContain("<Icon")
    expect(result).toContain("{...labelProps}")
    expect(result).toContain("{...iconProps}")
  })

  it("should handle component with null children gracefully", () => {
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

    const propNamesMap = new Map<string, string>()
    const result = generateReactJsxTree(
      iconComponent!,
      NODE_ID_TO_CLASS_FIXTURE,
      propNamesMap,
    )

    expect(result).toContain("return (")
    expect(result).toContain("<iconMap")
    expect(result).toContain("className={frameClassName}")
  })
})
