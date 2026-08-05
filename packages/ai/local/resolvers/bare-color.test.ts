import { ComponentId } from "@seldon/core/components/constants"
import type { Workspace } from "@seldon/core/workspace/types"
import { describe, expect, it } from "vitest"

import { defaultColorKeyFor, overriddenColorKeys } from "./bare-color"

describe("defaultColorKeyFor", () => {
  it("sends a component that carries its own content to its letter color", () => {
    expect(defaultColorKeyFor(ComponentId.TEXT)).toEqual({
      bucket: "letters",
      key: "color",
    })
    expect(defaultColorKeyFor(ComponentId.LIST_ITEM)).toEqual({
      bucket: "letters",
      key: "color",
    })
  })

  it("sends a component whose letters live on children to its surface", () => {
    // A chip's visible fill is its own background; its label is a child, so
    // the chip itself carries no content and must not take the letter color
    // (the original live failure wrote the invisible foreground).
    expect(defaultColorKeyFor(ComponentId.CHIP)).toEqual({
      bucket: "surface",
      key: "background.0.color",
    })
    expect(defaultColorKeyFor(ComponentId.BUTTON)).toEqual({
      bucket: "surface",
      key: "background.0.color",
    })
  })

  it("sends an icon to the glyph color its schema computes, not the unrendered background", () => {
    // Icon ships `background.0.kind: none` -- writing that background is
    // legal but paints nothing. Its `color` default is the computed contrast
    // function, the schema's way of saying the glyph is drawn with `color`.
    expect(defaultColorKeyFor(ComponentId.ICON)).toEqual({
      bucket: "glyph",
      key: "color",
    })
  })

  it("never lands on a gradient stop", () => {
    const resolutionsAcrossBuckets = [
      defaultColorKeyFor(ComponentId.TEXT),
      defaultColorKeyFor(ComponentId.CHIP),
    ]
    for (const resolution of resolutionsAcrossBuckets) {
      const pickedKey = "key" in resolution ? resolution.key : undefined
      expect(pickedKey).not.toContain("gradientStopColor")
    }
  })
})

/** A minimal workspace: one chip-shaped node with the given override bag. */
function workspaceWith(overrides: Record<string, unknown>): Workspace {
  return {
    nodes: {
      "node-1": { id: "node-1", template: "catalog.chip", overrides },
    },
    boards: {},
  } as never
}

describe("overriddenColorKeys", () => {
  it("finds the layered color the set pipeline wrote", () => {
    const workspace = workspaceWith({
      background: [{ color: { type: "exact", value: "#0000ff" } }],
    })
    expect(
      overriddenColorKeys(workspace, "node-1", ComponentId.CHIP),
    ).toEqual(["background.0.color"])
  })

  it("ignores non-color overrides and empty-tagged slots", () => {
    const workspace = workspaceWith({
      width: { type: "option", value: "fill" },
      color: { type: "empty", value: null },
    })
    expect(overriddenColorKeys(workspace, "node-1", ComponentId.CHIP)).toEqual(
      [],
    )
  })

  it("returns every color key the node actually carries", () => {
    const workspace = workspaceWith({
      color: { type: "exact", value: "#ff0000" },
      border: { color: { type: "exact", value: "#00ff00" } },
    })
    expect(
      overriddenColorKeys(workspace, "node-1", ComponentId.CHIP),
    ).toEqual(expect.arrayContaining(["color", "border.color"]))
  })
})
