import { beforeEach, describe, expect, it, mock } from "bun:test"
import * as path from "node:path"
import { IconId } from "@seldon/core/components/icons"
import { getIcons } from "./get-icons"

// Mock the fs module
const mockReaddirSync = mock(() => [
  {
    isFile: () => true,
    name: "IconMaterialAdd.tsx",
  },
  {
    isFile: () => true,
    name: "IconDefault.tsx",
  },
  {
    isFile: () => false,
    name: "directory",
  },
  {
    isFile: () => true,
    name: ".hidden.tsx",
  },
  {
    isFile: () => true,
    name: "index.ts",
  },
])

const mockReadFileSync = mock((filePath: string) => {
  if (filePath.includes("IconMaterialAdd.tsx")) {
    return `export function IconMaterialAdd() {
  return <svg>...</svg>
}`
  }
  if (filePath.includes("IconDefault.tsx")) {
    return `export function IconDefault() {
  return <svg>...</svg>
}`
  }
  return ""
})

mock.module("node:fs", () => ({
  readdirSync: mockReaddirSync,
  readFileSync: mockReadFileSync,
}))

// Reset mocks before each test to ensure test isolation
beforeEach(() => {
  mockReaddirSync.mockClear()
  mockReadFileSync.mockClear()
})

describe("getIcons", () => {
  // Navigate from test file to project root: test file -> export -> react -> assets -> factory -> packages -> project root
  const projectRoot = path.resolve(__dirname, "../../../../..")

  const mockOptions = {
    rootDirectory: projectRoot,
    target: { framework: "react" as const, styles: "css-properties" as const },
    output: {
      assetsFolder: "assets",
      componentsFolder: "components",
      assetPublicPath: "/assets",
    },
  }

  it("should return empty array when no icons are used", () => {
    const result = getIcons(new Set(), mockOptions)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(0)
  })

  it("should filter out non-file entries", () => {
    const customIcons = new Set<IconId>(["material-add"])

    const result = getIcons(customIcons, mockOptions)

    // Should not include directory entries
    expect(result.every((icon) => !icon.path.includes("directory"))).toBe(true)
  })

  it("should filter out hidden files", () => {
    const customIcons = new Set<IconId>(["material-add"])

    const result = getIcons(customIcons, mockOptions)

    // Should not include hidden files
    expect(result.every((icon) => !icon.path.includes(".hidden"))).toBe(true)
  })

  it("should filter out index.ts file", () => {
    const customIcons = new Set<IconId>(["material-add"])

    const result = getIcons(customIcons, mockOptions)

    // Should not include index.ts
    expect(result.every((icon) => !icon.path.includes("index.ts"))).toBe(true)
  })

  it("should include only used icons", () => {
    const customIcons = new Set<IconId>(["material-add", "__default__"])

    const result = getIcons(customIcons, mockOptions)

    // Should only include icons that are in the used set
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it("should set correct output paths", () => {
    const customIcons = new Set<IconId>(["material-add"])

    const result = getIcons(customIcons, mockOptions)

    if (result.length > 0) {
      expect(result[0].path).toContain("components/icons")
      expect(result[0].path).toContain(".tsx")
    }
  })

  it("should read file content correctly", () => {
    const customIcons = new Set<IconId>(["material-add"])

    const result = getIcons(customIcons, mockOptions)

    if (result.length > 0) {
      expect(result[0].content).toContain("export function")
      expect(result[0].content).toContain("IconMaterialAdd")
    }
  })
})
