import { describe, expect, it } from "vitest"

import { modulate } from "./modulate"

describe("modulate", () => {
  it("returns the base size when step is 0", () => {
    expect(modulate({ step: 0, size: 16 })).toBe(16)
    expect(modulate({ step: 0 })).toBe(1)
  })

  it("scales by ratio to the power of step and rounds by default", () => {
    expect(modulate({ step: 1, ratio: 1.25, size: 16 })).toBe(20)
    expect(modulate({ step: 2, ratio: 2, size: 10 })).toBe(40)
  })

  it("skips rounding when round is false", () => {
    expect(modulate({ step: 3, ratio: 1.25, size: 1 }, { round: false })).toBe(
      1.25 ** 3,
    )
  })

  it("uses the default ratio when omitted", () => {
    expect(modulate({ step: 1, size: 1 })).toBe(1.25)
  })
})
