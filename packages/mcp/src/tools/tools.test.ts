/**
 * Behavioral suite for the core tool surface:
 *
 * - Full sweep: outline → node reads → one batched property edit across
 *   every button variant, receipt reporting the exact modified-node count.
 * - Concurrency: an external file edit aborts the next write with a
 *   teaching error, disk wins, reload + re-apply recovers.
 * - Redaction: seeded `credentials` and `__editor` never appear in any
 *   tool output, asserted over the serialized transcript of every tool.
 * - Atomicity: a mid-batch rejection leaves the session workspace and the
 *   disk file byte-identical.
 * - Whitelisting, receipts and no-op flags, teaching errors, and both
 *   get_node modes.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { ValueType } from "@seldon/core/properties/constants"
import type { Workspace } from "@seldon/core/workspace/types"

import { ToolError } from "../errors"
import { Session, hashBytes } from "../session"
import { applyActions } from "./apply-actions"
import type { ToolContext } from "./context"
import { findNodes } from "./find-nodes"
import { getComputedThemeTool } from "./get-computed-theme"
import { getNode } from "./get-node"
import { getPropertySchema } from "./get-property-schema"
import { getWorkspaceOutline } from "./get-workspace-outline"
import { workspaceInfo } from "./workspace-info"
import { workspaceOpen } from "./workspace-open"

const tmpDirs: string[] = []

function makeCtx(): { ctx: ToolContext; root: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-tools-"))
  tmpDirs.push(root)
  return { ctx: { session: new Session(), config: { roots: [root] } }, root }
}

afterEach(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

async function teachingOfAsync(fn: () => Promise<unknown>) {
  try {
    await fn()
  } catch (error) {
    if (error instanceof ToolError) return error.teaching
    throw error
  }
  throw new Error("expected a ToolError")
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

function opacityAction(nodeId: string, value: number) {
  return {
    type: "set_node_properties",
    payload: {
      nodeId,
      properties: { opacity: { type: ValueType.EXACT, value } },
    },
  }
}

/**
 * The hard schema gate: set_node_properties rejects keys whose schema was not
 * served this session. Tests exercising the write path (not the gate) satisfy
 * the gate the way a real agent does — get_property_schema first.
 */
function serveOpacitySchema(ctx: ToolContext) {
  getPropertySchema(ctx, { propertyKey: "opacity" })
}

const GHOST_ACTION = opacityAction("component-button-Ghost000", 40)

describe("workspace_open", () => {
  it("errors on a missing file unless createIfMissing", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")

    const teaching = teachingOf(() => workspaceOpen(ctx, { path: wsPath }))
    expect(teaching.code).toBe("workspace_file_not_found")
    expect(teaching.recovery).toContain("createIfMissing")

    const result = workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
    expect(result.created).toBe(true)
    expect(result.filePath).toBe(wsPath)
    // The created file is valid, current, and loadable.
    const onDisk = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    expect(onDisk.metadata.version).toBe(result.version)
    expect(result.counts.boards["theme"]).toBeGreaterThanOrEqual(1)

    const reopened = workspaceOpen(ctx, { path: wsPath })
    expect(reopened.created).toBe(false)
  })

  it("rejects paths outside the configured roots", async () => {
    const { ctx } = makeCtx()
    const teaching = teachingOf(() =>
      workspaceOpen(ctx, { path: "/etc/seldon-nope.json" }),
    )
    expect(teaching.code).toBe("path_outside_roots")
  })

  it("reports invalid JSON without echoing file contents", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "broken.json")
    fs.writeFileSync(wsPath, '{ "boards": SECRET-BLOB-42 }')

    const teaching = teachingOf(() => workspaceOpen(ctx, { path: wsPath }))
    expect(teaching.code).toBe("workspace_file_invalid")
    expect(JSON.stringify(teaching)).not.toContain("SECRET-BLOB-42")
  })
})

describe("workspace_info", () => {
  it("requires an open workspace", async () => {
    const { ctx } = makeCtx()
    expect(teachingOf(() => workspaceInfo(ctx)).code).toBe("no_workspace_open")
  })

  it("reports path, counts, and conflict status", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")
    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })

    const info = workspaceInfo(ctx)
    expect(info.filePath).toBe(wsPath)
    expect(info.dirty).toBe(false)
    expect(info.diskChangedExternally).toBe(false)
    expect(info.checkpoints).toEqual([])
    expect(info.counts.nodes).toBe(0)

    // External edit flips the conflict flag on the status surface.
    fs.writeFileSync(wsPath, fs.readFileSync(wsPath, "utf8") + "\n")
    expect(workspaceInfo(ctx).diskChangedExternally).toBe(true)
  })
})

