/**
 * view_node's css and html formats.
 *
 * - Targets: variant id, instance id (widens to its variant for html,
 *   exact node for css), component board key (side-by-side sheet).
 * - Theme option: non-mutating render under another workspace theme.
 * - Formats: "css" resolved values; "html" full production document.
 * - html comes from the real Factory export (class names + theme
 *   custom properties present), not a bespoke assembler.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"

import { ToolError } from "../errors"
import { Session } from "../session"
import { applyActions } from "./apply-actions"
import type { ToolContext } from "./context"
import { getWorkspaceOutline } from "./get-workspace-outline"
import { viewNode } from "./view-node"
import { workspaceOpen } from "./workspace-open"

const tmpDirs: string[] = []
afterAll(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

/** One shared fixture session: a workspace with a Button board. */
async function openFixture(): Promise<{
  ctx: ToolContext
  buttonVariantId: string
  editableVariantId: string
  instanceId: string
}> {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-view-"))
  tmpDirs.push(root)
  const ctx: ToolContext = { session: new Session(), config: { roots: [root] } }
  workspaceOpen(ctx, {
    path: path.join(root, "workspace.json"),
    createIfMissing: true,
  })
  await applyActions(ctx, {
    actions: [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
    ],
  })
  const board = getWorkspaceOutline(ctx).boards.find(
    (b) => b.key === ComponentId.BUTTON,
  )!
  const buttonVariantId = board.variants![0]!.id
  // Rename/style rules reject edits on the default variant silently; the
  // render-parameter tests need a variant whose mutations actually land.
  const editableVariantId = board.variants!.find(
    (variant) => variant.id !== `component-${ComponentId.BUTTON}-default`,
  )!.id
  // Any nested instance inside the variant tree (the icon/text child).
  const { workspace } = ctx.session.requireOpen()
  const instanceId = Object.values(workspace.nodes).find(
    (node) => node.type === "instance",
  )!.id
  return { ctx, buttonVariantId, editableVariantId, instanceId }
}

const fixture = await openFixture()

async function teachingOf(fn: () => Promise<unknown>) {
  try {
    await fn()
  } catch (error) {
    if (error instanceof ToolError) return error.teaching
    throw error
  }
  throw new Error("expected a ToolError")
}

describe("view_node — format css", () => {
  it("returns resolved values for a variant", async () => {
    const { ctx, buttonVariantId } = fixture
    const result = await viewNode(ctx, { target: buttonVariantId })
    expect(result.format).toBe("css")
    expect(result.renderedScope).toMatchObject({
      kind: "variant",
      id: buttonVariantId,
    })
    expect(Object.keys(result.css!).length).toBeGreaterThan(0)
    expect(result.themeIds).toHaveLength(1)
  })

  it("resolves the EXACT node for an instance target (no widening)", async () => {
    const { ctx, instanceId } = fixture
    const result = await viewNode(ctx, { target: instanceId, format: "css" })
    expect(result.css).toBeDefined()
    // Scope names the ancestor variant for context, but css is the node's.
    expect(result.renderedScope.kind).toBe("variant")
  })

  it("rejects a board target with a teaching error", async () => {
    const { ctx } = fixture
    const teaching = await teachingOf(() =>
      viewNode(ctx, { target: ComponentId.BUTTON, format: "css" }),
    )
    expect(teaching.code).toBe("invalid_render_target")
    expect(teaching.recovery).toContain("html")
  })
})

describe("view_node — format html", () => {
  it("renders a variant as a full production document", async () => {
    const { ctx, buttonVariantId } = fixture
    const result = await viewNode(ctx, {
      target: buttonVariantId,
      format: "html",
    })
    expect(result.html).toContain("<!doctype html>")
    expect(result.html).toContain("sdn-button")
    expect(result.html).toContain("--sdn-") // theme custom properties inlined
    expect(result.html).toMatch(/<svg/) // icon child inlined by the render
    expect(result.widenedFrom).toBeUndefined()
  })

  it("widens an instance target to its variant and says so", async () => {
    const { ctx, instanceId, buttonVariantId } = fixture
    const result = await viewNode(ctx, { target: instanceId, format: "html" })
    expect(result.widenedFrom).toBe(instanceId)
    expect(result.renderedScope).toMatchObject({
      kind: "variant",
      id: buttonVariantId,
    })
    expect(result.html).toContain("sdn-button")
  })

  it("renders a board key as a side-by-side sheet of its variants", async () => {
    const { ctx } = fixture
    const result = await viewNode(ctx, {
      target: ComponentId.BUTTON,
      format: "html",
    })
    expect(result.renderedScope.kind).toBe("board")
    if (result.renderedScope.kind !== "board") return
    expect(result.renderedScope.variantIds.length).toBeGreaterThan(0)
    expect(result.html).toContain("display:flex")
    expect((result.html!.match(/<section>/g) ?? []).length).toBe(
      result.renderedScope.variantIds.length,
    )
  })
})

