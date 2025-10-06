import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComputedFunction, Unit, ValueType } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { computeWorkspace } from "../../helpers/compute-workspace"
import {
  EXPORT_OPTIONS_FIXTURE,
  FACTORY_WORKSPACE_FIXTURE,
  NODE_ID_TO_CLASS_FIXTURE,
  SIMPLE_WORKSPACE_FIXTURE,
} from "../../helpers/fixtures/workspace"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { exportCss } from "../css/export-css"
import { exportWorkspace } from "../export-workspace"
import { getComponentsToExport } from "../react/discovery/get-components-to-export"
import { exportReact } from "../react/export-react"

describe("Complete Workspace-to-Export Integration Tests", () => {
  it("should export complete React components from complex workspace", async () => {
    const result = await exportReact(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate component files for all components
    const componentFiles = result.filter((file) => file.path.endsWith(".tsx"))
    expect(componentFiles.length).toBeGreaterThan(0)

    // Should generate utility files
    const utilityFiles = result.filter(
      (file) =>
        file.path.includes("utils/") ||
        file.path.includes("primitives/") ||
        file.path.includes("icons/"),
    )
    expect(utilityFiles.length).toBeGreaterThan(0)

    // Verify specific component files are generated
    const buttonFile = result.find((file) => file.path.includes("Button.tsx"))
    const iconFile = result.find((file) => file.path.includes("Icon.tsx"))
    const labelFile = result.find((file) => file.path.includes("Label.tsx"))
    const barButtonsFile = result.find((file) =>
      file.path.includes("BarButtons.tsx"),
    )

    expect(buttonFile).toBeDefined()
    expect(iconFile).toBeDefined()
    expect(labelFile).toBeDefined()
    expect(barButtonsFile).toBeDefined()

    // Verify file contents are valid TypeScript/JSX
    expect(buttonFile!.content).toContain("export interface ButtonProps")
    expect(buttonFile!.content).toContain("export function Button")
    expect(iconFile!.content).toContain("export interface IconProps")
    expect(iconFile!.content).toContain("export function Icon")
  })

  it("should export complete CSS stylesheet from complex workspace", async () => {
    const result = await exportCss(FACTORY_WORKSPACE_FIXTURE)

    expect(typeof result).toBe("string")
    expect(result.length).toBeGreaterThan(0)

    // Should contain CSS reset styles
    expect(result).toContain("Reset styles")
    expect(result).toContain("box-sizing: border-box")

    // Should contain base styles
    expect(result).toContain("Base styles")
    expect(result).toContain("font-size: 16px")

    // Should contain theme variables
    expect(result).toContain("Theme variables")
    expect(result).toContain(":root {")
    expect(result).toContain("--sdn-ratio:")
    expect(result).toContain("--sdn-font-size:")

    // Should contain component styles
    expect(result).toContain(".sdn-button")
    expect(result).toContain(".sdn-icon")
    expect(result).toContain(".sdn-label")
    expect(result).toContain(".sdn-bar-buttons")

    // Should be properly formatted CSS
    expect(result).toContain("{")
    expect(result).toContain("}")
  })

  it("should export complete workspace with both React and CSS", async () => {
    const result = await exportWorkspace(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate both React and CSS files
    const reactFiles = result.filter((file) => file.path.endsWith(".tsx"))
    const cssFiles = result.filter((file) => file.path.endsWith(".css"))

    expect(reactFiles.length).toBeGreaterThan(0)
    expect(cssFiles.length).toBeGreaterThan(0)

    // Should generate utility files
    const utilityFiles = result.filter(
      (file) =>
        file.path.includes("utils/") ||
        file.path.includes("primitives/") ||
        file.path.includes("icons/") ||
        file.path.includes("fonts/"),
    )
    expect(utilityFiles.length).toBeGreaterThan(0)

    // Verify file structure
    result.forEach((file) => {
      expect(file).toHaveProperty("path")
      expect(file).toHaveProperty("content")
      expect(typeof file.path).toBe("string")
      expect(typeof file.content).toBe("string")
    })
  })

  it("should handle workspace with computed properties through complete export pipeline", async () => {
    const workspaceWithComputed: Workspace = {
      ...FACTORY_WORKSPACE_FIXTURE,
      byId: {
        ...FACTORY_WORKSPACE_FIXTURE.byId,
        "variant-button-default": {
          ...FACTORY_WORKSPACE_FIXTURE.byId["variant-button-default"],
          properties: {
            fontSize: {
              type: ValueType.EXACT,
              value: { unit: Unit.REM, value: 1.5 },
            },
            buttonSize: {
              type: ValueType.COMPUTED,
              value: {
                function: ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#fontSize",
                  factor: 2.5,
                },
              },
            },
            padding: {
              top: {
                type: ValueType.COMPUTED,
                value: {
                  function: ComputedFunction.OPTICAL_PADDING,
                  input: {
                    basedOn: "#fontSize",
                    factor: 1.5,
                  },
                },
              },
            },
          },
        },
      },
    }

    // First compute the workspace to resolve computed properties
    const computedWorkspace = computeWorkspace(workspaceWithComputed)

    // Then export the computed workspace
    const result = await exportWorkspace(
      computedWorkspace,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate valid files even with computed properties
    const buttonFile = result.find((file) => file.path.includes("Button.tsx"))
    expect(buttonFile).toBeDefined()
    expect(buttonFile!.content).toContain("export interface ButtonProps")
    expect(buttonFile!.content).toContain("export function Button")

    // CSS should contain resolved values
    const cssFile = result.find((file) => file.path.endsWith(".css"))
    expect(cssFile).toBeDefined()
    expect(cssFile!.content).toContain(".sdn-button")
  })

  it("should handle workspace with theme properties through complete export pipeline", async () => {
    const workspaceWithThemes: Workspace = {
      ...FACTORY_WORKSPACE_FIXTURE,
      byId: {
        ...FACTORY_WORKSPACE_FIXTURE.byId,
        "variant-button-default": {
          ...FACTORY_WORKSPACE_FIXTURE.byId["variant-button-default"],
          properties: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            fontSize: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
            padding: {
              top: {
                type: ValueType.THEME_ORDINAL,
                value: "@padding.comfortable",
              },
              bottom: {
                type: ValueType.THEME_ORDINAL,
                value: "@padding.comfortable",
              },
            },
          },
        },
      },
    }

    const result = await exportWorkspace(
      workspaceWithThemes,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate valid files with theme properties
    const buttonFile = result.find((file) => file.path.includes("Button.tsx"))
    expect(buttonFile).toBeDefined()
    expect(buttonFile!.content).toContain("export interface ButtonProps")

    // CSS should contain theme variables
    const cssFile = result.find((file) => file.path.endsWith(".css"))
    expect(cssFile).toBeDefined()
    expect(cssFile!.content).toContain("--sdn-swatch-primary:")
    expect(cssFile!.content).toContain("--sdn-font-size-large:")
    expect(cssFile!.content).toContain("--sdn-padding-comfortable:")
  })

  it("should handle empty workspace gracefully through complete export pipeline", async () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme: {},
      boards: {},
      byId: {},
    }

    const result = await exportWorkspace(emptyWorkspace, EXPORT_OPTIONS_FIXTURE)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should still generate base files even with empty workspace
    const cssFile = result.find((file) => file.path.endsWith(".css"))
    expect(cssFile).toBeDefined()
    expect(cssFile!.content).toContain("Reset styles")
    expect(cssFile!.content).toContain("Theme variables")

    // Should generate utility files
    const utilityFiles = result.filter(
      (file) =>
        file.path.includes("utils/") || file.path.includes("primitives/"),
    )
    expect(utilityFiles.length).toBeGreaterThan(0)
  })

  it("should maintain consistency between style registry and component export", async () => {
    // Build style registry
    const styleRegistry = buildStyleRegistry(FACTORY_WORKSPACE_FIXTURE)

    // Get components to export
    const components = getComponentsToExport(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
      NODE_ID_TO_CLASS_FIXTURE,
    )

    // Export the workspace
    const exportedFiles = await exportWorkspace(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
    )

    // Verify consistency
    expect(styleRegistry.nodeIdToClass).toBeDefined()
    expect(components.length).toBeGreaterThan(0)
    expect(exportedFiles.length).toBeGreaterThan(0)

    // Each component should have a corresponding class in the style registry
    components.forEach((component) => {
      expect(styleRegistry.nodeIdToClass[component.variantId]).toBeDefined()
    })

    // CSS file should contain classes for all components
    const cssFile = exportedFiles.find((file) => file.path.endsWith(".css"))
    expect(cssFile).toBeDefined()

    components.forEach((component) => {
      const className = styleRegistry.nodeIdToClass[component.variantId]
      expect(cssFile!.content).toContain(`.${className}`)
    })
  })

  it("should handle workspace with nested component hierarchies through complete export pipeline", async () => {
    const result = await exportWorkspace(
      FACTORY_WORKSPACE_FIXTURE,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate BarButtons component with nested buttons
    const barButtonsFile = result.find((file) =>
      file.path.includes("BarButtons.tsx"),
    )
    expect(barButtonsFile).toBeDefined()
    expect(barButtonsFile!.content).toContain(
      "export interface BarButtonsProps",
    )
    expect(barButtonsFile!.content).toContain("button?:")
    expect(barButtonsFile!.content).toContain("button2?:")
    expect(barButtonsFile!.content).toContain("button3?:")

    // Should generate Button component with nested label and icon
    const buttonFile = result.find((file) => file.path.includes("Button.tsx"))
    expect(buttonFile).toBeDefined()
    expect(buttonFile!.content).toContain("export interface ButtonProps")
    expect(buttonFile!.content).toContain("label?:")
    expect(buttonFile!.content).toContain("icon?:")

    // CSS should contain styles for all nested components
    const cssFile = result.find((file) => file.path.endsWith(".css"))
    expect(cssFile).toBeDefined()
    expect(cssFile!.content).toContain(".sdn-bar-buttons")
    expect(cssFile!.content).toContain(".sdn-button")
    expect(cssFile!.content).toContain(".sdn-label")
    expect(cssFile!.content).toContain(".sdn-icon")
  })

  it("should handle different export options through complete export pipeline", async () => {
    const customOptions = {
      rootDirectory: "/custom/path",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/custom/components",
        assetsFolder: "/custom/assets",
        assetPublicPath: "/custom/assets",
      },
    }

    const result = await exportWorkspace(
      SIMPLE_WORKSPACE_FIXTURE,
      customOptions,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should use custom paths
    result.forEach((file) => {
      expect(file.path).toContain("/custom/")
    })

    // Should generate component files in custom location
    const componentFiles = result.filter(
      (file) =>
        file.path.includes("/custom/components/") && file.path.endsWith(".tsx"),
    )
    expect(componentFiles.length).toBeGreaterThan(0)

    // Should generate CSS file in custom location
    const cssFile = result.find(
      (file) => file.path.includes("/custom/") && file.path.endsWith(".css"),
    )
    expect(cssFile).toBeDefined()
  })

  it("should throw error for invalid workspace", async () => {
    const invalidWorkspace = {
      version: 1,
      customTheme: {},
      boards: {
        "invalid-component": {
          id: "invalid-component" as any,
          label: "Invalid",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["invalid-variant"],
        },
      },
      byId: {
        "invalid-variant": {
          id: "invalid-variant",
          component: "invalid-component" as any,
          level: ComponentLevel.ELEMENT,
          label: "Invalid",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    // Should throw error for invalid workspace
    await expect(
      exportWorkspace(invalidWorkspace as any, EXPORT_OPTIONS_FIXTURE),
    ).rejects.toThrow()
  })

  it("should handle workspace with missing theme gracefully", async () => {
    const workspaceWithoutTheme: Workspace = {
      version: 1,
      customTheme: null as any,
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
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    // Should not throw error, but handle gracefully
    const result = await exportWorkspace(
      workspaceWithoutTheme,
      EXPORT_OPTIONS_FIXTURE,
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should still generate files
    const buttonFile = result.find((file) => file.path.includes("Button.tsx"))
    expect(buttonFile).toBeDefined()
  })

  it("should throw error for workspace with circular references", async () => {
    const workspaceWithCircular: Workspace = {
      version: 1,
      customTheme: {},
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
          fromSchema: true,
          theme: null,
          properties: {},
          children: ["child-button-1"], // Circular reference
        },
        "child-button-1": {
          id: "child-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button Child",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-button-default",
          instanceOf: "variant-button-default",
          properties: {},
          children: ["variant-button-default"], // Creates circular reference
        },
      },
    }

    // Should throw error for circular references
    await expect(
      exportWorkspace(workspaceWithCircular, EXPORT_OPTIONS_FIXTURE),
    ).rejects.toThrow()
  })

  it("should throw error for workspace with malformed properties", async () => {
    const workspaceWithMalformedProps: Workspace = {
      version: 1,
      customTheme: {},
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
          fromSchema: true,
          theme: null,
          properties: {
            color: {
              type: "invalid-type" as any,
              value: "invalid-value",
            },
            fontSize: {
              type: ValueType.EXACT,
              value: "not-a-number" as any,
            },
          },
          children: [],
        },
      },
    }

    // Should throw error for malformed properties
    await expect(
      exportWorkspace(workspaceWithMalformedProps, EXPORT_OPTIONS_FIXTURE),
    ).rejects.toThrow()
  })

  it("should throw error for export with invalid options", async () => {
    const invalidOptions = {
      rootDirectory: null as any,
      target: { framework: "invalid" as any, styles: "invalid" as any },
      output: {
        componentsFolder: null as any,
        assetsFolder: null as any,
        assetPublicPath: null as any,
      },
    }

    // Should throw error for invalid options
    await expect(
      exportWorkspace(SIMPLE_WORKSPACE_FIXTURE, invalidOptions),
    ).rejects.toThrow()
  })
})