describe("apply_actions — write path", () => {
  it("applies a batch, persists it, and returns a diff receipt", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")
    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })

    const result = await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })

    const { receipt } = result
    expect(result.persistedTo).toBe(wsPath)
    expect(receipt.applied).toBe(1)
    // add_component cascades in the component's dependencies (button pulls
    // its icon/label boards), so added ≥ 1 with button among the created ids.
    expect(receipt.summary.boards.added).toBeGreaterThanOrEqual(1)
    expect(receipt.summary.nodes.added).toBeGreaterThan(0)
    expect(receipt.createdIds.boards).toContain(ComponentId.BUTTON)
    expect(receipt.actions[0]).toMatchObject({
      index: 0,
      type: "add_component",
      noop: false,
    })
    expect(receipt.actions[0]!.createdIds.length).toBeGreaterThan(0)

    // Auto-persist: the disk file already contains the change.
    const onDisk = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    expect(onDisk.boards[ComponentId.BUTTON]).toBeDefined()
    expect(workspaceInfo(ctx).diskChangedExternally).toBe(false)
  })

  it("flags accepted-but-unchanged actions as no-ops", async () => {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    serveOpacitySchema(ctx)
    await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })
    const variantId = getWorkspaceOutline(ctx).boards.find(
      (board) => board.key === ComponentId.BUTTON,
    )!.variants![0]!.id

    const first = await applyActions(ctx, {
      actions: [opacityAction(variantId, 55)],
    })
    expect(first.receipt.actions[0]!.noop).toBe(false)
    expect(first.receipt.summary.nodes.modified).toBe(1)

    const second = await applyActions(ctx, {
      actions: [opacityAction(variantId, 55)],
    })
    expect(second.receipt.actions[0]!.noop).toBe(true)
    expect(second.receipt.summary.nodes.modified).toBe(0)
  })

  it("rejects non-whitelisted actions with a teaching error", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")
    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
    const hashBefore = hashBytes(fs.readFileSync(wsPath))

    const cases: Array<[string, string]> = [
      ["set_workspace_label", "tier2"],
      ["set_board_credentials", "excluded"],
      ["set_workspace", "excluded"],
      ["definitely_not_an_action", "unknown"],
    ]
    for (const [type, classification] of cases) {
      const teaching = await teachingOfAsync(() =>
        applyActions(ctx, {
          actions: [
            { type: "add_component", payload: { boardKey: ComponentId.CHIP } },
            { type, payload: {} },
          ],
        }),
      )
      expect(teaching.code).toBe("action_not_exposed")
      expect(teaching.failedAction).toEqual({ index: 1, type })
      expect(teaching.detail?.classification).toBe(classification)
      expect(teaching.detail?.exposedActionTypes).toContain(
        "set_node_properties",
      )
    }

    // Nothing was applied or written, even though action 0 was valid.
    expect(workspaceInfo(ctx).counts.nodes).toBe(0)
    expect(hashBytes(fs.readFileSync(wsPath))).toBe(hashBefore)
  })

  it("a mid-batch rejection leaves session and file untouched", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")
    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
    serveOpacitySchema(ctx)
    const workspaceBefore = ctx.session.requireOpen().workspace
    const hashBefore = hashBytes(fs.readFileSync(wsPath))

    const teaching = await teachingOfAsync(() =>
      applyActions(ctx, {
        actions: [
          { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
          GHOST_ACTION,
        ],
      }),
    )

    expect(teaching.code).toBe("action_rejected")
    expect(teaching.failedAction).toEqual({
      index: 1,
      type: "set_node_properties",
    })
    expect(teaching.message.length).toBeGreaterThan(0)
    expect(teaching.recovery).toContain("resubmit")
    expect(ctx.session.requireOpen().workspace).toBe(workspaceBefore)
    expect(hashBytes(fs.readFileSync(wsPath))).toBe(hashBefore)
  })

  it("an external file edit aborts the write; reload recovers", async () => {
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")
    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })

    // Someone else edits the file behind the session's back.
    const external = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    external.metadata.label = "changed externally"
    const externalText = JSON.stringify(external, null, 2)
    fs.writeFileSync(wsPath, externalText)

    const batch = {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    }
    const teaching = await teachingOfAsync(() => applyActions(ctx, batch))
    expect(teaching.code).toBe("write_conflict")
    expect(teaching.recovery).toContain("workspace_open")

    // Disk wins: the external content is still there, the session did not
    // absorb the discarded batch.
    expect(fs.readFileSync(wsPath, "utf8")).toBe(externalText)
    expect(workspaceInfo(ctx).counts.nodes).toBe(0)

    // The documented recovery works: reopen, then re-apply the same batch.
    workspaceOpen(ctx, { path: wsPath })
    const result = await applyActions(ctx, batch)
    expect(result.receipt.createdIds.boards).toContain(ComponentId.BUTTON)
    const onDisk = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    expect(onDisk.metadata.label).toBe("changed externally")
    expect(onDisk.boards[ComponentId.BUTTON]).toBeDefined()
  })

  it("requires an open workspace", async () => {
    const { ctx } = makeCtx()
    const teaching = await teachingOfAsync(() =>
      applyActions(ctx, {
        actions: [
          { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
        ],
      }),
    )
    expect(teaching.code).toBe("no_workspace_open")
  })
})

