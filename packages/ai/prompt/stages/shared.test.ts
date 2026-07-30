import { describe, expect, it } from "vitest"

import { historyBlock } from "./shared"

describe("historyBlock", () => {
  it("renders role-prefixed lines and is empty without history", () => {
    expect(historyBlock()).toBe("")
    expect(historyBlock([])).toBe("")
    const block = historyBlock([
      { role: "user", content: "make it red" },
      { role: "assistant", content: "Done." },
    ])
    expect(block).toContain("user: make it red")
    expect(block).toContain("assistant: Done.")
  })
})
