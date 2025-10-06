import { describe, expect, it, mock } from "bun:test"
import { ImageToExportMap } from "../../types"
import { getFilesToExportFromImagesToExport } from "./get-files-to-export-from-images-to-export"

// Mock fetch globally
const mockFetch = mock(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  } as Response),
)
global.fetch = mockFetch as any

describe("getFilesToExportFromImagesToExport", () => {
  it("should convert images to export map to files to export", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
      "https://example.com/image2.png": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("path", "public/assets/images/image1.jpg")
    expect(result[0]).toHaveProperty("content")
    expect(result[1]).toHaveProperty("path", "public/assets/images/image2.png")
    expect(result[1]).toHaveProperty("content")
  })

  it("should handle empty images to export map", async () => {
    const imagesToExport: ImageToExportMap = {}

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(0)
  })

  it("should handle single image", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/single.jpg": {
        relativePath: "images/single.jpg",
        uploadPath: "public/assets/images/single.jpg",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty("path", "public/assets/images/single.jpg")
    expect(result[0]).toHaveProperty("content")
  })

  it("should handle images with different extensions", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
      "https://example.com/image2.png": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
      "https://example.com/image3.gif": {
        relativePath: "images/image3.gif",
        uploadPath: "public/assets/images/image3.gif",
      },
      "https://example.com/image4.svg": {
        relativePath: "images/image4.svg",
        uploadPath: "public/assets/images/image4.svg",
      },
      "https://example.com/image5.webp": {
        relativePath: "images/image5.webp",
        uploadPath: "public/assets/images/image5.webp",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(5)
    expect(result[0]).toHaveProperty("path", "public/assets/images/image1.jpg")
    expect(result[1]).toHaveProperty("path", "public/assets/images/image2.png")
    expect(result[2]).toHaveProperty("path", "public/assets/images/image3.gif")
    expect(result[3]).toHaveProperty("path", "public/assets/images/image4.svg")
    expect(result[4]).toHaveProperty("path", "public/assets/images/image5.webp")
  })

  it("should handle images with complex paths", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/path/to/image1.jpg": {
        relativePath: "images/path/to/image1.jpg",
        uploadPath: "public/assets/images/path/to/image1.jpg",
      },
      "https://example.com/another/path/image2.png": {
        relativePath: "images/another/path/image2.png",
        uploadPath: "public/assets/images/another/path/image2.png",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty(
      "path",
      "public/assets/images/path/to/image1.jpg",
    )
    expect(result[1]).toHaveProperty(
      "path",
      "public/assets/images/another/path/image2.png",
    )
  })

  it("should handle images with query parameters in URLs", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg?v=123": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
      "https://example.com/image2.png?size=large&format=png": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("path", "public/assets/images/image1.jpg")
    expect(result[1]).toHaveProperty("path", "public/assets/images/image2.png")
  })

  it("should handle images with hash fragments in URLs", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg#section1": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
      "https://example.com/image2.png#section2": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty("path", "public/assets/images/image1.jpg")
    expect(result[1]).toHaveProperty("path", "public/assets/images/image2.png")
  })

  it("should handle images with special characters in URLs", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image%20with%20spaces.jpg": {
        relativePath: "images/image with spaces.jpg",
        uploadPath: "public/assets/images/image with spaces.jpg",
      },
      "https://example.com/image-with-dashes.png": {
        relativePath: "images/image-with-dashes.png",
        uploadPath: "public/assets/images/image-with-dashes.png",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty(
      "path",
      "public/assets/images/image with spaces.jpg",
    )
    expect(result[1]).toHaveProperty(
      "path",
      "public/assets/images/image-with-dashes.png",
    )
  })

  it("should handle images with different domains", async () => {
    const imagesToExport: ImageToExportMap = {
      "https://example.com/image1.jpg": {
        relativePath: "images/image1.jpg",
        uploadPath: "public/assets/images/image1.jpg",
      },
      "https://cdn.example.com/image2.png": {
        relativePath: "images/image2.png",
        uploadPath: "public/assets/images/image2.png",
      },
      "https://images.example.com/image3.gif": {
        relativePath: "images/image3.gif",
        uploadPath: "public/assets/images/image3.gif",
      },
    }

    const options = {
      rootDirectory: "/test",
      token: "test-token",
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
    const result = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )

    expect(result).toHaveLength(3)
    expect(result[0]).toHaveProperty("path", "public/assets/images/image1.jpg")
    expect(result[1]).toHaveProperty("path", "public/assets/images/image2.png")
    expect(result[2]).toHaveProperty("path", "public/assets/images/image3.gif")
  })
})
