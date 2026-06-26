import { describe, expect, it } from "vitest"

import type { EntryNode } from "../../model/entry-node"
import {
  orderEntryNodeKeys,
  orderWorkspaceNodeKeys,
} from "./order-entry-node-keys"

const node = (overrides: Record<string, unknown>): EntryNode =>
  overrides as unknown as EntryNode

describe("orderEntryNodeKeys", () => {
  it("emits canonical key order, skips unset keys, and keeps extras", () => {
    const ordered = orderEntryNodeKeys(
      node({
        overrides: {},
        id: "n1",
        type: "instance",
        template: "catalog:button",
        label: "L",
        level: "element",
        theme: null,
        extra: "kept",
      }),
    )

    expect(Object.keys(ordered)).toEqual([
      "id",
      "type",
      "level",
      "label",
      "theme",
      "template",
      "overrides",
      "extra",
    ])
  })
})

describe("orderWorkspaceNodeKeys", () => {
  it("reorders node entries and leaves other maps in place", () => {
    const themes = {}
    const workspace = {
      metadata: { version: 0, label: "" },
      boards: {},
      playgrounds: {},
      nodes: {
        n1: node({
          overrides: {},
          id: "n1",
          type: "default",
          template: "catalog:button",
          label: "L",
          level: "element",
          theme: null,
        }),
      },
      themes,
      "font-collections": {},
      "icon-sets": {},
      media: {},
    } as never

    const result = orderWorkspaceNodeKeys(workspace)
    expect(Object.keys(result.nodes.n1).slice(0, 2)).toEqual(["id", "type"])
    expect(result.themes).toBe(themes)
  })
})
