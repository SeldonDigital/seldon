import { describe, expect, it } from "bun:test"
import { InvariantError, invariant } from "./invariant"

describe("invariant", () => {
  it("should not throw when condition is truthy", () => {
    const truthyValues = [true, 1, "hello", {}, []]

    truthyValues.forEach((value) => {
      expect(() => {
        invariant(value, "This should not throw")
      }).not.toThrow()
    })
  })

  it("should throw InvariantError when condition is falsy", () => {
    const falsyValues = [false, 0, "", null, undefined]

    falsyValues.forEach((value) => {
      expect(() => {
        invariant(value, "This should throw")
      }).toThrow(InvariantError)
    })
  })

  it("should throw with correct error message and context", () => {
    const testCases = [
      {
        message: "Custom error message",
        context: undefined,
      },
      {
        message: "Error with context",
        context: { userId: 123, action: "delete" },
      },
      {
        message: "Error with empty context",
        context: {},
      },
      {
        message: "Error with mixed context",
        context: {
          string: "hello",
          number: 42,
          boolean: true,
          array: [1, 2, 3],
          object: { nested: "value" },
          null: null,
        },
      },
    ]

    testCases.forEach(({ message, context }) => {
      try {
        invariant(false, message, context)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(InvariantError)
        expect((error as InvariantError).message).toBe(message)
        if (context !== undefined) {
          expect((error as InvariantError).context).toEqual(context)
        } else {
          expect((error as InvariantError).context).toBeUndefined()
        }
      }
    })
  })

  it("should work with type assertions and complex conditions", () => {
    // Type assertion test
    const value: unknown = "hello"
    invariant(typeof value === "string", "Value must be string")
    expect(value.toUpperCase()).toBe("HELLO")

    // Complex condition tests
    const obj = { name: "test", count: 5 }

    expect(() => {
      invariant(
        obj.name && obj.count > 0,
        "Object must have name and positive count",
      )
    }).not.toThrow()

    expect(() => {
      invariant(obj.name && obj.count > 10, "Count must be greater than 10")
    }).toThrow()
  })
})

describe("InvariantError", () => {
  it("should create error instances correctly", () => {
    const testCases = [
      {
        message: "Test message",
        context: undefined,
      },
      {
        message: "Test error message",
        context: { key: "value" },
      },
    ]

    testCases.forEach(({ message, context }) => {
      const error = new InvariantError(message, context)
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(InvariantError)
      expect(error.message).toBe(message)
      if (context !== undefined) {
        expect(error.context).toEqual(context)
      } else {
        expect(error.context).toBeUndefined()
      }
    })
  })

  it("should be throwable and catchable", () => {
    const message = "Test error message"
    const context = { key: "value" }

    try {
      throw new InvariantError(message, context)
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError)
      expect((error as InvariantError).message).toBe(message)
      expect((error as InvariantError).context).toEqual(context)
    }
  })
})
