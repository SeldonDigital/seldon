import { describe, expect, it } from "vitest"

import { format } from "./format"

describe("format", () => {
  it("returns the content unchanged when skipFormat is set", async () => {
    const input = "const   x=1"
    expect(await format(input, { skipFormat: true })).toBe(input)
  })

  it("formats TypeScript and drops semicolons", async () => {
    const result = await format("const x = 1;")
    expect(result).toBe("const x = 1\n")
  })

  it("sorts and separates imports", async () => {
    const result = await format(
      `import {b} from "./b";import {a} from "./a";const x=1`,
    )
    expect(result).toContain("import { a }")
    expect(result).toContain("import { b }")
    expect(result.indexOf("./a")).toBeLessThan(result.indexOf("./b"))
  })
})
