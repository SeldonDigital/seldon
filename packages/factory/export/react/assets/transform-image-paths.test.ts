import { describe, expect, it } from "bun:test"
import { ValueType, Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { ImageToExportMap } from "../../types"
import { transformImagePaths } from "./transform-image-paths"

describe("transformImagePaths", () => {
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
        variants: ["variant-button-default"],
      },
    },
    byId: {
      "variant-button-default": {
        id: "variant-button-default",
        component: ComponentId.BUTTON,
        level: ComponentLevel.ELEMENT,
        label: "Button Default",
        theme: "default",
        properties: {
          background: {
            image: {
              type: ValueType.EXACT,
              value: "https://example.com/image1.jpg",
            },
          },
          source: {
            type: ValueType.EXACT,
            value: "https://example.com/image2.png",
          },
        },
        isChild: false,
        type: "defaultVariant",
        fromSchema: true,
      },
    },
  })

  const createMockImagesToExport = (): ImageToExportMap => ({
    "https://example.com/image1.jpg": {
      relativePath: "images/image1.jpg",
      uploadPath: "public/assets/images/image1.jpg",
    },
    "https://example.com/image2.png": {
      relativePath: "images/image2.png",
      uploadPath: "public/assets/images/image2.png",
    },
  })

  it("should replace image paths in workspace with relative paths", () => {
    const workspace = createMockWorkspace()
    const imagesToExport = createMockImagesToExport()

    const result = transformImagePaths(workspace, imagesToExport)

    expect(
      result.byId["variant-button-default"]?.properties.background?.image
        ?.value,
    ).toBe("images/image1.jpg")
    expect(
      result.byId["variant-button-default"]?.properties.source?.value,
    ).toBe("images/image2.png")
  })

  it("should handle workspace with no images to replace", () => {
    const workspace = createMockWorkspace()
    const imagesToExport: ImageToExportMap = {}

    const result = transformImagePaths(workspace, imagesToExport)

    // Should remain unchanged since no images match
    expect(
      result.byId["variant-button-default"]?.properties.background?.image
        ?.value,
    ).toBe("https://example.com/image1.jpg")
    expect(
      result.byId["variant-button-default"]?.properties.source?.value,
    ).toBe("https://example.com/image2.png")
  })

  it("should handle empty workspace", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }
    const imagesToExport = createMockImagesToExport()

    const result = transformImagePaths(workspace, imagesToExport)

    expect(result.byId).toEqual({})
  })

  it("should only replace background image paths", () => {
    const workspace = createMockWorkspace()
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
    }

    const result = transformImagePaths(workspace, imagesToExport)

    expect(
      result.byId["variant-button-default"]?.properties.background?.image
        ?.value,
    ).toBe("images/image1.jpg")
    expect(
      result.byId["variant-button-default"]?.properties.source?.value,
    ).toBe("https://example.com/image2.png")
  })

  it("should only replace source image paths", () => {
    const workspace = createMockWorkspace()
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image2.png": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
    }

    const result = transformImagePaths(workspace, imagesToExport)

    expect(
      result.byId["variant-button-default"]?.properties.background?.image
        ?.value,
    ).toBe("https://example.com/image1.jpg")
    expect(
      result.byId["variant-button-default"]?.properties.source?.value,
    ).toBe("images/image2.png")
  })

  it("should handle workspace with multiple nodes", () => {
    const workspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-button-1", "variant-button-2"],
        },
      },
      byId: {
        "variant-button-1": {
          id: "variant-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 1",
          theme: "default",
          properties: {
            background: {
              image: {
                type: ValueType.EXACT,
                value: "https://example.com/image1.jpg",
              },
            },
          },
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
        "variant-button-2": {
          id: "variant-button-2",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 2",
          theme: "default",
          properties: {
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/image2.png",
            },
          },
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
      },
    }
    const imagesToExport = createMockImagesToExport()

    const result = transformImagePaths(workspace, imagesToExport)

    expect(
      result.byId["variant-button-1"]?.properties.background?.image?.value,
    ).toBe("images/image1.jpg")
    expect(result.byId["variant-button-2"]?.properties.source?.value).toBe(
      "images/image2.png",
    )
  })

  it("should not modify original workspace", () => {
    const workspace = createMockWorkspace()
    const imagesToExport = createMockImagesToExport()
    const originalBackgroundValue =
      workspace.byId["variant-button-default"]?.properties.background?.image
        ?.value
    const originalSourceValue =
      workspace.byId["variant-button-default"]?.properties.source?.value

    transformImagePaths(workspace, imagesToExport)

    expect(
      workspace.byId["variant-button-default"]?.properties.background?.image
        ?.value,
    ).toBe(originalBackgroundValue)
    expect(
      workspace.byId["variant-button-default"]?.properties.source?.value,
    ).toBe(originalSourceValue)
  })
})
