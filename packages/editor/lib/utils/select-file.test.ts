import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import "../../bun-setup"
import { selectFile } from "./select-file"

describe("selectFile", () => {
  let mockCreateElement: (tagName: string) => HTMLElement
  let mockClick: { click: () => void }
  let mockRemove: { remove: () => void }

  beforeEach(() => {
    // Mock DOM methods
    mockClick = { click: () => {} }
    mockRemove = { remove: () => {} }
    mockCreateElement = (tagName: string) => {
      if (tagName === "input") {
        return {
          type: "",
          files: null,
          onchange: null,
          oncancel: null,
          click: mockClick.click,
          remove: mockRemove.remove,
        }
      }
      return {}
    }

    // Mock global document
    global.document = {
      createElement: mockCreateElement,
    } as Document
  })

  afterEach(() => {
    // No cleanup needed - let happy-dom handle the document
  })

  it("should create file input and return promise", () => {
    const promise = selectFile()

    expect(promise).toBeInstanceOf(Promise)
  })

  it("should handle file selection", async () => {
    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    })

    // Mock input with file
    const mockInput = {
      type: "file",
      files: [mockFile],
      onchange: null,
      oncancel: null,
      click: mockClick.click,
      remove: mockRemove.remove,
    }

    mockCreateElement = () => mockInput
    global.document = { createElement: mockCreateElement } as Document

    const promise = selectFile()

    // Simulate file selection
    if (mockInput.onchange) {
      mockInput.onchange()
    }

    const result = await promise
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.file).toBe(mockFile)
    }
  })

  it("should handle file selection cancellation", async () => {
    // Mock input without file
    const mockInput = {
      type: "file",
      files: [],
      onchange: null,
      oncancel: null,
      click: mockClick.click,
      remove: mockRemove.remove,
    }

    mockCreateElement = () => mockInput
    global.document = { createElement: mockCreateElement } as Document

    const promise = selectFile()

    // Simulate cancellation
    if (mockInput.oncancel) {
      mockInput.oncancel()
    }

    const result = await promise
    expect(result.success).toBe(false)
  })
})
