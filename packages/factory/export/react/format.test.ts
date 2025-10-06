import { describe, expect, it } from "bun:test"
import { format } from "./format"

describe("format", () => {
  it("should format TypeScript content using prettier", async () => {
    const tsContent = "export function test() { return 'hello'; }"
    const result = await format(tsContent)

    // Should format the TypeScript content properly
    expect(result).toContain("export function test()")
    expect(result).toContain('return "hello"')
    expect(result).toMatch(
      /export\s+function\s+test\(\)\s*\{\s*return\s+"hello"\s*\}/,
    )
  })

  it("should handle empty TypeScript content", async () => {
    const result = await format("")

    expect(result).toBe("")
  })

  it("should handle TypeScript with multiple functions", async () => {
    const tsContent = `
      export function test1() { return 'hello'; }
      export function test2() { return 'world'; }
    `
    const result = await format(tsContent)

    expect(result).toContain("export function test1()")
    expect(result).toContain("export function test2()")
    expect(result).toContain('return "hello"')
    expect(result).toContain('return "world"')
  })

  it("should handle TypeScript with interfaces", async () => {
    const tsContent = `
      interface TestProps {
        name: string;
        age: number;
      }
      export function Test(props: TestProps) { return <div>{props.name}</div>; }
    `
    const result = await format(tsContent)

    expect(result).toContain("interface TestProps")
    expect(result).toContain("name: string")
    expect(result).toContain("age: number")
    expect(result).toContain("export function Test")
  })

  it("should handle TypeScript with imports", async () => {
    const tsContent = `
      import React from 'react';
      import { Component } from './Component';
      export function Test() { return <Component />; }
    `
    const result = await format(tsContent)

    expect(result).toContain('import React from "react"')
    expect(result).toContain('import { Component } from "./Component"')
    expect(result).toContain("export function Test()")
  })

  it("should handle TypeScript with JSX", async () => {
    const tsContent = `
      export function Test() {
        return (
          <div>
            <h1>Hello World</h1>
            <p>This is a test</p>
          </div>
        );
      }
    `
    const result = await format(tsContent)

    expect(result).toContain("export function Test()")
    expect(result).toContain("<div>")
    expect(result).toContain("<h1>Hello World</h1>")
    expect(result).toContain("<p>This is a test</p>")
  })

  it("should handle malformed TypeScript gracefully", async () => {
    const tsContent = "export function test() { return 'hello'" // Missing closing brace

    // Prettier should throw an error for malformed code
    await expect(format(tsContent)).rejects.toThrow()
  })

  it("should use TypeScript parser specifically", async () => {
    const tsContent = "export function test() { return 'hello'; }"
    const result = await format(tsContent)

    // Should format as TypeScript
    expect(result).toContain("export function test()")
  })

  it("should return a promise", () => {
    const tsContent = "export function test() { return 'hello'; }"
    const result = format(tsContent)

    expect(result).toBeInstanceOf(Promise)
  })

  it("should handle very long TypeScript content", async () => {
    const tsContent = Array(100)
      .fill(0)
      .map((_, i) => `export function test${i}() { return 'hello'; }`)
      .join("\n")
    const result = await format(tsContent)

    expect(result).toContain("export function test0()")
    expect(result).toContain("export function test99()")
    expect(result.length).toBeGreaterThan(tsContent.length)
  })

  it("should handle TypeScript with comments", async () => {
    const tsContent = `
      // This is a comment
      export function test() { 
        /* This is a block comment */
        return 'hello'; 
      }
    `
    const result = await format(tsContent)

    expect(result).toContain("// This is a comment")
    expect(result).toContain("export function test()")
  })

  it("should handle TypeScript with generics", async () => {
    const tsContent = `
      export function test<T>(value: T): T {
        return value;
      }
    `
    const result = await format(tsContent)

    expect(result).toContain("export function test<T>")
    expect(result).toContain("value: T")
    expect(result).toContain("return value")
  })
})
