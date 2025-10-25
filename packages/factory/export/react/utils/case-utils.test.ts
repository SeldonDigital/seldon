import { describe, expect, it } from "bun:test"
import { camelCase, kebabCase, pascalCase } from "./case-utils"

describe("case-utils", () => {
  describe("pascalCase", () => {
    it("should convert simple string to PascalCase", () => {
      expect(pascalCase("hello")).toBe("Hello")
      expect(pascalCase("world")).toBe("World")
    })

    it("should convert camelCase to PascalCase", () => {
      expect(pascalCase("helloWorld")).toBe("HelloWorld")
      expect(pascalCase("myComponent")).toBe("MyComponent")
    })

    it("should convert kebab-case to PascalCase", () => {
      expect(pascalCase("hello-world")).toBe("HelloWorld")
      expect(pascalCase("my-component")).toBe("MyComponent")
    })

    it("should convert snake_case to PascalCase", () => {
      expect(pascalCase("hello_world")).toBe("HelloWorld")
      expect(pascalCase("my_component")).toBe("MyComponent")
    })

    it("should handle mixed case with numbers", () => {
      expect(pascalCase("button1")).toBe("Button_1")
      expect(pascalCase("icon2")).toBe("Icon_2")
      expect(pascalCase("component3")).toBe("Component_3")
    })

    it("should handle special characters", () => {
      expect(pascalCase("hello@world")).toBe("HelloWorld")
      expect(pascalCase("my#component")).toBe("MyComponent")
      expect(pascalCase("test$value")).toBe("TestValue")
    })

    it("should handle multiple spaces", () => {
      expect(pascalCase("hello   world")).toBe("HelloWorld")
      expect(pascalCase("my    component")).toBe("MyComponent")
    })

    it("should handle empty string", () => {
      expect(pascalCase("")).toBe("")
    })

    it("should handle single character", () => {
      expect(pascalCase("a")).toBe("A")
      expect(pascalCase("Z")).toBe("Z")
    })

    it("should handle numbers at beginning", () => {
      expect(pascalCase("1test")).toBe("1test")
      expect(pascalCase("2component")).toBe("2component")
    })
  })

  describe("camelCase", () => {
    it("should convert simple string to camelCase", () => {
      expect(camelCase("hello")).toBe("hello")
      expect(camelCase("world")).toBe("world")
    })

    it("should convert PascalCase to camelCase", () => {
      expect(camelCase("HelloWorld")).toBe("helloWorld")
      expect(camelCase("MyComponent")).toBe("myComponent")
    })

    it("should convert kebab-case to camelCase", () => {
      expect(camelCase("hello-world")).toBe("helloWorld")
      expect(camelCase("my-component")).toBe("myComponent")
    })

    it("should convert snake_case to camelCase", () => {
      expect(camelCase("hello_world")).toBe("helloWorld")
      expect(camelCase("my_component")).toBe("myComponent")
    })

    it("should handle mixed case with numbers", () => {
      expect(camelCase("button1")).toBe("button_1")
      expect(camelCase("icon2")).toBe("icon_2")
      expect(camelCase("component3")).toBe("component_3")
    })

    it("should handle special characters", () => {
      expect(camelCase("hello@world")).toBe("helloWorld")
      expect(camelCase("my#component")).toBe("myComponent")
      expect(camelCase("test$value")).toBe("testValue")
    })

    it("should handle empty string", () => {
      expect(camelCase("")).toBe("")
    })

    it("should handle single character", () => {
      expect(camelCase("a")).toBe("a")
      expect(camelCase("Z")).toBe("z")
    })
  })

  describe("kebabCase", () => {
    it("should convert simple string to kebab-case", () => {
      expect(kebabCase("hello")).toBe("hello")
      expect(kebabCase("world")).toBe("world")
    })

    it("should convert camelCase to kebab-case", () => {
      expect(kebabCase("helloWorld")).toBe("hello-world")
      expect(kebabCase("myComponent")).toBe("my-component")
    })

    it("should convert PascalCase to kebab-case", () => {
      expect(kebabCase("HelloWorld")).toBe("hello-world")
      expect(kebabCase("MyComponent")).toBe("my-component")
    })

    it("should convert snake_case to kebab-case", () => {
      expect(kebabCase("hello_world")).toBe("helloworld")
      expect(kebabCase("my_component")).toBe("mycomponent")
    })

    it("should handle mixed case with numbers", () => {
      expect(kebabCase("button1")).toBe("button1")
      expect(kebabCase("icon2")).toBe("icon2")
      expect(kebabCase("component3")).toBe("component3")
    })

    it("should handle special characters", () => {
      expect(kebabCase("hello@world")).toBe("helloworld")
      expect(kebabCase("my#component")).toBe("mycomponent")
      expect(kebabCase("test$value")).toBe("testvalue")
    })

    it("should handle multiple spaces", () => {
      expect(kebabCase("hello   world")).toBe("hello-world")
      expect(kebabCase("my    component")).toBe("my-component")
    })

    it("should handle empty string", () => {
      expect(kebabCase("")).toBe("")
    })

    it("should handle single character", () => {
      expect(kebabCase("a")).toBe("a")
      expect(kebabCase("Z")).toBe("z")
    })

    it("should handle numbers at beginning", () => {
      expect(kebabCase("1test")).toBe("1test")
      expect(kebabCase("2component")).toBe("2component")
    })
  })
})
