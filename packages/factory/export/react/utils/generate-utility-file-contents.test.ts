import { describe, expect, it } from "bun:test"
import { generateUtilityFileContents } from "./generate-utility-file-contents"

describe("generateUtilityFileContents", () => {
  it("should generate utility file contents with default options", () => {
    const result = generateUtilityFileContents()

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with custom function name", () => {
    const result = generateUtilityFileContents("customFunction")

    expect(result).toContain("export function customFunction()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with custom return value", () => {
    const result = generateUtilityFileContents("utility", "custom return value")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'custom return value'")
  })

  it("should generate utility file contents with custom function name and return value", () => {
    const result = generateUtilityFileContents(
      "customFunction",
      "custom return value",
    )

    expect(result).toContain("export function customFunction()")
    expect(result).toContain("return 'custom return value'")
  })

  it("should generate utility file contents with empty function name", () => {
    const result = generateUtilityFileContents("")

    expect(result).toContain("export function ()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with empty return value", () => {
    const result = generateUtilityFileContents("utility", "")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return ''")
  })

  it("should generate utility file contents with special characters in function name", () => {
    const result = generateUtilityFileContents("custom-function")

    expect(result).toContain("export function custom-function()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with special characters in return value", () => {
    const result = generateUtilityFileContents(
      "utility",
      "Hello, World! @#$%^&*()",
    )

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello, World! @#$%^&*()'")
  })

  it("should generate utility file contents with numbers in function name", () => {
    const result = generateUtilityFileContents("utility123")

    expect(result).toContain("export function utility123()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with numbers in return value", () => {
    const result = generateUtilityFileContents("utility", "123456789")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return '123456789'")
  })

  it("should generate utility file contents with mixed case function name", () => {
    const result = generateUtilityFileContents("customFunction")

    expect(result).toContain("export function customFunction()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with mixed case return value", () => {
    const result = generateUtilityFileContents("utility", "Hello World")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with very long function name", () => {
    const result = generateUtilityFileContents(
      "veryLongFunctionNameWithManyWords",
    )

    expect(result).toContain(
      "export function veryLongFunctionNameWithManyWords()",
    )
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with very long return value", () => {
    const result = generateUtilityFileContents(
      "utility",
      "This is a very long return value with many words and characters",
    )

    expect(result).toContain("export function utility()")
    expect(result).toContain(
      "return 'This is a very long return value with many words and characters'",
    )
  })

  it("should generate utility file contents with function name containing spaces", () => {
    const result = generateUtilityFileContents("custom function")

    expect(result).toContain("export function custom function()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with return value containing spaces", () => {
    const result = generateUtilityFileContents("utility", "Hello World")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with function name containing underscores", () => {
    const result = generateUtilityFileContents("custom_function")

    expect(result).toContain("export function custom_function()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with return value containing underscores", () => {
    const result = generateUtilityFileContents("utility", "Hello_World")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello_World'")
  })

  it("should generate utility file contents with function name containing dashes", () => {
    const result = generateUtilityFileContents("custom-function")

    expect(result).toContain("export function custom-function()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with return value containing dashes", () => {
    const result = generateUtilityFileContents("utility", "Hello-World")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello-World'")
  })

  it("should generate utility file contents with function name containing dots", () => {
    const result = generateUtilityFileContents("custom.function")

    expect(result).toContain("export function custom.function()")
    expect(result).toContain("return 'Hello World'")
  })

  it("should generate utility file contents with return value containing dots", () => {
    const result = generateUtilityFileContents("utility", "Hello.World")

    expect(result).toContain("export function utility()")
    expect(result).toContain("return 'Hello.World'")
  })
})
