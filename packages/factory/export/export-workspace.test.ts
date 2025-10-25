import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { exportWorkspace } from "./export-workspace"
import { ExportOptions } from "./types"

describe("exportWorkspace", () => {
  const mockOptions: ExportOptions = {
    rootDirectory: process.cwd(),
    target: {
      framework: "react" as const,
      styles: "css-properties" as const,
    },
    output: {
      componentsFolder: "/components",
      assetsFolder: "/assets",
      assetPublicPath: "/assets",
    },
  }

  it("should export workspace with React components and CSS", async () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          component: ComponentId.BUTTON,
          label: "Buttons",
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

    const result = await exportWorkspace(workspace, mockOptions)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Check that files have the expected structure
    result.forEach((file) => {
      expect(file).toHaveProperty("path")
      expect(file).toHaveProperty("content")
      expect(typeof file.path).toBe("string")
      expect(typeof file.content).toBe("string")
    })

    // Check that components folder is properly set with seldon folder
    const componentFiles = result.filter((file) =>
      file.path.includes("/components/seldon/"),
    )
    expect(componentFiles.length).toBeGreaterThan(0)

    // Check that assets folder is properly set with seldon folder
    // Note: Asset files are only generated when there are actual images in the workspace
    // Since this test workspace has no images, no asset files should be generated
    const assetFiles = result.filter((file) =>
      file.path.includes("/assets/seldon/"),
    )
    expect(assetFiles.length).toBe(0) // No assets in this workspace
  })

  it("should handle empty workspace", async () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = await exportWorkspace(emptyWorkspace, mockOptions)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should still generate base files even with empty workspace
    result.forEach((file) => {
      expect(file).toHaveProperty("path")
      expect(file).toHaveProperty("content")
    })
  })

  it("should handle workspace with multiple components", async () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          component: ComponentId.BUTTON,
          label: "Buttons",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          component: ComponentId.ICON,
          label: "Icons",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
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
        "variant-icon-default": {
          id: "variant-icon-default",
          type: "defaultVariant",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: [],
        },
      },
    }

    const result = await exportWorkspace(workspace, mockOptions)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    // Should generate files for both components
    const buttonFiles = result.filter((file) => file.path.includes("Button"))
    const iconFiles = result.filter((file) => file.path.includes("Icon"))

    expect(buttonFiles.length).toBeGreaterThan(0)
    expect(iconFiles.length).toBeGreaterThan(0)
  })

  it("should normalize folder paths correctly", async () => {
    const optionsWithTrailingSlash: ExportOptions = {
      rootDirectory: process.cwd(),
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components/", // Trailing slash
        assetsFolder: "/assets/", // Trailing slash
        assetPublicPath: "/assets",
      },
    }

    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = await exportWorkspace(workspace, optionsWithTrailingSlash)

    expect(Array.isArray(result)).toBe(true)

    // Check that paths are normalized (no double slashes)
    result.forEach((file) => {
      expect(file.path).not.toContain("//")
    })
  })

  it("should generate CSS files", async () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          component: ComponentId.BUTTON,
          label: "Buttons",
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

    const result = await exportWorkspace(workspace, mockOptions)

    // Should generate CSS files
    const cssFiles = result.filter((file) => file.path.endsWith(".css"))
    expect(cssFiles.length).toBeGreaterThan(0)

    // CSS files should contain actual CSS content
    cssFiles.forEach((file) => {
      expect(file.content).toContain("{")
      expect(file.content).toContain("}")
    })
  })

  it("should generate React component files", async () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          component: ComponentId.BUTTON,
          label: "Buttons",
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

    const result = await exportWorkspace(workspace, mockOptions)

    // Should generate React component files
    const reactFiles = result.filter((file) => file.path.endsWith(".tsx"))
    expect(reactFiles.length).toBeGreaterThan(0)

    // React files should contain actual TypeScript/JSX content
    reactFiles.forEach((file) => {
      expect(file.content).toContain("export")
      expect(file.content).toContain("=") // Arrow function or assignment
    })
  })

  it("should handle different export options", async () => {
    const differentOptions: ExportOptions = {
      rootDirectory: process.cwd(),
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/src/components",
        assetsFolder: "/public/assets",
        assetPublicPath: "/assets",
      },
    }

    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = await exportWorkspace(workspace, differentOptions)

    expect(Array.isArray(result)).toBe(true)

    // Should use the different paths
    const componentFiles = result.filter((file) =>
      file.path.includes("/src/components/seldon/"),
    )
    const assetFiles = result.filter((file) =>
      file.path.includes("/public/assets/seldon/"),
    )

    expect(componentFiles.length).toBeGreaterThan(0)
    // Note: Asset files are only generated when there are actual images in the workspace
    // Since this test workspace has no images, no asset files should be generated
    expect(assetFiles.length).toBe(0) // No assets in this workspace
  })

  it("should throw error for unsupported framework", async () => {
    const unsupportedOptions: ExportOptions = {
      rootDirectory: process.cwd(),
      target: {
        framework: "vue" as any, // Unsupported framework
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/components",
        assetsFolder: "/assets",
        assetPublicPath: "/assets",
      },
    }

    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    await expect(
      exportWorkspace(workspace, unsupportedOptions),
    ).rejects.toThrow("Unsupported target.framework: vue")
  })
})
