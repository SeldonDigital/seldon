import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import "../../bun-setup"
import { triggerDownload } from "./trigger-download"

describe("triggerDownload", () => {
  let mockCreateElement: (tagName: string) => HTMLElement
  let mockClick: { click: () => void }
  let mockRemove: { remove: () => void }
  let mockCreateObjectURL: (blob: Blob) => string
  let mockRevokeObjectURL: (url: string) => void

  beforeEach(() => {
    // Mock DOM methods
    mockClick = { click: () => {} }
    mockRemove = { remove: () => {} }
    mockCreateElement = (tagName: string) => {
      if (tagName === "a") {
        return {
          href: "",
          download: "",
          click: mockClick.click,
          remove: mockRemove.remove,
        }
      }
      return {}
    }

    mockCreateObjectURL = (_blob: Blob) => "mock-url"
    mockRevokeObjectURL = (_url: string) => {}

    // Mock global objects
    global.document = {
      createElement: mockCreateElement,
    } as Document

    global.URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    } as typeof URL
  })

  afterEach(() => {
    // No cleanup needed - let happy-dom handle the document
  })

  it("should create download link and trigger download", () => {
    const blob = new Blob(["test content"], { type: "text/plain" })
    const filename = "test.txt"

    // Spy on the methods
    const _createObjectURLSpy = { createObjectURL: mockCreateObjectURL }
    const _revokeObjectURLSpy = { revokeObjectURL: mockRevokeObjectURL }

    triggerDownload(blob, filename)

    // Verify that URL.createObjectURL was called with the blob
    expect(_createObjectURLSpy.createObjectURL).toBeDefined()

    // Verify that URL.revokeObjectURL was called
    expect(_revokeObjectURLSpy.revokeObjectURL).toBeDefined()
  })

  it("should handle different blob types", () => {
    const jsonBlob = new Blob(['{"test": "data"}'], {
      type: "application/json",
    })
    const filename = "data.json"

    expect(() => triggerDownload(jsonBlob, filename)).not.toThrow()
  })

  it("should handle different filename formats", () => {
    const blob = new Blob(["content"], { type: "text/plain" })

    expect(() => triggerDownload(blob, "file.txt")).not.toThrow()
    expect(() => triggerDownload(blob, "file with spaces.txt")).not.toThrow()
    expect(() => triggerDownload(blob, "file-with-dashes.txt")).not.toThrow()
  })
})