describe("get_workspace_outline / get_node", () => {
  async function openWithButton(): Promise<ToolContext> {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })
    return ctx
  }

  it("outline lists board structure without property bags", async () => {
    const ctx = await openWithButton()
    const outline = getWorkspaceOutline(ctx)

    const button = outline.boards.find((b) => b.key === ComponentId.BUTTON)!
    expect(button.type).toBe("component")
    expect(button.variantCount).toBeGreaterThan(0)
    expect(button.variants!.length).toBe(button.variantCount)
    expect(button.variants![0]).toHaveProperty("id")
    expect(button.variants![0]).toHaveProperty("label")
    expect(outline.themes.length).toBeGreaterThan(0)
    expect(JSON.stringify(outline)).not.toContain('"overrides"')
  })

  it("raw mode returns the editing view with a child tree", async () => {
    const ctx = await openWithButton()
    const outline = getWorkspaceOutline(ctx)
    const button = outline.boards.find((b) => b.key === ComponentId.BUTTON)!
    const withChildren = button.variants!.find(
      (v) => v.id !== `component-${ComponentId.BUTTON}-default`,
    )!

    const result = getNode(ctx, { nodeId: withChildren.id, mode: "raw" })
    expect(result.node.id).toBe(withChildren.id)
    expect(result.node.template).toBeTruthy()
    expect(result.node.overrides).toBeDefined()
    expect(result.boardKey).toBe(ComponentId.BUTTON)
    expect(result.children.length).toBeGreaterThan(0)
    expect(result.children[0]).toHaveProperty("id")
    expect(result.children[0]).toHaveProperty("label")
  })

  it("computed mode returns resolved CSS vocabulary, not property cells", async () => {
    const ctx = await openWithButton()
    const outline = getWorkspaceOutline(ctx)
    const variantId = outline.boards.find((b) => b.key === ComponentId.BUTTON)!
      .variants![0]!.id

    const result = getNode(ctx, { nodeId: variantId, mode: "computed" })
    expect(result.node.overrides).toBeUndefined()
    const css = result.node.css!
    expect(Object.keys(css).length).toBeGreaterThan(0)
    for (const value of Object.values(css)) {
      // CSS vocabulary is flat strings/numbers, never Seldon value cells.
      expect(["string", "number"]).toContain(typeof value)
    }
  })

  it("unknown node ids get a teaching error", async () => {
    const ctx = await openWithButton()
    const teaching = teachingOf(() => getNode(ctx, { nodeId: "nope" }))
    expect(teaching.code).toBe("node_not_found")
    expect(teaching.recovery).toContain("get_workspace_outline")
  })
})

