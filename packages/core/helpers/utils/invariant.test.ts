import { describe, expect, it } from "vitest"

import { assertNever } from "./assert-never"
import { InvariantError, invariant } from "./invariant"

describe("invariant", () => {
  it("does not throw for a truthy condition", () => {
    expect(() => invariant(1, "should not throw")).not.toThrow()
  })

  it("throws an InvariantError carrying context for a falsy condition", () => {
    try {
      invariant(false, "boom", { id: "abc" })
      throw new Error("expected invariant to throw")
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantError)
      expect((error as InvariantError).message).toBe("boom")
      expect((error as InvariantError).context).toEqual({ id: "abc" })
    }
  })
})

describe("assertNever", () => {
  it("always throws", () => {
    expect(() => assertNever("unexpected" as never)).toThrow()
  })
})
