/**
 * Direct coverage for the property-schema projection. The views this module
 * builds are load-bearing twice: get_property_schema serves them, and the
 * hard schema gate on set_node_properties uses `buildPropertySchemaView` to
 * decide unknown-key rejections and attaches the views to schema bounces —
 * so every valid top-level key must project, every view must survive JSON,
 * and option lists must respect the cap.
 */
import { describe, expect, it } from "vitest"

import {
  buildPropertySchemaView,
  validTopLevelPropertyKeys,
} from "./property-schema-view"

/** Depth-first check that a value holds no functions (JSON-safe). */
function assertJsonSafe(value: unknown, path = "$"): void {
  if (typeof value === "function") {
    throw new Error(`non-JSON value (function) at ${path}`)
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      assertJsonSafe(child, `${path}.${key}`)
    }
  }
}

describe("validTopLevelPropertyKeys", () => {
  it("lists the universe of keys, including the folded border sides", () => {
    const keys = validTopLevelPropertyKeys()
    expect(keys.length).toBeGreaterThan(0)
    expect(new Set(keys).size).toBe(keys.length)
    for (const side of ["borderTop", "borderRight", "borderBottom", "borderLeft"]) {
      expect(keys).toContain(side)
    }
  })
})

describe("buildPropertySchemaView", () => {
  it("returns null for a key that is not a property", () => {
    expect(buildPropertySchemaView("definitelyNotAPropertyKey")).toBeNull()
  })

  it("builds a view for EVERY valid top-level key (the unknown-key gate's contract)", () => {
    for (const key of validTopLevelPropertyKeys()) {
      const view = buildPropertySchemaView(key)
      expect(view, `expected a view for "${key}"`).not.toBeNull()
      expect(view!.key).toBe(key)
      expect(view!.category).toBeTruthy()
    }
  })

  it("projects compound keys as facets with a selector facet", () => {
    const view = buildPropertySchemaView("border")
    expect(view).not.toBeNull()
    expect(view!.category).toBe("compound")
    expect(Object.keys(view!.facets!).length).toBeGreaterThan(0)
    expect(view!.selectorFacet).toBeTruthy()
    expect(view!.facets![view!.selectorFacet!]).toBeDefined()
  })

  it("resolves flattened border sides with the shared border facet list", () => {
    const side = buildPropertySchemaView("borderTop")
    expect(side).not.toBeNull()
    if (side!.category === "compound") {
      expect(Object.keys(side!.facets!)).toEqual(
        Object.keys(buildPropertySchemaView("border")!.facets!),
      )
    }
  })

  it("projects shorthand keys with their sub-key layout", () => {
    const view = buildPropertySchemaView("padding")
    expect(view).not.toBeNull()
    expect(view!.category).toBe("shorthand")
    expect(view!.subKeys).toEqual(["top", "right", "bottom", "left"])
  })

  it("keeps every view JSON-safe (views are served inside tool results)", () => {
    for (const key of validTopLevelPropertyKeys()) {
      const view = buildPropertySchemaView(key)!
      assertJsonSafe(view, key)
      // Round-trip must lose nothing: what the agent reads is the view.
      expect(JSON.parse(JSON.stringify(view))).toEqual(view)
    }
  })

  it("caps option lists at 100 and reports the uncapped total", () => {
    const atomicViews = validTopLevelPropertyKeys()
      .map((key) => buildPropertySchemaView(key)!)
      .flatMap((view) => [
        ...(view.schema ? [view.schema] : []),
        ...Object.values(view.facets ?? {}),
      ])

    let sawCapped = false
    for (const atomic of atomicViews) {
      if (!atomic.options) continue
      expect(atomic.options.length).toBeLessThanOrEqual(100)
      if (atomic.optionsTotal !== undefined) {
        sawCapped = true
        expect(atomic.options.length).toBe(100)
        expect(atomic.optionsTotal).toBeGreaterThan(100)
      }
    }
    // The catalog-sized lists (icon ids) make at least one cap certain; if
    // this ever fails, the cap has no coverage and needs a synthetic case.
    expect(sawCapped).toBe(true)
  })

  it("derives theme sections from the served theme keys", () => {
    for (const key of validTopLevelPropertyKeys()) {
      const view = buildPropertySchemaView(key)!
      const atomics = [
        ...(view.schema ? [view.schema] : []),
        ...Object.values(view.facets ?? {}),
      ]
      for (const atomic of atomics) {
        if (!atomic.themeKeys) continue
        expect(atomic.themeSections!.length).toBeGreaterThan(0)
        const served = [
          ...(atomic.themeKeys.categorical ?? []),
          ...(atomic.themeKeys.ordinal ?? []),
        ]
        expect(served.length).toBeGreaterThan(0)
      }
    }
  })
})
