import { afterEach, describe, expect, it } from "bun:test"

import type { ExportOptions, ImageToExportMap } from "../../types"
import { getFilesToExportFromImagesToExport } from "./get-files-to-export-from-images-to-export"

const originalFetch = globalThis.fetch

const options: ExportOptions = {
  rootDirectory: "/tmp/seldon-export",
  token: "secret-token",
  target: {
    framework: "react",
    styles: "css-properties",
  },
  output: {
    assetsFolder: "/public/assets",
    componentsFolder: "/components",
    assetPublicPath: "/assets",
  },
}

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe("getFilesToExportFromImagesToExport", () => {
  it("fetches image files without forwarding the export token", async () => {
    let fetchInit: RequestInit | undefined
    globalThis.fetch = (async (
      _input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      fetchInit = init
      return new Response(new Uint8Array([1, 2, 3]), {
        headers: {
          "content-length": "3",
          "content-type": "image/png",
        },
      })
    }) as typeof fetch

    const images: ImageToExportMap = {
      "https://93.184.216.34/image.png": {
        relativePath: "/assets/image.png",
        uploadPath: "/public/assets/image.png",
      },
    }

    const files = await getFilesToExportFromImagesToExport(images, options)

    expect(files).toHaveLength(1)
    expect(fetchInit?.headers).toBeUndefined()
    expect(fetchInit?.credentials).toBe("omit")
    expect(fetchInit?.redirect).toBe("error")
  })

  it("rejects non-http image URLs", async () => {
    const images: ImageToExportMap = {
      "file:///etc/passwd": {
        relativePath: "/assets/passwd",
        uploadPath: "/public/assets/passwd",
      },
    }

    await expect(
      getFilesToExportFromImagesToExport(images, options),
    ).rejects.toThrow('Unsupported image URL protocol "file:"')
  })

  it("allows image data URLs without fetching", async () => {
    let fetched = false
    globalThis.fetch = (async () => {
      fetched = true
      return new Response()
    }) as typeof fetch

    const images: ImageToExportMap = {
      "data:image/png;base64,AQID": {
        relativePath: "/assets/image.png",
        uploadPath: "/public/assets/image.png",
      },
    }

    const files = await getFilesToExportFromImagesToExport(images, options)
    const content = new Uint8Array(files[0]!.content as ArrayBuffer)

    expect(content).toEqual(new Uint8Array([1, 2, 3]))
    expect(fetched).toBe(false)
  })

  it("rejects private and local hosts before fetching", async () => {
    let fetched = false
    globalThis.fetch = (async () => {
      fetched = true
      return new Response(new Uint8Array([1]), {
        headers: { "content-type": "image/png" },
      })
    }) as typeof fetch

    const images: ImageToExportMap = {
      "http://127.0.0.1/image.png": {
        relativePath: "/assets/image.png",
        uploadPath: "/public/assets/image.png",
      },
    }

    await expect(
      getFilesToExportFromImagesToExport(images, options),
    ).rejects.toThrow("Refusing to fetch image from private host")
    expect(fetched).toBe(false)
  })

  it("rejects non-image responses", async () => {
    globalThis.fetch = (async () => {
      return new Response("not an image", {
        headers: { "content-type": "text/html" },
      })
    }) as typeof fetch

    const images: ImageToExportMap = {
      "https://93.184.216.34/image.png": {
        relativePath: "/assets/image.png",
        uploadPath: "/public/assets/image.png",
      },
    }

    await expect(
      getFilesToExportFromImagesToExport(images, options),
    ).rejects.toThrow("Expected image content-type")
  })

  it("rejects oversized image responses", async () => {
    globalThis.fetch = (async () => {
      return new Response(new Uint8Array([1]), {
        headers: {
          "content-length": String(26 * 1024 * 1024),
          "content-type": "image/png",
        },
      })
    }) as typeof fetch

    const images: ImageToExportMap = {
      "https://93.184.216.34/image.png": {
        relativePath: "/assets/image.png",
        uploadPath: "/public/assets/image.png",
      },
    }

    await expect(
      getFilesToExportFromImagesToExport(images, options),
    ).rejects.toThrow("Image response is too large")
  })
})
