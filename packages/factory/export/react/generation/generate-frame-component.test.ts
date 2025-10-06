import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { ComponentToExport } from "../../types"
import { generateFrameComponent } from "./generate-frame-component"

// Using real implementations instead of mocks to avoid test interference

describe("generateFrameComponent", () => {
  it("should generate frame component from component to export", async () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.FRAME,
      variantId: "variant-frame-default",
      defaultVariantId: "variant-frame-default",
      name: "Frame",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/frames/Frame.tsx",
      },
      tree: {
        name: "Frame",
        nodeId: "variant-frame-default",
        level: ComponentLevel.FRAME,
        dataBinding: {
          interfaceName: "FrameProps",
          path: "root",
          props: {
            width: { type: "number", value: 100, defaultValue: "100px" },
            height: { type: "number", value: 200, defaultValue: "200px" },
          },
        },
        children: [],
      },
    }

    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const mockOptions = {
      rootDirectory: "/test",
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

    const result = await generateFrameComponent(mockOptions)

    expect(result.content).toContain("export function Frame")
    expect(result.content).toContain("type FrameProps")
    expect(result.content).toContain('import { HTMLAttributes } from "react"')
    expect(result.content).toContain(
      'import { HTMLDiv } from "../native-react/HTML.Div"',
    )
    expect(result.content).toContain("return <HTMLDiv {...props} />")
  })

  it("should handle frame component with children", async () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.FRAME,
      variantId: "variant-frame-default",
      defaultVariantId: "variant-frame-default",
      name: "Frame",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/frames/Frame.tsx",
      },
      tree: {
        name: "Frame",
        nodeId: "variant-frame-default",
        level: ComponentLevel.FRAME,
        dataBinding: {
          interfaceName: "FrameProps",
          path: "root",
          props: {},
        },
        children: [
          {
            name: "Button",
            nodeId: "child-button-1",
            level: ComponentLevel.ELEMENT,
            dataBinding: {
              interfaceName: "ButtonProps",
              path: "root.button",
              props: {},
            },
            children: [],
          },
        ],
      },
    }

    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const mockOptions = {
      rootDirectory: "/test",
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

    const result = await generateFrameComponent(mockOptions)

    expect(result.content).toContain("export function Frame")
    expect(result.content).toContain("type FrameProps")
    expect(result.content).toContain('import { HTMLAttributes } from "react"')
  })

  it("should handle frame component with complex props", async () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.FRAME,
      variantId: "variant-frame-default",
      defaultVariantId: "variant-frame-default",
      name: "Frame",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/frames/Frame.tsx",
      },
      tree: {
        name: "Frame",
        nodeId: "variant-frame-default",
        level: ComponentLevel.FRAME,
        dataBinding: {
          interfaceName: "FrameProps",
          path: "root",
          props: {
            width: { type: "number", value: 100, defaultValue: "100px" },
            height: { type: "number", value: 200, defaultValue: "200px" },
            backgroundColor: {
              type: "color",
              value: "red",
              defaultValue: "#ff0000",
            },
            borderRadius: { type: "number", value: 8, defaultValue: "8px" },
            padding: { type: "number", value: 16, defaultValue: "16px" },
          },
        },
        children: [],
      },
    }

    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const mockOptions = {
      rootDirectory: "/test",
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

    const result = await generateFrameComponent(mockOptions)

    expect(result.content).toContain("export function Frame")
    expect(result.content).toContain("type FrameProps")
    expect(result.content).toContain('import { HTMLAttributes } from "react"')
  })

  it("should handle frame component with no props", async () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.FRAME,
      variantId: "variant-frame-default",
      defaultVariantId: "variant-frame-default",
      name: "Frame",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/frames/Frame.tsx",
      },
      tree: {
        name: "Frame",
        nodeId: "variant-frame-default",
        level: ComponentLevel.FRAME,
        dataBinding: {
          interfaceName: "FrameProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const mockOptions = {
      rootDirectory: "/test",
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

    const result = await generateFrameComponent(mockOptions)

    expect(result.content).toContain("export function Frame")
    expect(result.content).toContain("type FrameProps")
    expect(result.content).toContain('import { HTMLAttributes } from "react"')
  })
})
