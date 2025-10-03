import { describe, expect, it } from "bun:test"
import { moveItemInArray } from "./move-utils"

describe("moveItemInArray", () => {
  it("should move item to a lower index", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "c", 1)
    expect(array).toEqual(["a", "c", "b", "d", "e"])
  })

  it("should move item to a higher index", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "b", 3)
    expect(array).toEqual(["a", "c", "d", "b", "e"])
  })

  it("should move item to the beginning", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "e", 0)
    expect(array).toEqual(["e", "a", "b", "c", "d"])
  })

  it("should move item to the end", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "a", 4)
    expect(array).toEqual(["b", "c", "d", "e", "a"])
  })

  it("should not change array when moving to same position", () => {
    const array = ["a", "b", "c", "d", "e"]
    const originalArray = [...array]
    moveItemInArray(array, "c", 2)
    expect(array).toEqual(originalArray)
  })

  it("should handle moving to index beyond array length", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "a", 10)
    expect(array).toEqual(["b", "c", "d", "e", "a"])
  })

  it("should handle moving to negative index", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "e", -1)
    expect(array).toEqual(["a", "b", "c", "e", "d"])
  })

  it("should handle empty array", () => {
    const array: string[] = []
    moveItemInArray(array, "item", 0)
    expect(array).toEqual(["item"])
  })

  it("should handle array with single item", () => {
    const array = ["a"]
    moveItemInArray(array, "a", 0)
    expect(array).toEqual(["a"])
  })

  it("should handle array with duplicate items", () => {
    const array = ["a", "b", "a", "c", "b"]
    moveItemInArray(array, "a", 2)
    expect(array).toEqual(["b", "a", "a", "c", "b"])
  })

  it("should handle moving non-existent item", () => {
    const array = ["a", "b", "c", "d", "e"]
    moveItemInArray(array, "z", 2)
    expect(array).toEqual(["a", "b", "z", "c", "d"])
  })

  it("should work with different data types", () => {
    const numbers = [1, 2, 3, 4, 5]
    moveItemInArray(numbers, 3, 1)
    expect(numbers).toEqual([1, 3, 2, 4, 5])

    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const targetObject = { id: 2 }
    moveItemInArray(objects, targetObject, 0)
    expect(objects).toEqual([{ id: 2 }, { id: 1 }, { id: 2 }])
  })

  it("should maintain array reference", () => {
    const array = ["a", "b", "c", "d", "e"]
    const originalReference = array
    moveItemInArray(array, "c", 1)
    expect(array).toBe(originalReference)
  })
})
