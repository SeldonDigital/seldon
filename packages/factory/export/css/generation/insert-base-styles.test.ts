import { describe, expect, it } from "bun:test"
import { insertBaseStyles } from "./insert-base-styles"

describe("insertBaseStyles", () => {
  it("should insert base styles into empty stylesheet", () => {
    const result = insertBaseStyles("")

    expect(result).toContain("Base styles")
    expect(result).toContain("html {")
    expect(result).toContain("font-size: 16px")
    expect(result).toContain(":root {")
    expect(result).toContain("--hairline: 1px")
  })

  it("should append base styles to existing stylesheet", () => {
    const existingStylesheet =
      "/* Existing styles */\n.existing { color: red; }"
    const result = insertBaseStyles(existingStylesheet)

    expect(result).toContain("/* Existing styles */")
    expect(result).toContain(".existing { color: red; }")
    expect(result).toContain("Base styles")
    expect(result).toContain("html {")
    expect(result).toContain("font-size: 16px")
  })

  it("should include hairline variable", () => {
    const result = insertBaseStyles("")

    expect(result).toContain("--hairline: 1px")
  })

  it("should include responsive hairline adjustments", () => {
    const result = insertBaseStyles("")

    // Check for 2x pixel ratio
    expect(result).toContain(
      "@media only screen and (-webkit-min-device-pixel-ratio: 2)",
    )
    expect(result).toContain("min-resolution: 192dpi")
    expect(result).toContain("--hairline: 0.5px")

    // Check for 3x pixel ratio
    expect(result).toContain(
      "@media only screen and (-webkit-min-device-pixel-ratio: 3)",
    )
    expect(result).toContain("min-resolution: 288dpi")
    expect(result).toContain("--hairline: 0.33px")

    // Check for 4x pixel ratio
    expect(result).toContain(
      "@media only screen and (-webkit-min-device-pixel-ratio: 4)",
    )
    expect(result).toContain("min-resolution: 384dpi")
    expect(result).toContain("--hairline: 0.25px")
  })

  it("should include proper CSS structure", () => {
    const result = insertBaseStyles("")

    expect(result).toContain("/********************************************")
    expect(result).toContain("*               Base styles                *")
    expect(result).toContain("********************************************/")
  })

  it("should set base font size to 16px", () => {
    const result = insertBaseStyles("")

    expect(result).toContain("font-size: 16px")
  })

  it("should handle multiple calls correctly", () => {
    const firstCall = insertBaseStyles("")
    const secondCall = insertBaseStyles(firstCall)

    // Should not duplicate base styles
    const baseStylesCount = (secondCall.match(/Base styles/g) || []).length
    expect(baseStylesCount).toBe(1)
  })

  it("should maintain proper CSS formatting", () => {
    const result = insertBaseStyles("")

    // Check for proper CSS syntax
    expect(result).toContain("html {")
    expect(result).toContain(":root {")
    expect(result).toContain("}")
  })
})
