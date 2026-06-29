import { describe, expect, it } from "vitest"

import { ExportOptions, ImageToExportMap } from "../../types"
import { getFilesToExportFromImagesToExport } from "./get-files-to-export-from-images-to-export"

const options = {} as ExportOptions

describe("getFilesToExportFromImagesToExport", () => {
  it("decodes a base64 data URL to its byte content", async () => {
    // "Hi" base64-encoded
    const url = "data:text/plain;base64,SGk="
    const images: ImageToExportMap = {
      [url]: {
        uploadPath: "/assets/hi.txt",
        relativePath: "assets/hi.txt",
      },
    } as unknown as ImageToExportMap

    const files = await getFilesToExportFromImagesToExport(images, options)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe("/assets/hi.txt")
    expect(new TextDecoder().decode(files[0].content as ArrayBuffer)).toBe("Hi")
  })

  it("decodes a non-base64 data URL", async () => {
    const url = "data:text/plain,Hello%20World"
    const images: ImageToExportMap = {
      [url]: {
        uploadPath: "/assets/h.txt",
        relativePath: "assets/h.txt",
      },
    } as unknown as ImageToExportMap

    const files = await getFilesToExportFromImagesToExport(images, options)
    expect(new TextDecoder().decode(files[0].content as ArrayBuffer)).toBe(
      "Hello World",
    )
  })

  it("returns an empty list when there are no images", async () => {
    expect(
      await getFilesToExportFromImagesToExport(
        {} as ImageToExportMap,
        options,
      ),
    ).toEqual([])
  })
})
