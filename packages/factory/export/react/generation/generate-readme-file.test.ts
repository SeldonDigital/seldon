import { describe, expect, it } from "bun:test"
import { ExportOptions } from "../../types"
import { generateReadmeFile } from "./generate-readme-file"

// Mock the dependencies

describe("generateReadmeFile", () => {
  const mockOptions: ExportOptions = {
    rootDirectory: "/test",
    target: {
      framework: "react" as const,
      styles: "css-properties" as const,
    },
    output: {
      componentsFolder: "/components",
      assetsFolder: "/assets",
      assetPublicPath: "/assets",
    },
  }

  it("should generate README for element component", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("# Seldon Components")
    expect(result.content).toContain("version: Public Alpha")
    expect(result.content).toContain(
      "This guide will help you understand how to use these components",
    )
  })

  it("should generate README for primitive component", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("# Seldon Components")
    expect(result.content).toContain("## Overview")
    expect(result.content).toContain("## Component Structure")
  })

  it("should generate README for component with no props", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("## Basic Usage")
    expect(result.content).toContain(
      "## Understanding Conditional vs Always-Rendered Elements",
    )
  })

  it("should generate README for component with complex props", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("## Function Signatures Guide")
    expect(result.content).toContain("## Common Patterns")
    expect(result.content).toContain("## Icon System")
  })

  it("should generate README for component with children", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("## Styling Integration")
    expect(result.content).toContain("## TypeScript Support")
    expect(result.content).toContain("## Best Practices")
  })

  it("should handle component with special characters in name", () => {
    const result = generateReadmeFile(mockOptions)

    expect(result).toHaveProperty("path")
    expect(result).toHaveProperty("content")
    expect(result.path).toBe("/components/README.md")
    expect(result.content).toContain("## Troubleshooting")
    expect(result.content).toContain("## Getting Help")
    expect(result.content).toContain(
      "For more information about Seldon, visit [seldon.app](https://seldon.app)",
    )
  })

  it("should generate README with proper file path", () => {
    const customOptions: ExportOptions = {
      rootDirectory: "/custom",
      target: {
        framework: "react" as const,
        styles: "css-properties" as const,
      },
      output: {
        componentsFolder: "/custom/components",
        assetsFolder: "/custom/assets",
        assetPublicPath: "/custom/assets",
      },
    }

    const result = generateReadmeFile(customOptions)

    expect(result.path).toBe("/custom/components/README.md")
    expect(result.content).toContain("# Seldon Components")
  })

  it("should include all major sections in README", () => {
    const result = generateReadmeFile(mockOptions)

    const content = result.content
    expect(content).toContain("# Seldon Components")
    expect(content).toContain("## Overview")
    expect(content).toContain("## Component Structure")
    expect(content).toContain("## Function Signatures Guide")
    expect(content).toContain("## Common Patterns")
    expect(content).toContain("## Icon System")
    expect(content).toContain("## Styling Integration")
    expect(content).toContain("## TypeScript Support")
    expect(content).toContain("## Best Practices")
    expect(content).toContain("## Troubleshooting")
    expect(content).toContain("## Getting Help")
  })

  it("should include code examples in README", () => {
    const result = generateReadmeFile(mockOptions)

    const content = result.content
    expect(content).toContain("```tsx")
    expect(content).toContain("```css")
    expect(content).toContain("<CardProduct")
    expect(content).toContain("material-add")
    expect(content).toContain("hsl(var(--sdn-swatch-primary))")
  })
})
