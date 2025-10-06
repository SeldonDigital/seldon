import { beforeEach, expect, it, mock } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { handleAddBoard } from "@seldon/core/workspace/reducers/core/handlers/handle-add-board"
import { FileToExport, ImageToExportMap } from "../types"
import { exportReact } from "./export-react"

// Mock the fs module for file system operations
const mockReaddirSync = mock((dirPath: string) => {
  if (dirPath.includes("native-react")) {
    return [
      {
        isFile: () => true,
        name: "HTML.Button.tsx",
        parentPath: "/mock/native-react",
      },
      {
        isFile: () => true,
        name: "HTML.Div.tsx",
        parentPath: "/mock/native-react",
      },
      {
        isFile: () => true,
        name: "HTML.Span.tsx",
        parentPath: "/mock/native-react",
      },
    ]
  }
  if (dirPath.includes("icons")) {
    return [
      { isFile: () => true, name: "IconMaterialAdd.tsx" },
      { isFile: () => true, name: "IconDefault.tsx" },
    ]
  }
  return []
})

const mockReadFileSync = mock((filePath: string) => {
  if (filePath.includes("HTML.Button.tsx")) {
    return `export const HTMLButton = () => <button />`
  }
  if (filePath.includes("HTML.Div.tsx")) {
    return `export const HTMLDiv = () => <div />`
  }
  if (filePath.includes("HTML.Span.tsx")) {
    return `export const HTMLSpan = () => <span />`
  }
  if (filePath.includes("IconMaterialAdd.tsx")) {
    return `export function IconMaterialAdd() { return <svg>...</svg> }`
  }
  if (filePath.includes("IconDefault.tsx")) {
    return `export function IconDefault() { return <svg>...</svg> }`
  }
  return ""
})

mock.module("node:fs", () => ({
  default: {
    readdirSync: mockReaddirSync,
    readFileSync: mockReadFileSync,
  },
  readdirSync: mockReaddirSync,
  readFileSync: mockReadFileSync,
}))

// Reset mocks before each test to ensure test isolation
beforeEach(() => {
  mockReaddirSync.mockClear()
  mockReadFileSync.mockClear()
})

/**
 * Make sure we mock the getImagesToExport & getImageExports functions
 * because they are doing external requests
 */

mock.module("./assets/get-images-to-export", () => {
  return {
    getImagesToExport: (workspace: Workspace) => {
      const nodes = Object.values(workspace.byId)
      const images: ImageToExportMap = {}
      for (const node of nodes) {
        if (node.properties?.background?.image?.value) {
          images[node.properties.background.image.value] = {
            relativePath: "x",
            uploadPath: "y",
          }
        }
        if (node.properties.source?.value) {
          images[node.properties.source.value] = {
            relativePath: "x",
            uploadPath: "y",
          }
        }
      }
      return images
    },
  }
})

mock.module("./assets/get-files-to-export-from-images-to-export", () => {
  return {
    getFilesToExportFromImagesToExport: (imagesToExport: ImageToExportMap) => {
      const filesToExport: FileToExport[] = []
      for (const url of Object.keys(imagesToExport)) {
        filesToExport.push({
          path: imagesToExport[url].uploadPath,
          content: new ArrayBuffer(1),
        })
      }
      return filesToExport
    },
  }
})

it("should export a workspace to React components", async () => {
  const workspace = handleAddBoard(
    {
      componentId: ComponentId.BUTTON,
    },
    {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    },
  )

  const result = await exportReact(workspace, {
    rootDirectory: "/Users/andreiseldon/seldon",
    target: { framework: "react", styles: "css-properties" },
    output: {
      componentsFolder: "/src/components",
      assetsFolder: "/public/assets",
      assetPublicPath: "/assets",
    },
  })

  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)

  // Check that we have the expected file types
  const filePaths = result.map((file) => file.path)
  expect(filePaths.some((path) => path.includes("Button.tsx"))).toBe(true)
  expect(filePaths.some((path) => path.includes("styles.css"))).toBe(true)
})
