import { describe, expect, it } from "bun:test"
import { findInObject } from "./find-in-object"

describe("findInObject", () => {
  const testObject = {
    user: {
      name: "John",
      address: {
        street: "123 Main St",
        city: "New York",
      },
      hobbies: ["reading", "gaming"],
    },
    settings: {
      theme: {
        dark: true,
        colors: {
          primary: "#000",
        },
      },
    },
    active: false,
  }

  it.each([
    ["user.name", "John"], // nested string value
    ["user.address.street", "123 Main St"], // deeply nested string value
    ["settings.theme.dark", true], // boolean value
    ["settings.theme.colors.primary", "#000"], // deeply nested object value
    ["active", false], // root level boolean value
    ["user.hobbies", ["reading", "gaming"]], // array value
    ["nonexistent.path", undefined], // non-existent path
    ["user.address.nonexistent", undefined], // non-existent nested property
  ])("should find %s (%s)", (path, expected) => {
    expect(findInObject(testObject, path)).toEqual(expected)
  })
})
