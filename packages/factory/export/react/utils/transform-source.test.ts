import { describe, expect, it } from "vitest"

import { TransformStrategy, transformSource } from "./transform-source"

describe("transformSource", () => {
  it("appends content after the source", () => {
    expect(
      transformSource({
        strategy: TransformStrategy.APPEND,
        source: "a",
        content: "b",
      }),
    ).toBe("a\nb")
  })

  it("prepends content before the source", () => {
    expect(
      transformSource({
        strategy: TransformStrategy.PREPEND,
        source: "a",
        content: "b",
      }),
    ).toBe("b\na")
  })

  it("throws for an unknown strategy", () => {
    expect(() =>
      transformSource({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        strategy: "MERGE" as any,
        source: "a",
        content: "b",
      }),
    ).toThrow(/Unknown transformation config/)
  })
})