describe("full sweep: batched property edit across all button variants", () => {
  it("edits every button variant in one batch; receipt reports the exact count", async () => {
    const { ctx, root } = makeCtx()
    // Call 1: open.
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    // Call 2: create the buttons being swept.
    await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })
    // Call 3: find them (find_nodes is the direct way; the outline also works).
    const found = findNodes(ctx, { query: "button", boardKey: "button" })
    const variantIds = found.matches
      .filter((match) => match.type === "variant" || match.type === "default")
      .map((match) => match.id)
    expect(variantIds.length).toBeGreaterThan(1)
    expect(variantIds).toEqual(
      getWorkspaceOutline(ctx)
        .boards.find((board) => board.key === ComponentId.BUTTON)!
        .variants!.map((variant) => variant.id),
    )

    // Call 4 (gate): the sweep's property schema, once per session.
    serveOpacitySchema(ctx)

    // Call 5: one batch touching every variant. Values are distinct per
    // variant — Core drops an override that equals the inherited value, so a
    // same-value sweep after editing the default would truthfully no-op on
    // the inheriting variants (covered below).
    const { receipt } = await applyActions(ctx, {
      actions: variantIds.map((id, i) => opacityAction(id, 50 + i)),
    })
    expect(receipt.applied).toBe(variantIds.length)
    expect(receipt.summary.nodes.modified).toBe(variantIds.length)
    expect(receipt.summary.nodes.added).toBe(0)
    expect(receipt.actions.every((action) => !action.noop)).toBe(true)

    // Call 6: verify one resolved value.
    const check = getNode(ctx, { nodeId: variantIds[0]!, mode: "raw" })
    expect(check.node.overrides).toMatchObject({
      opacity: { value: 50 },
    })
  })

  it("flags inherited-value edits as no-ops instead of fake successes", async () => {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })
    serveOpacitySchema(ctx)
    const variantIds = getWorkspaceOutline(ctx)
      .boards.find((board) => board.key === ComponentId.BUTTON)!
      .variants!.map((variant) => variant.id)

    // Same value everywhere: the default variant changes, the variants that
    // inherit from it end up storing nothing — Core dedupes the override.
    const { receipt } = await applyActions(ctx, {
      actions: variantIds.map((id) => opacityAction(id, 80)),
    })
    expect(receipt.summary.nodes.modified).toBe(1)
    expect(receipt.actions[0]!.noop).toBe(false)
    expect(receipt.actions.slice(1).every((action) => action.noop)).toBe(true)
  })
})

describe("redaction: credentials and __editor never reach tool output", () => {
  it("scrubs seeded secrets from every tool's serialized output", async () => {
    const SECRET = "Bearer-XYZZY-do-not-leak"
    const { ctx, root } = makeCtx()
    const wsPath = path.join(root, "workspace.json")

    workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
    await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
      ],
    })

    // Seed secrets the way a real workspace carries them: credentials on an
    // icon-set board, __editor bags on a board and a node.
    const seeded = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    const iconBoard = Object.values(seeded.boards).find(
      (board) => board.type === "icon-set",
    )!
    ;(iconBoard as { credentials?: Record<string, string> }).credentials = {
      apiToken: SECRET,
    }
    iconBoard.__editor = { stash: SECRET }
    const nodeId = Object.keys(seeded.nodes)[0]!
    seeded.nodes[nodeId]!.__editor = { stash: SECRET }
    fs.writeFileSync(wsPath, JSON.stringify(seeded, null, 2))

    // Full transcript over every workspace-reading tool, successes and
    // failures alike (catalog-only tools never see workspace data).
    const transcript: unknown[] = []
    transcript.push(workspaceOpen(ctx, { path: wsPath }))
    transcript.push(workspaceInfo(ctx))
    transcript.push(getWorkspaceOutline(ctx))
    transcript.push(getNode(ctx, { nodeId, mode: "raw" }))
    transcript.push(getNode(ctx, { nodeId, mode: "computed" }))
    transcript.push(findNodes(ctx, { query: "button" }))
    transcript.push(
      getComputedThemeTool(ctx, {
        themeId: getWorkspaceOutline(ctx).themes[0]!.id,
      }),
    )
    transcript.push(getPropertySchema(ctx, { propertyKey: "opacity" }))
    transcript.push(
      await applyActions(ctx, { actions: [opacityAction(nodeId, 33)] }),
    )
    transcript.push(
      await teachingOfAsync(() =>
        applyActions(ctx, { actions: [GHOST_ACTION] }),
      ),
    )
    transcript.push(teachingOf(() => getNode(ctx, { nodeId: "ghost" })))

    const text = JSON.stringify(transcript)
    expect(text).not.toContain(SECRET)
    expect(text).not.toContain("__editor")
    expect(text).not.toContain('"credentials"')

    // …while the secrets are still safe in the file itself.
    const onDisk = fs.readFileSync(wsPath, "utf8")
    expect(onDisk).toContain(SECRET)
  })
})
