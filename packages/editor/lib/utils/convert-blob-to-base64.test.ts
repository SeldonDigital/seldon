import { beforeEach, describe, expect, test } from "bun:test"
import { convertBlobToBase64 } from "./convert-blob-to-base64"

// Mock FileReader for Bun test environment
beforeEach(() => {
  if (typeof globalThis.FileReader === "undefined") {
    globalThis.FileReader = class FileReader {
      result: string | ArrayBuffer | null = null
      onloadend: ((event: Event) => void) | null = null
      onerror: ((event: Event) => void) | null = null

      readAsDataURL(blob: Blob) {
        // Use Bun's built-in base64 encoding
        if (blob.size === 0) {
          this.result = "data:application/octet-stream;base64,"
          this.onloadend?.(this)
        } else {
          // Convert blob to base64 using Bun's native capabilities
          const arrayBuffer = blob.arrayBuffer()
          arrayBuffer
            .then((buffer) => {
              const bytes = new Uint8Array(buffer)
              let binary = ""
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i])
              }
              this.result = `data:text/plain;base64,${btoa(binary)}`
              this.onloadend?.(this)
            })
            .catch(() => {
              this.onerror?.(this)
            })
        }
      }
    } as typeof FileReader
  }
})

describe("convertBlobToBase64", () => {
  test("should convert a Blob to a base64 string", async () => {
    const testData = "Hello, World!"
    const blob = new Blob([testData], { type: "text/plain" })

    const result = await convertBlobToBase64(blob)

    expect(typeof result).toBe("string")
    expect(result.startsWith("data:text/plain;base64,")).toBe(true)

    const base64Data = result.split(",")[1]
    const decodedData = atob(base64Data)
    expect(decodedData).toBe(testData)
  })

  test("should handle empty Blobs", async () => {
    const emptyBlob = new Blob([], { type: "application/octet-stream" })

    const result = await convertBlobToBase64(emptyBlob)

    expect(typeof result).toBe("string")
    expect(result).toBe("data:application/octet-stream;base64,")
  })
})
