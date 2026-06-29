import { describe, expect, it } from "vitest"

import { camelCase, kebabCase, pascalCase } from "./case-utils"

describe("pascalCase", () => {
  it("converts space-separated words", () => {
    expect(pascalCase("hello world")).toBe("HelloWorld")
  })

  it("splits camelCase input on case boundaries", () => {
    expect(pascalCase("listItemTreeSection")).toBe("ListItemTreeSection")
  })

  it("treats special characters as separators", () => {
    expect(pascalCase("button-iconic")).toBe("ButtonIconic")
  })

  it("inserts an underscore between a letter and a number", () => {
    expect(pascalCase("heading1")).toBe("Heading_1")
  })

  it("splits on underscores", () => {
    expect(pascalCase("foo_bar")).toBe("FooBar")
  })
})

describe("camelCase", () => {
  it("lowercases the first character of the PascalCase form", () => {
    expect(camelCase("hello world")).toBe("helloWorld")
  })

  it("converts kebab input", () => {
    expect(camelCase("button-iconic")).toBe("buttonIconic")
  })
})

describe("kebabCase", () => {
  it("converts camelCase to kebab-case", () => {
    expect(kebabCase("backgroundColor")).toBe("background-color")
  })

  it("lowercases space-separated words", () => {
    expect(kebabCase("Hello World")).toBe("hello-world")
  })

  it("strips special characters that are not dashes", () => {
    expect(kebabCase("Button (Iconic)")).toBe("button-iconic")
  })

  it("collapses repeated dashes and spaces", () => {
    expect(kebabCase("foo  --  bar")).toBe("foo-bar")
  })
})
