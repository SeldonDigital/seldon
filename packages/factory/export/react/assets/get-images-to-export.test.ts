import { describe, expect, it, mock } from "bun:test"
import { ValueType, Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { ExportOptions } from "../../types"
import { getImagesToExport } from "./get-images-to-export"

// Mock fetch globally
const mockFetch = mock(() =>
  Promise.resolve({
    headers: {
      get: () => "image/png",
    },
    ok: true,
    redirected: false,
    status: 200,
    statusText: "OK",
    type: "basic" as ResponseType,
    url: "",
    clone: () => ({}) as Response,
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    bytes: () => Promise.resolve(new Uint8Array(0)),
  } as unknown as Response),
)
global.fetch = mockFetch as any

describe("getImagesToExport", () => {
  const mockOptions: ExportOptions = {
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
  }

  it("should extract images from workspace properties", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background.jpg",
              },
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "variant-image-default": {
          id: "variant-image-default",
          component: ComponentId.IMAGE,
          level: ComponentLevel.ELEMENT,
          label: "Image Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-image-1": {
          id: "child-image-1",
          component: ComponentId.IMAGE,
          level: ComponentLevel.ELEMENT,
          label: "Image",
          theme: "default",
          properties: {
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/image.png",
            },
          },
          isChild: true,
          variant: "variant-image-default",
          instanceOf: "variant-image-default",
          fromSchema: false,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg"]).toBeDefined()
    expect(result["https://example.com/image.png"]).toBeDefined()
    expect(result["https://example.com/background.jpg"]).toHaveProperty(
      "relativePath",
    )
    expect(result["https://example.com/background.jpg"]).toHaveProperty(
      "uploadPath",
    )
    expect(result["https://example.com/image.png"]).toHaveProperty(
      "relativePath",
    )
    expect(result["https://example.com/image.png"]).toHaveProperty("uploadPath")
  })

  it("should handle workspace with no images", async () => {
    const mockWorkspace: Workspace = {
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
              color: { type: ValueType.EXACT, value: "#ff0000" },
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result).toEqual({})
  })

  it("should handle empty workspace", async () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = await getImagesToExport(emptyWorkspace, mockOptions)

    expect(result).toEqual({})
  })

  it("should handle workspace with multiple images", async () => {
    const mockWorkspace: Workspace = {
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
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
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
                value: "https://example.com/background1.jpg",
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
            background: {
              image: {
                type: ValueType.EXACT,
                value: "https://example.com/background2.jpg",
              },
            },
          },
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
        "variant-image-default": {
          id: "variant-image-default",
          component: ComponentId.IMAGE,
          level: ComponentLevel.ELEMENT,
          label: "Image Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
        "child-image-1": {
          id: "child-image-1",
          component: ComponentId.IMAGE,
          level: ComponentLevel.ELEMENT,
          label: "Image 1",
          theme: "default",
          properties: {
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/image1.png",
            },
          },
          isChild: true,
          variant: "variant-image-default",
          instanceOf: "variant-image-default",
          fromSchema: false,
        },
        "child-image-2": {
          id: "child-image-2",
          component: ComponentId.IMAGE,
          level: ComponentLevel.ELEMENT,
          label: "Image 2",
          theme: "default",
          properties: {
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/image2.png",
            },
          },
          isChild: true,
          variant: "variant-image-default",
          instanceOf: "variant-image-default",
          fromSchema: false,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background1.jpg"]).toBeDefined()
    expect(result["https://example.com/background2.jpg"]).toBeDefined()
    expect(result["https://example.com/image1.png"]).toBeDefined()
    expect(result["https://example.com/image2.png"]).toBeDefined()
  })

  it("should handle workspace with duplicate images", async () => {
    const mockWorkspace: Workspace = {
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
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
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
                value: "https://example.com/background.jpg",
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
            background: {
              image: {
                type: ValueType.EXACT,
                value: "https://example.com/background.jpg",
              },
            },
          },
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg"]).toBeDefined()
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(1)
  })

  it("should handle workspace with images in nested properties", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background.jpg",
              },
            },
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/icon.png",
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg"]).toBeDefined()
    expect(result["https://example.com/icon.png"]).toBeDefined()
  })

  it("should handle workspace with images in different property types", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background.jpg",
              },
            },
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/source.png",
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg"]).toBeDefined()
    expect(result["https://example.com/source.png"]).toBeDefined()
  })

  it("should handle workspace with images containing query parameters", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background.jpg?v=123",
              },
            },
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/source.png?size=large&format=png",
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg?v=123"]).toBeDefined()
    expect(
      result["https://example.com/source.png?size=large&format=png"],
    ).toBeDefined()
  })

  it("should handle workspace with images containing hash fragments", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background.jpg#section1",
              },
            },
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/source.png#section2",
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(result["https://example.com/background.jpg#section1"]).toBeDefined()
    expect(result["https://example.com/source.png#section2"]).toBeDefined()
  })

  it("should handle workspace with images containing special characters", async () => {
    const mockWorkspace: Workspace = {
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
                value: "https://example.com/background%20with%20spaces.jpg",
              },
            },
            source: {
              type: ValueType.EXACT,
              value: "https://example.com/image-with-dashes.png",
            },
          },
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const result = await getImagesToExport(mockWorkspace, mockOptions)

    expect(
      result["https://example.com/background%20with%20spaces.jpg"],
    ).toBeDefined()
    expect(result["https://example.com/image-with-dashes.png"]).toBeDefined()
  })
})
