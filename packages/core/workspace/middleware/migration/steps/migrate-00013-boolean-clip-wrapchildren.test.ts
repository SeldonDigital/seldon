import { describe, expect, it } from "vitest"

import type { Workspace } from "../../../model/workspace"
import { migrateV13BooleanClipWrapChildren } from "./migrate-00013-boolean-clip-wrapchildren"

function makeWorkspace(): Workspace {
  return {
    boards: {
      "board-1": {
        componentProperties: {
          clip: { type: "empty", value: null },
        },
      },
    },
    nodes: {
      "node-1": {
        overrides: {
          clip: { type: "inherit", value: null },
          wrapChildren: { type: "empty", value: null },
        },
        states: {
          hover: {
            wrapChildren: { type: "inherit", value: null },
          },
        },
      },
      "node-2": {
        overrides: {
          clip: { type: "exact", value: true },
        },
      },
    },
  } as unknown as Workspace
}

describe("migrateV13BooleanClipWrapChildren", () => {
  it("rewrites empty and inherit clip/wrapChildren cells to exact false", () => {
    const migrated = migrateV13BooleanClipWrapChildren(makeWorkspace())

    const board = migrated.boards["board-1"] as unknown as {
      componentProperties: Record<string, unknown>
    }
    expect(board.componentProperties.clip).toEqual({
      type: "exact",
      value: false,
    })

    const node = migrated.nodes["node-1"] as unknown as {
      overrides: Record<string, unknown>
      states: Record<string, Record<string, unknown>>
    }
    expect(node.overrides.clip).toEqual({ type: "exact", value: false })
    expect(node.overrides.wrapChildren).toEqual({ type: "exact", value: false })
    expect(node.states.hover.wrapChildren).toEqual({
      type: "exact",
      value: false,
    })
  })

  it("leaves explicit boolean values untouched", () => {
    const migrated = migrateV13BooleanClipWrapChildren(makeWorkspace())
    const node = migrated.nodes["node-2"] as unknown as {
      overrides: Record<string, unknown>
    }
    expect(node.overrides.clip).toEqual({ type: "exact", value: true })
  })

  it("returns the same reference when nothing needs rewriting", () => {
    const clean = {
      boards: {},
      nodes: {
        "node-1": { overrides: { clip: { type: "exact", value: false } } },
      },
    } as unknown as Workspace
    expect(migrateV13BooleanClipWrapChildren(clean)).toBe(clean)
  })
})
