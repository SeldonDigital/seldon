/**
 * Checkpoint behavioral suite: create/list/restore semantics, the 20-deep
 * FIFO cap, restore through the disk-hash conflict check, workspace_info
 * wiring, and the cross-file guard (checkpoints never restore into a
 * different file). The full checkpoint-recovery journey lives in
 * ../transcripts.test.ts.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { ValueType } from "@seldon/core/properties/constants"

import { ToolError } from "../errors"
import { CHECKPOINT_CAP, Session, hashBytes } from "../session"
import { applyActions } from "./apply-actions"
import { checkpoint } from "./checkpoint"
import type { ToolContext } from "./context"
import { getPropertySchema } from "./get-property-schema"
import { workspaceInfo } from "./workspace-info"
import { workspaceOpen } from "./workspace-open"

const tmpDirs: string[] = []

function makeCtx(): { ctx: ToolContext; root: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-checkpoint-"))
  tmpDirs.push(root)
  return { ctx: { session: new Session(), config: { roots: [root] } }, root }
}

afterEach(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

async function openWithButton() {
  const { ctx, root } = makeCtx()
  const wsPath = path.join(root, "workspace.json")
  workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
  await applyActions(ctx, {
    actions: [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
    ],
  })
  return { ctx, root, wsPath }
}

function opacityAction(nodeId: string, value: number) {
  return {
    type: "set_node_properties",
    payload: {
      nodeId,
      properties: { opacity: { type: ValueType.EXACT, value } },
    },
  }
}

function teachingOf(fn: () => unknown) {
  try {
    fn()
  } catch (error) {
    if (error instanceof ToolError) return error.teaching
    throw error
  }
  throw new Error("expected a ToolError")
}

describe("checkpoint — create and list", () => {
  it("requires an open workspace", async () => {
    const { ctx } = makeCtx()
    const teaching = teachingOf(() => checkpoint(ctx, { op: "list" }))
    expect(teaching.code).toBe("no_workspace_open")
  })

  it("creates ids, labels, and timestamps, and lists them oldest first", async () => {
    const { ctx } = await openWithButton()

    const first = checkpoint(ctx, { op: "create", label: "before experiment" })
    expect(first.checkpoint).toMatchObject({
      id: "cp-1",
      label: "before experiment",
    })
    expect(Date.parse(first.checkpoint!.createdAt)).not.toBeNaN()

    const second = checkpoint(ctx, { op: "create" })
    expect(second.checkpoint!.id).toBe("cp-2")
    expect(second.checkpoint!.label).toBeUndefined()

    const listing = checkpoint(ctx, { op: "list" })
    expect(listing.checkpoints!.map((entry) => entry.id)).toEqual([
      "cp-1",
      "cp-2",
    ])
    expect(listing.cap).toBe(CHECKPOINT_CAP)

    // workspace_info serves the same list (its description promises it).
    expect(workspaceInfo(ctx).checkpoints.map((entry) => entry.id)).toEqual([
      "cp-1",
      "cp-2",
    ])
  })

  it("caps at 20 with FIFO eviction, reporting the evicted id", async () => {
    const { ctx } = await openWithButton()
    for (let i = 0; i < CHECKPOINT_CAP; i++) {
      expect(checkpoint(ctx, { op: "create" }).evictedId).toBeUndefined()
    }

    const overflow = checkpoint(ctx, { op: "create" })
    expect(overflow.evictedId).toBe("cp-1")

    const listing = checkpoint(ctx, { op: "list" })
    expect(listing.checkpoints).toHaveLength(CHECKPOINT_CAP)
    expect(listing.checkpoints![0]!.id).toBe("cp-2")
    expect(listing.checkpoints!.at(-1)!.id).toBe(`cp-${CHECKPOINT_CAP + 1}`)
  })
})

describe("checkpoint — restore", () => {
  it("swaps the session workspace AND persists it; the file is hash-identical", async () => {
    const { ctx, wsPath } = await openWithButton()
    const hashAtCheckpoint = hashBytes(fs.readFileSync(wsPath, "utf8"))
    const { checkpoint: created } = checkpoint(ctx, {
      op: "create",
      label: "safe point",
    })

    // Destructive experiment: duplicating a variant adds a whole subtree.
    const variantId = `component-${ComponentId.BUTTON}-default`
    const { receipt } = await applyActions(ctx, {
      actions: [{ type: "duplicate_node", payload: { nodeId: variantId } }],
    })
    expect(receipt.summary.nodes.added).toBeGreaterThan(0)
    expect(hashBytes(fs.readFileSync(wsPath, "utf8"))).not.toBe(
      hashAtCheckpoint,
    )

    const restored = checkpoint(ctx, { op: "restore", id: created!.id })
    expect(restored.checkpoint!.id).toBe(created!.id)
    expect(restored.persistedTo).toBe(wsPath)
    expect(hashBytes(fs.readFileSync(wsPath, "utf8"))).toBe(hashAtCheckpoint)

    // The session workspace swapped too — none of the experiment's nodes
    // survive in memory, so the next batch starts from the restored state.
    const sessionNodes = ctx.session.open!.workspace.nodes
    for (const id of receipt.createdIds.nodes) {
      expect(sessionNodes[id]).toBeUndefined()
    }
  })

  it("teaches on unknown or missing ids, attaching the list", async () => {
    const { ctx } = await openWithButton()
    checkpoint(ctx, { op: "create" })

    const unknown = teachingOf(() =>
      checkpoint(ctx, { op: "restore", id: "cp-999" }),
    )
    expect(unknown.code).toBe("checkpoint_not_found")
    expect(unknown.detail?.checkpoints).toHaveLength(1)

    const missing = teachingOf(() => checkpoint(ctx, { op: "restore" }))
    expect(missing.code).toBe("checkpoint_not_found")
    expect(missing.message).toContain("requires the id")
  })

  it("aborts on an external disk edit — disk wins", async () => {
    const { ctx, wsPath } = await openWithButton()
    const { checkpoint: created } = checkpoint(ctx, { op: "create" })

    const external = fs
      .readFileSync(wsPath, "utf8")
      .replace('"label": "Button"', '"label": "Edited Elsewhere"')
    expect(external).not.toBe(fs.readFileSync(wsPath, "utf8"))
    fs.writeFileSync(wsPath, external)

    const teaching = teachingOf(() =>
      checkpoint(ctx, { op: "restore", id: created!.id }),
    )
    expect(teaching.code).toBe("write_conflict")
    // The external edit survives untouched.
    expect(fs.readFileSync(wsPath, "utf8")).toBe(external)
  })

  it("later batches cannot mutate a snapshot (reducer purity holds)", async () => {
    const { ctx } = await openWithButton()
    const variantId = `component-${ComponentId.BUTTON}-default`
    const { checkpoint: created } = checkpoint(ctx, { op: "create" })

    getPropertySchema(ctx, { propertyKey: "opacity" })
    await applyActions(ctx, { actions: [opacityAction(variantId, 40)] })

    checkpoint(ctx, { op: "restore", id: created!.id })
    const node = ctx.session.open!.workspace.nodes[variantId]! as {
      overrides?: Record<string, unknown>
    }
    expect(node.overrides?.opacity).toBeUndefined()
  })
})

describe("checkpoint — session scoping", () => {
  it("drops checkpoints when a different workspace path opens; keeps them on reload", async () => {
    const { ctx, root, wsPath } = await openWithButton()
    checkpoint(ctx, { op: "create", label: "file A" })

    // Recovery loop: re-opening the SAME path keeps the rollback depth.
    workspaceOpen(ctx, { path: wsPath })
    expect(checkpoint(ctx, { op: "list" }).checkpoints).toHaveLength(1)

    // A different path drops them: a snapshot of A must never write into B.
    workspaceOpen(ctx, {
      path: path.join(root, "other.json"),
      createIfMissing: true,
    })
    expect(checkpoint(ctx, { op: "list" }).checkpoints).toEqual([])
  })
})
