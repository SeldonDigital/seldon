import { describe, expect, it } from "vitest"

import { assembleLayeredWrites } from "./layered-paint"

/**
 * A minimal workspace with one node whose effective background comes entirely
 * from the overrides passed in. The Text catalog default (`kind: none`) is what
 * a node with no overrides resolves to, so `overrides: {}` models the repro
 * case: writing a color into a layer that renders nothing.
 */
function workspaceWith(overrides: Record<string, unknown>) {
  return {
    nodes: {
      "node-1": {
        id: "node-1",
        template: "catalog.text",
        overrides,
      },
    },
    boards: {},
  } as never
}

const OPTION = (value: string) => ({ type: "option", value })

describe("assembleLayeredWrites", () => {
  it("passes non-layered keys through unchanged", () => {
    const properties = { content: "Actions", "border.color": "red" }
    const result = assembleLayeredWrites(
      workspaceWith({}),
      "node-1",
      properties,
    )
    expect(result).toEqual(properties)
  })

  it("retypes a none layer to a color layer when a color facet is written", () => {
    const result = assembleLayeredWrites(workspaceWith({}), "node-1", {
      "background.0.color": "@swatch.primary",
    })
    const layers = result.background as Record<string, unknown>[]
    expect(layers).toHaveLength(1)
    expect(layers[0]!.kind).toEqual(OPTION("color"))
    expect(layers[0]!.color).toBe("@swatch.primary")
    // The seed's companions came along, so the layer is complete.
    expect(layers[0]!.opacity).toBeDefined()
  })

  it("keeps the existing kind when the facet already fits it", () => {
    const result = assembleLayeredWrites(
      workspaceWith({
        background: [{ kind: OPTION("color"), color: OPTION("blue") }],
      }),
      "node-1",
      { "background.0.color": "yellow" },
    )
    const layers = result.background as Record<string, unknown>[]
    expect(layers).toHaveLength(1)
    // No kind write: the merge keeps the layer's own kind and other facets.
    expect(layers[0]).toEqual({ color: "yellow" })
  })

  it("pads untouched trailing layers with empty bags so the merge keeps them", () => {
    const result = assembleLayeredWrites(
      workspaceWith({
        background: [
          { kind: OPTION("color"), color: OPTION("blue") },
          { kind: OPTION("image"), image: { type: "exact", value: "x.jpg" } },
        ],
      }),
      "node-1",
      { "background.0.color": "yellow" },
    )
    const layers = result.background as Record<string, unknown>[]
    expect(layers).toHaveLength(2)
    expect(layers[0]).toEqual({ color: "yellow" })
    expect(layers[1]).toEqual({})
  })

  it("retypes toward a gradient when a gradient-only facet is written", () => {
    const result = assembleLayeredWrites(workspaceWith({}), "node-1", {
      "background.0.angle": 45,
    })
    const layers = result.background as Record<string, unknown>[]
    expect(layers[0]!.kind).toEqual(OPTION("linearGradient"))
    expect(layers[0]!.angle).toBe(45)
  })

  it("handles shadow layers without any kind logic", () => {
    const result = assembleLayeredWrites(
      workspaceWith({ shadow: [{ blur: OPTION("s") }, { blur: OPTION("m") }] }),
      "node-1",
      { "shadow.1.color": "black" },
    )
    const layers = result.shadow as Record<string, unknown>[]
    expect(layers).toHaveLength(2)
    expect(layers[0]).toEqual({})
    expect(layers[1]).toEqual({ color: "black" })
    expect(layers[1]!.kind).toBeUndefined()
  })
})
