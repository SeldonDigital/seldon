import { describe, expect, it } from "vitest"

import { cleanupRedundantOverrides } from "./cleanup-redundant-overrides"

import type { Properties } from "../../../properties/types/properties"

const props = (value: Record<string, unknown>): Properties => value as unknown as Properties

describe("cleanupRedundantOverrides", () => {
  it("drops an atomic override equal to the baseline", () => {
    const overrides = props({ opacity: { type: "exact", value: 50 } })
    const patch = props({ opacity: { type: "exact", value: 50 } })
    const baseline = props({ opacity: { type: "exact", value: 50 } })

    cleanupRedundantOverrides(overrides, patch, baseline)
    expect(overrides).toEqual({})
  })

  it("keeps an atomic override that differs from the baseline", () => {
    const overrides = props({ opacity: { type: "exact", value: 50 } })
    const patch = props({ opacity: { type: "exact", value: 50 } })
    const baseline = props({ opacity: { type: "exact", value: 75 } })

    cleanupRedundantOverrides(overrides, patch, baseline)
    expect(overrides).toEqual({ opacity: { type: "exact", value: 50 } })
  })

  it("leaves facets that are not part of the patch", () => {
    const overrides = props({
      opacity: { type: "exact", value: 50 },
      color: { type: "exact", value: "#fff" },
    })
    const patch = props({ opacity: { type: "exact", value: 50 } })
    const baseline = props({ opacity: { type: "exact", value: 50 } })

    cleanupRedundantOverrides(overrides, patch, baseline)
    expect(overrides).toEqual({ color: { type: "exact", value: "#fff" } })
  })

  it("cleans up one compound sub-facet and keeps its siblings", () => {
    const overrides = props({
      border: {
        color: { type: "exact", value: "#000" },
        width: { type: "exact", value: 2 },
      },
    })
    const patch = props({ border: { color: { type: "exact", value: "#000" } } })
    const baseline = props({
      border: { color: { type: "exact", value: "#000" } },
    })

    cleanupRedundantOverrides(overrides, patch, baseline)
    expect(overrides).toEqual({
      border: { width: { type: "exact", value: 2 } },
    })
  })
})