describe("view_node — theme option (non-mutating)", () => {
  it("renders under another workspace theme without touching the session", async () => {
    const { ctx, buttonVariantId } = fixture
    const before = ctx.session.requireOpen().workspace

    // Fresh workspaces seed seldon/highContrast/material theme boards; the
    // material entry is present without any add_theme.
    const themeId = getWorkspaceOutline(ctx).themes.find((theme) =>
      theme.id.includes("material"),
    )!.id

    const result = await viewNode(ctx, {
      target: buttonVariantId,
      format: "html",
      theme: themeId,
    })
    expect(result.themeIds).toContain(themeId)
    expect(result.html).toContain("--sdn-material")

    // Non-mutating: the session workspace is whatever apply_actions left it
    // at — viewNode's scratch theme override never leaks into it.
    const after = ctx.session.requireOpen().workspace
    expect(after.nodes[buttonVariantId]!.theme).toBe(
      before.nodes[buttonVariantId]!.theme,
    )
  })

  it("teaches on unknown theme ids", async () => {
    const { ctx, buttonVariantId } = fixture
    const teaching = await teachingOf(() =>
      viewNode(ctx, { target: buttonVariantId, theme: "ghost" }),
    )
    expect(teaching.code).toBe("theme_not_found")
    expect(teaching.recovery).toContain("add_theme")
  })
})

describe("view_node — target resolution errors", () => {
  it("teaches on unknown targets", async () => {
    const { ctx } = fixture
    const teaching = await teachingOf(() => viewNode(ctx, { target: "ghost" }))
    expect(teaching.code).toBe("node_not_found")
  })
})

describe("apply_actions render parameter", () => {
  it("returns receipt AND a fresh render of the edited component", async () => {
    const { ctx, editableVariantId } = fixture
    const result = await applyActions(ctx, {
      actions: [
        {
          type: "set_node_label",
          payload: { nodeId: editableVariantId, label: "Renamed" },
        },
      ],
      render: { target: editableVariantId, format: "html" },
    })
    expect(result.receipt.applied).toBe(1)
    expect(result.receipt.summary.nodes.modified).toBeGreaterThan(0)
    expect(result.render).toBeDefined()
    expect(result.render!.html).toContain("sdn-button")
    expect(result.renderError).toBeUndefined()
    // The render reflects the post-batch workspace: the export cache keys by
    // workspace identity, and the session was updated before rendering.
    expect(result.render!.renderedScope).toMatchObject({
      kind: "variant",
      id: editableVariantId,
    })
  })

  it("does not fail the persisted batch when only the render fails", async () => {
    const { ctx, editableVariantId } = fixture
    const result = await applyActions(ctx, {
      actions: [
        {
          type: "set_node_label",
          payload: { nodeId: editableVariantId, label: "Renamed again" },
        },
      ],
      render: { target: "ghost-target" },
    })
    // The edit stands...
    expect(result.receipt.applied).toBe(1)
    expect(
      ctx.session.requireOpen().workspace.nodes[editableVariantId]!.label,
    ).toBe("Renamed again")
    // ...and the render failure is reported, not thrown.
    expect(result.render).toBeUndefined()
    expect(result.renderError).toBeDefined()
    expect(result.renderError!.message).toContain("WAS applied")
  })

  it("degrades a render {format: image} to html when screenshots are unavailable", async () => {
    const { ctx, editableVariantId } = fixture
    const result = await applyActions(ctx, {
      actions: [
        {
          type: "set_node_label",
          payload: { nodeId: editableVariantId, label: "Renamed thrice" },
        },
      ],
      render: { target: editableVariantId, format: "image", width: 640 },
    })
    expect(result.receipt.applied).toBe(1)
    // This ctx has no screenshot provider: the same fallback ladder as
    // view_node serves the html document, flagged, never thrown.
    expect(result.renderError).toBeUndefined()
    expect(result.render!.format).toBe("html")
    expect(result.render!.requestedFormat).toBe("image")
    expect(result.render!.imageFallback).toBeDefined()
    expect(result.render!.html).toContain("sdn-button")
  })

  it("runs no render when the batch is rejected", async () => {
    const { ctx, buttonVariantId } = fixture
    const teaching = await teachingOf(() =>
      applyActions(ctx, {
        actions: [{ type: "definitely_not_an_action", payload: {} }],
        render: { target: buttonVariantId },
      }),
    )
    // The rejection is the batch's, not the render's (on batch
    // rejection, no render runs).
    expect(teaching.code).toBe("action_not_exposed")
  })
})
