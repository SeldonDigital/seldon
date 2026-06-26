import { describe, expect, it } from "vitest"

import type { EntryNode } from "../../types"
import { getNextVariantLabel } from "./get-next-variant-label"
import { isDefaultVariant } from "./is-default-variant"
import { isUserVariant } from "./is-user-variant"

describe("getNextVariantLabel", () => {
  it("starts at zero-padded 01", () => {
    expect(getNextVariantLabel("Base", new Set())).toBe("Base 01")
  })

  it("skips taken labels", () => {
    expect(getNextVariantLabel("Base", new Set(["Base 01", "Base 02"]))).toBe(
      "Base 03",
    )
  })

  it("drops padding past nine", () => {
    const taken = new Set(Array.from({ length: 9 }, (_, i) => `Base 0${i + 1}`))
    expect(getNextVariantLabel("Base", taken)).toBe("Base 10")
  })
})

describe("variant type guards", () => {
  const node = (type: string) => ({ id: "n", type }) as unknown as EntryNode

  it("isDefaultVariant matches only default entries", () => {
    expect(isDefaultVariant(node("default"))).toBe(true)
    expect(isDefaultVariant(node("variant"))).toBe(false)
    expect(isDefaultVariant(node("instance"))).toBe(false)
  })

  it("isUserVariant matches only variant entries", () => {
    expect(isUserVariant(node("variant"))).toBe(true)
    expect(isUserVariant(node("default"))).toBe(false)
    expect(isUserVariant(node("instance"))).toBe(false)
  })
})
