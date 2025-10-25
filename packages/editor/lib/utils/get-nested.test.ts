import { expect, it } from "bun:test"
import { getNested } from "./get-nested"

it("should get nested value", () => {
  const obj = {
    a: {
      b: {
        c: 1,
      },
    },
  }

  expect(getNested<number>(obj, "a.b.c")).toEqual(1)
})

it("should throw error if path is not found", () => {
  const obj = {
    a: {
      b: {
        c: 1,
      },
    },
  }
  try {
    getNested(obj, "a.b.d")
  } catch (error) {
    expect(error).toEqual(new Error("No property found at path: a.b.d"))
  }
})
