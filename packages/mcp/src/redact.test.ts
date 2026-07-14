import { describe, expect, it } from "vitest"

import { redactValue } from "./redact"

describe("redactValue", () => {
  it("strips credentials and __editor at any depth", () => {
    const input = {
      boards: {
        icons: {
          type: "icon-set",
          label: "Icons",
          credentials: { token: "Bearer super-secret" },
          __editor: { zoom: 2 },
          variants: [{ id: "icon-1" }],
        },
      },
      nodes: [
        {
          id: "n1",
          __editor: { selected: true },
          overrides: { opacity: { type: "exact", value: 50 } },
        },
      ],
    }

    const redacted = redactValue(input)
    const text = JSON.stringify(redacted)

    expect(text).not.toContain("credentials")
    expect(text).not.toContain("__editor")
    expect(text).not.toContain("super-secret")
    expect(redacted.boards.icons.label).toBe("Icons")
    expect(redacted.boards.icons.variants).toEqual([{ id: "icon-1" }])
    expect(redacted.nodes[0]!.overrides.opacity.value).toBe(50)
  })

  it("passes primitives and null through untouched", () => {
    expect(redactValue(null)).toBeNull()
    expect(redactValue(42)).toBe(42)
    expect(redactValue("credentials")).toBe("credentials")
    expect(redactValue(false)).toBe(false)
  })

  it("does not share references with the input", () => {
    const input = { a: { b: [1, 2, 3] } }
    const redacted = redactValue(input)
    expect(redacted).not.toBe(input)
    expect(redacted.a).not.toBe(input.a)
    expect(redacted.a.b).not.toBe(input.a.b)
    expect(redacted).toEqual(input)
  })
})
