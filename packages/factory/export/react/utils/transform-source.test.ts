import { expect, test } from "bun:test"
import { TransformStrategy, transformSource } from "./transform-source"

test("APPEND - should append content to source", () => {
  const source = "line1"
  const result = transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content: "line2",
  })
  expect(result).toBe("line1\nline2")
})

test("PREPEND - should prepend content to source", () => {
  const source = "line1"
  const result = transformSource({
    strategy: TransformStrategy.PREPEND,
    source,
    content: "line2",
  })
  expect(result).toBe("line2\nline1")
})

test("should throw error for unknown strategy", () => {
  expect(() =>
    transformSource({
      strategy: "UNKNOWN" as TransformStrategy,
      source: "test",
      content: "test",
    }),
  ).toThrow("Unknown transformation config")
})
