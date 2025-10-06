import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { getFontsComponent } from "./get-fonts-component"

describe("getFontsComponent", () => {
  const createMockWorkspace = (): Workspace => ({
    version: 1,
    customTheme,
    boards: {
      [ComponentId.BUTTON]: {
        id: ComponentId.BUTTON,
        label: "Button",
        order: 0,
        theme: "default",
        properties: {},
        variants: [],
      },
    },
    byId: {},
  })

  const createMockOptions = () => ({
    rootDirectory: "/test",
    target: {
      framework: "react" as const,
      styles: "css-properties" as const,
    },
    output: {
      assetsFolder: "assets",
      componentsFolder: "components",
      assetPublicPath: "/assets",
    },
  })

  it("should generate fonts component with default fonts", async () => {
    const workspace = createMockWorkspace()
    const options = createMockOptions()
    const result = await getFontsComponent(workspace, options)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("components/Fonts.tsx")
    expect(result.content).toContain("export function Fonts()")
    expect(result.content).toContain("return (")
    expect(result.content).toContain("<link")
    expect(result.content).toContain('rel="stylesheet"')
  })

  it("should generate fonts component with empty workspace", async () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }
    const options = createMockOptions()
    const result = await getFontsComponent(workspace, options)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("components/Fonts.tsx")
    expect(result.content).toContain("export function Fonts()")
    expect(result.content).toContain("return (")
  })

  it("should generate fonts component with workspace containing nodes", async () => {
    const workspace = createMockWorkspace()
    const options = createMockOptions()
    const result = await getFontsComponent(workspace, options)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("components/Fonts.tsx")
    expect(result.content).toContain("export function Fonts()")
    expect(result.content).toContain("return (")
  })

  it("should return FileToExport object with correct structure", async () => {
    const workspace = createMockWorkspace()
    const options = createMockOptions()
    const result = await getFontsComponent(workspace, options)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(typeof result.path).toBe("string")
    expect(typeof result.content).toBe("string")
    expect(result.path).toContain("Fonts.tsx")
  })
})
