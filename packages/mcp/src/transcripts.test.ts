/**
 * Six end-to-end acceptance journeys, run as a scripted MCP client against
 * the real server over an in-memory transport pair — the CI gate for the
 * whole server surface. Each journey drives the protocol end to end and
 * asserts call-count and transcript-token budgets:
 *
 * - build: pricing card from an empty workspace in ≤ 12 tool
 *   calls and ≤ 25k transcript tokens; final view_node(css) matches the
 *   expected resolved values; extended with an image step (which
 *   degrades to html where Playwright is absent).
 * - re-theme: theme swap + swatch override in ≤ 6 calls, override
 *   visible in get_computed_theme, no node-level edits.
 * - sweep: every button variant's spacing changed in ≤ 5 calls
 *   via find_nodes + one batch; receipt reports the exact modified count.
 * - export: dry-run classifies seeded new/regenerated/conflict/
 *   orphan cases; the real run skips the conflict, markers + manifest
 *   complete, nothing deleted.
 * - recover: checkpoint → destructive experiment → restore is
 *   hash-identical; scoped reset_node also verified.
 * - safety: path escapes rejected on open and export; seeded
 *   credentials never appear in ANY tool output (grep over the full
 *   transcript); mid-batch failure leaves the file hash unchanged;
 *   external-edit-then-write raises the optimistic-concurrency conflict.
 *
 * Plus the observability log and the injection-framing envelope, both
 * asserted over the wire.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { afterAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { ValueType } from "@seldon/core/properties/constants"
import { Colorspace } from "@seldon/core/themes/constants/colorspace"
import type { Workspace } from "@seldon/core/workspace/types"

import { SELDON_GENERATED_MARKER } from "./export-marker"
import { USER_TEXT_KEY } from "./injection-framing"
import { LOG_DIR_NAME, LOG_FILE_NAME } from "./observability"
import { createSeldonMcpServer } from "./server"
import { Session, hashBytes } from "./session"
import { applyActions } from "./tools/apply-actions"
import type { ToolContext } from "./tools/context"
import { workspaceOpen } from "./tools/workspace-open"

const tmpDirs: string[] = []

afterAll(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

function makeRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-transcript-"))
  tmpDirs.push(root)
  return root
}

interface ToolResult {
  isError?: boolean
  content: Array<{ type: string; text?: string; data?: string }>
}

/** The JSON payload of a result: its (last) text content block, parsed. */
function payloadOf(result: ToolResult): Record<string, any> {
  const text = [...result.content].reverse().find((b) => b.type === "text")
  expect(text?.text).toBeTruthy()
  return JSON.parse(text!.text!)
}

/** Unwraps a {"$userText": ...} framing envelope; passes other values through. */
function userText(value: unknown): unknown {
  if (value !== null && typeof value === "object" && USER_TEXT_KEY in value) {
    return (value as Record<string, unknown>)[USER_TEXT_KEY]
  }
  return value
}

/**
 * A scripted MCP client session that counts calls (for the call budgets) and
 * accumulates every text block it receives (the credential grep and the
 * token budget run over this transcript).
 */
async function connect(root: string) {
  const { server } = createSeldonMcpServer({ roots: [root] })
  const client = new Client({ name: "transcripts", version: "0.0.0" })
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ])

  const transcriptTexts: string[] = []
  let calls = 0

  const call = async (
    name: string,
    args: Record<string, unknown> = {},
  ): Promise<ToolResult> => {
    calls++
    const result = (await client.callTool({
      name,
      arguments: args,
    })) as ToolResult
    for (const block of result.content) {
      if (block.type === "text" && block.text) transcriptTexts.push(block.text)
    }
    return result
  }

  /** Calls a tool and asserts success, returning the parsed payload. */
  const callOk = async (
    name: string,
    args: Record<string, unknown> = {},
  ): Promise<Record<string, any>> => {
    const result = await call(name, args)
    expect(result.isError, `${name} failed: ${transcriptTexts.at(-1)}`).toBe(
      undefined,
    )
    return payloadOf(result)
  }

  /** Calls a tool expecting a teaching error, returning it. */
  const callErr = async (
    name: string,
    args: Record<string, unknown> = {},
  ): Promise<{ code: string; message: string; recovery: string }> => {
    const result = await call(name, args)
    expect(result.isError, `${name} unexpectedly succeeded`).toBe(true)
    return payloadOf(result).error
  }

  return {
    call,
    callOk,
    callErr,
    callCount: () => calls,
    transcript: () => transcriptTexts.join("\n"),
    /** Rough token estimate over all received text (~4 chars per token). */
    tokenEstimate: () => Math.ceil(transcriptTexts.join("").length / 4),
  }
}

/** Seeds a workspace file with the button component board, out-of-band. */
async function seedButtonWorkspace(root: string): Promise<string> {
  const ctx: ToolContext = { session: new Session(), config: { roots: [root] } }
  const wsPath = path.join(root, "workspace.json")
  workspaceOpen(ctx, { path: wsPath, createIfMissing: true })
  await applyActions(ctx, {
    actions: [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
    ],
  })
  return wsPath
}

const gapRef = (nodeId: string, ref: string) => ({
  type: "set_node_properties",
  payload: {
    nodeId,
    properties: { gap: { type: ValueType.THEME_ORDINAL, value: ref } },
  },
})

const opacityAction = (nodeId: string, value: number) => ({
  type: "set_node_properties",
  payload: {
    nodeId,
    properties: { opacity: { type: ValueType.EXACT, value } },
  },
})

describe("journey: build a pricing card from an empty workspace", () => {
  it("search → schema → apply → verify within ≤12 calls and ≤25k tokens", async () => {
    const root = makeRoot()
    const t = await connect(root)

    // 1: open (empty workspace).
    const opened = await t.callOk("workspace_open", {
      path: path.join(root, "pricing.json"),
      createIfMissing: true,
    })
    expect(opened.created).toBe(true)

    // 2: find the component by concept.
    const search = await t.callOk("search_catalog", { query: "pricing card" })
    expect(search.results[0]).toMatchObject({
      id: "pricingCard",
      kind: "component",
      level: "part",
    })

    // 3: learn its contract; the default composition covers the needed parts.
    const schema = await t.callOk("get_component_schema", {
      componentId: "pricingCard",
    })
    expect(JSON.stringify(schema.defaultChildren)).toContain("button")

    // 4: build it.
    const built = await t.callOk("apply_actions", {
      actions: [
        { type: "add_component", payload: { boardKey: "pricingCard" } },
      ],
    })
    expect(built.receipt.createdIds.boards).toContain("pricingCard")
    expect(built.receipt.summary.nodes.added).toBeGreaterThan(0)

    // 5: navigate to the created variant.
    const outline = await t.callOk("get_workspace_outline")
    const variantId = outline.boards.find(
      (board: any) => board.key === "pricingCard",
    ).variants[0].id

    // 6: the styling contract (also satisfies the schema-served gate).
    const gapSchema = await t.callOk("get_property_schema", {
      propertyKey: "gap",
    })
    expect(gapSchema.property.schema.themeKeys.ordinal).toContain("@gap.open")

    // 7: edit + render in ONE round trip.
    const applied = await t.callOk("apply_actions", {
      actions: [gapRef(variantId, "@gap.open")],
      render: { target: variantId, format: "css" },
    })
    expect(applied.receipt.summary.nodes.modified).toBe(1)
    expect(applied.render.css.gap).toBeDefined()

    // 8: final ground truth — resolved values in CSS vocabulary.
    const view = await t.callOk("view_node", {
      target: variantId,
      format: "css",
    })
    expect(view.css.display).toBe("flex")
    // @gap.open resolves far wider than the inherited default (~0.5rem).
    expect(view.css.gap).toMatch(/rem$/)
    expect(parseFloat(view.css.gap)).toBeGreaterThan(3)
    expect(view.css.gap).toBe(applied.render.css.gap)

    // 9: the image step — a real screenshot where Playwright is
    // present, the documented html fallback where it is not.
    const image = await t.call("view_node", {
      target: variantId,
      format: "image",
    })
    expect(image.isError).toBe(undefined)
    const meta = payloadOf(image)
    if (image.content.some((block) => block.type === "image")) {
      expect(meta.format).toBe("image")
      expect(fs.existsSync(meta.previewPath)).toBe(true)
    } else {
      expect(meta).toMatchObject({ format: "html", requestedFormat: "image" })
      expect(meta.html).toContain("<html")
    }

    expect(t.callCount()).toBeLessThanOrEqual(12)
    expect(t.tokenEstimate()).toBeLessThanOrEqual(25_000)
  })
})

describe("journey: re-theme with a theme swap + swatch override", () => {
  it("lands in ≤6 calls with no node-level edits", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)

    // 1: open.
    await t.callOk("workspace_open", { path: wsPath })

    // 2: add the stock theme (its default instance id is deterministic).
    const themed = await t.callOk("apply_actions", {
      actions: [{ type: "add_theme", payload: { boardKey: "earth" } }],
    })
    expect(themed.receipt.createdIds.themes).toEqual(["theme-earth-default"])

    // 3: brand the primary swatch and switch the board — one batch, both
    // referencing the id created in the PREVIOUS batch.
    const switched = await t.callOk("apply_actions", {
      actions: [
        {
          type: "set_theme_override",
          payload: {
            themeId: "theme-earth-default",
            path: "swatch.primary",
            value: {
              type: "swatch",
              name: "Brand Blue",
              intent: "Brand primary color",
              parameters: { colorspace: Colorspace.HEX, value: "#0033ff" },
            },
          },
        },
        {
          type: "set_component_theme",
          payload: { boardKey: "button", theme: "theme-earth-default" },
        },
      ],
    })
    expect(switched.receipt.actions.every((a: any) => !a.noop)).toBe(true)

    // 4: verify — the computed table reflects the override.
    const computed = await t.callOk("get_computed_theme", {
      themeId: "theme-earth-default",
    })
    expect(computed.theme.swatch.primary).toMatchObject({
      name: "Brand Blue",
      parameters: { value: "#0033ff" },
    })

    expect(t.callCount()).toBeLessThanOrEqual(6)
  })
})

describe("journey: sweep spacing across every button variant", () => {
  it("find_nodes → one batch in ≤5 calls; receipt reports the exact count", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)

    // 1: open.
    await t.callOk("workspace_open", { path: wsPath })

    // 2: find every button variant.
    const found = await t.callOk("find_nodes", {
      query: "button",
      boardKey: "button",
    })
    const variantIds = found.matches
      .filter((m: any) => m.type === "variant" || m.type === "default")
      .map((m: any) => m.id)
    expect(variantIds.length).toBeGreaterThan(1)

    // 3: the spacing contract (schema-served gate) — real @gap tokens exist.
    // The sweep below uses distinct EXACT values, so it never needs one
    // token per variant; the gate only proves the schema serves the scale.
    const gapSchema = await t.callOk("get_property_schema", {
      propertyKey: "gap",
    })
    const gapKeys = gapSchema.property.schema.themeKeys.ordinal as string[]
    expect(gapKeys.length).toBeGreaterThan(0)

    // 4: ONE batch over all of them. Exact values, distinct per variant, so
    // neither Core's override dedup nor a catalog-shipped @gap override can
    // turn any action into a no-op — the receipt count must be exact.
    const swept = await t.callOk("apply_actions", {
      actions: variantIds.map((id: string, i: number) => ({
        type: "set_node_properties",
        payload: {
          nodeId: id,
          properties: {
            gap: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 3 + i },
            },
          },
        },
      })),
    })
    expect(swept.receipt.applied).toBe(variantIds.length)
    expect(swept.receipt.summary.nodes.modified).toBe(variantIds.length)
    expect(swept.receipt.actions.every((a: any) => !a.noop)).toBe(true)

    expect(t.callCount()).toBeLessThanOrEqual(5)
  })
})

describe("journey: export into a dirty target directory", () => {
  it("dry-run classifies; real run skips conflicts, markers + manifest, deletes nothing", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)
    const target = path.join(root, "export-target")

    await t.callOk("workspace_open", { path: wsPath })

    // Seeded conflict: a user-owned file at a produced path, no marker.
    const preciousPath = path.join(target, "components", "styles.css")
    fs.mkdirSync(path.dirname(preciousPath), { recursive: true })
    fs.writeFileSync(preciousPath, "/* hand-written, precious */")

    // Dry run: correct classification, nothing written.
    const dry = await t.callOk("workspace_export", {
      targetDir: target,
      dryRun: true,
    })
    const classes = new Map(
      dry.files.map((f: any) => [f.path, f.classification]),
    )
    expect(classes.get("/components/styles.css")).toBe("conflict")
    expect(
      dry.files
        .filter((f: any) => f.path !== "/components/styles.css")
        .every((f: any) => f.classification === "new"),
    ).toBe(true)
    expect(dry.written).toEqual([])
    expect(fs.readdirSync(path.join(target, "components"))).toEqual([
      "styles.css",
    ])

    // Real run: conflict skipped and byte-identical, everything else written
    // with the generated-file marker, manifest complete.
    const real = await t.callOk("workspace_export", { targetDir: target })
    expect(real.skippedConflicts.map((c: any) => c.path)).toEqual([
      "/components/styles.css",
    ])
    expect(fs.readFileSync(preciousPath, "utf8")).toBe(
      "/* hand-written, precious */",
    )
    expect(real.written.length).toBeGreaterThan(0)
    for (const relPath of real.written) {
      if (/\.(tsx?|css|md|html)$/.test(relPath)) {
        expect(
          fs.readFileSync(path.join(target, relPath), "utf8"),
          `marker missing in ${relPath}`,
        ).toContain(SELDON_GENERATED_MARKER)
      }
    }
    const manifest = JSON.parse(
      fs.readFileSync(path.join(target, ".seldon-manifest.json"), "utf8"),
    ) as { files: Array<{ path: string }> }
    expect(manifest.files.map((f) => f.path).sort()).toEqual(
      [...real.written].sort(),
    )

    // Seeded orphan: manifest-listed, still on disk, no longer produced.
    const ghostRel = "/components/elements/RemovedComponent.tsx"
    fs.writeFileSync(
      path.join(target, ghostRel),
      `/* ${SELDON_GENERATED_MARKER} */`,
    )
    manifest.files.push({ path: ghostRel })
    fs.writeFileSync(
      path.join(target, ".seldon-manifest.json"),
      JSON.stringify(manifest),
    )

    const third = await t.callOk("workspace_export", { targetDir: target })
    expect(third.orphans.map((o: any) => o.path)).toContain(ghostRel)
    // The user-owned file is still not ours: it stays a conflict on every
    // re-export, and stays byte-identical (the exporter keeps no memory of skips).
    expect(third.skippedConflicts.map((c: any) => c.path)).toEqual([
      "/components/styles.css",
    ])
    expect(fs.existsSync(path.join(target, ghostRel))).toBe(true) // never deleted
  })
})

describe("journey: recover via checkpoint restore and scoped reset", () => {
  it("restore leaves the file hash-identical; reset_node clears the bad edit", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)
    const defaultVariant = `component-${ComponentId.BUTTON}-default`

    await t.callOk("workspace_open", { path: wsPath })

    // Checkpoint before the experiment (the server-instructions policy).
    const created = await t.callOk("checkpoint", {
      op: "create",
      label: "before experiment",
    })
    const checkpointId = created.checkpoint.id
    const hashAtCheckpoint = hashBytes(fs.readFileSync(wsPath, "utf8"))

    // Destructive experiment: duplicate a whole variant subtree.
    const experiment = await t.callOk("apply_actions", {
      actions: [
        { type: "duplicate_node", payload: { nodeId: defaultVariant } },
      ],
    })
    expect(experiment.receipt.summary.nodes.added).toBeGreaterThan(0)
    expect(hashBytes(fs.readFileSync(wsPath, "utf8"))).not.toBe(
      hashAtCheckpoint,
    )

    // workspace_info serves the checkpoint list for real (its promise).
    const info = await t.callOk("workspace_info")
    expect(info.checkpoints.map((c: any) => c.id)).toEqual([checkpointId])

    // Restore: session AND file roll back; the file is hash-identical.
    const restored = await t.callOk("checkpoint", {
      op: "restore",
      id: checkpointId,
    })
    expect(restored.persistedTo).toBe(wsPath)
    expect(hashBytes(fs.readFileSync(wsPath, "utf8"))).toBe(hashAtCheckpoint)
    for (const nodeId of experiment.receipt.createdIds.nodes.slice(0, 3)) {
      expect((await t.callErr("get_node", { nodeId })).code).toBe(
        "node_not_found",
      )
    }

    // Scoped recovery: a bad property edit undone by reset_node alone.
    await t.callOk("get_property_schema", { propertyKey: "opacity" })
    await t.callOk("apply_actions", {
      actions: [opacityAction(defaultVariant, 7)],
    })
    const before = await t.callOk("get_node", {
      nodeId: defaultVariant,
      mode: "raw",
    })
    expect(before.node.overrides.opacity).toMatchObject({ value: 7 })

    await t.callOk("apply_actions", {
      actions: [{ type: "reset_node", payload: { nodeId: defaultVariant } }],
    })
    const after = await t.callOk("get_node", {
      nodeId: defaultVariant,
      mode: "raw",
    })
    expect(after.node.overrides?.opacity).toBeUndefined()
  })
})

describe("journey: safety — escapes, redaction, atomicity, concurrency", () => {
  it("rejects path escapes on open and export", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)

    const absolute = await t.callErr("workspace_open", {
      path: "/etc/seldon-escape.json",
      createIfMissing: true,
    })
    expect(absolute.code).toBe("path_outside_roots")

    const traversal = await t.callErr("workspace_open", {
      path: path.join(root, "..", `escape-${path.basename(root)}.json`),
      createIfMissing: true,
    })
    expect(traversal.code).toBe("path_outside_roots")

    await t.callOk("workspace_open", { path: wsPath })
    const exportEscape = await t.callErr("workspace_export", {
      targetDir: path.join(root, "..", "escape-target"),
    })
    expect(exportEscape.code).toBe("path_outside_roots")
  })

  it("seeded credentials never appear in any output; failures leave the file intact", async () => {
    const SECRET = "Bearer-XYZZY-do-not-leak"
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)

    // Seed secrets the way a real workspace carries them.
    const seeded = JSON.parse(fs.readFileSync(wsPath, "utf8")) as Workspace
    const iconBoard = Object.values(seeded.boards).find(
      (board) => board.type === "icon-set",
    )!
    ;(iconBoard as { credentials?: unknown }).credentials = {
      apiToken: SECRET,
    }
    iconBoard.__editor = { stash: SECRET }
    const buttonVariant = `component-${ComponentId.BUTTON}-default`
    seeded.nodes[buttonVariant]!.__editor = { stash: SECRET }
    fs.writeFileSync(wsPath, JSON.stringify(seeded, null, 2))

    // A battery over every workspace-reading surface, successes and
    // teaching errors alike — all accumulated into one transcript.
    await t.callOk("workspace_open", { path: wsPath })
    await t.callOk("workspace_info")
    const outline = await t.callOk("get_workspace_outline")
    await t.callOk("get_node", { nodeId: buttonVariant, mode: "raw" })
    await t.callOk("get_node", { nodeId: buttonVariant, mode: "computed" })
    await t.callOk("find_nodes", { query: "button" })
    await t.callOk("get_computed_theme", {
      themeId: outline.themes[0].id,
    })
    await t.callOk("get_property_schema", { propertyKey: "opacity" })
    await t.callOk("apply_actions", {
      actions: [opacityAction(buttonVariant, 33)],
      render: { target: buttonVariant, format: "css" },
    })
    await t.callOk("view_node", { target: buttonVariant, format: "css" })
    await t.callOk("checkpoint", { op: "create", label: "safety" })
    await t.callOk("checkpoint", { op: "list" })
    await t.callOk("workspace_export", {
      targetDir: path.join(root, "export-target"),
      dryRun: true,
    })
    const ghost = await t.callErr("apply_actions", {
      actions: [opacityAction("ghost-node", 10)],
    })
    expect(ghost.code).toBe("action_rejected")
    const excluded = await t.callErr("apply_actions", {
      actions: [
        {
          type: "set_board_credentials",
          payload: { boardKey: "button", credentials: { apiToken: SECRET } },
        },
      ],
    })
    expect(excluded.code).toBe("action_not_exposed")

    // Injection framing over the wire: workspace-authored labels arrive enveloped.
    const buttonBoard = outline.boards.find((b: any) => b.key === "button")
    expect(buttonBoard.label).toEqual({ [USER_TEXT_KEY]: "Buttons" })
    expect(userText(buttonBoard.label)).toBe("Buttons")

    // Redaction: grep the FULL transcript.
    const transcript = t.transcript()
    expect(transcript).not.toContain(SECRET)
    expect(transcript).not.toContain("__editor")
    expect(transcript).not.toContain('"credentials"')
    // …while the secrets still live safely in the file itself.
    expect(fs.readFileSync(wsPath, "utf8")).toContain(SECRET)

    // Atomicity: a mid-batch failure leaves the file hash unchanged.
    const hashBefore = hashBytes(fs.readFileSync(wsPath, "utf8"))
    const midBatch = await t.callErr("apply_actions", {
      actions: [
        opacityAction(buttonVariant, 44),
        {
          type: "set_node_label",
          payload: { nodeId: "ghost-node", label: "x" },
        },
      ],
    })
    expect(midBatch.code).toBe("action_rejected")
    expect(hashBytes(fs.readFileSync(wsPath, "utf8"))).toBe(hashBefore)

    // Concurrency: an external edit aborts the next write — disk wins —
    // and reload + re-apply recovers.
    const external = fs
      .readFileSync(wsPath, "utf8")
      .replace('"label": "Button"', '"label": "Edited Elsewhere"')
    fs.writeFileSync(wsPath, external)

    const conflict = await t.callErr("apply_actions", {
      actions: [opacityAction(buttonVariant, 55)],
    })
    expect(conflict.code).toBe("write_conflict")
    expect(fs.readFileSync(wsPath, "utf8")).toBe(external) // disk won

    await t.callOk("workspace_open", { path: wsPath })
    const reapplied = await t.callOk("apply_actions", {
      actions: [opacityAction(buttonVariant, 55)],
    })
    expect(reapplied.receipt.summary.nodes.modified).toBe(1)
  })
})

describe("the observability log", () => {
  it("logs every tool call, rejection, schema bounce, no-op flag, and zero-result search", async () => {
    const root = makeRoot()
    const wsPath = await seedButtonWorkspace(root)
    const t = await connect(root)
    const buttonVariant = `component-${ComponentId.BUTTON}-default`

    await t.callOk("workspace_open", { path: wsPath })
    // Schema bounce: set_node_properties before its schema was served.
    await t.callErr("apply_actions", {
      actions: [opacityAction(buttonVariant, 60)],
    })
    // Resubmit succeeds (the bounce marked the schema served)…
    await t.callOk("apply_actions", {
      actions: [opacityAction(buttonVariant, 60)],
    })
    // …and an identical edit is an accepted no-op.
    await t.callOk("apply_actions", {
      actions: [opacityAction(buttonVariant, 60)],
    })
    // Zero-result search still flows through the same funnel. With
    // the optional embedding model present, gibberish may fuzzy-match above
    // threshold — the log expectation below is conditional on the actual
    // result (the deterministic zero-result cases live in semantic-search.test.ts).
    const gibberish = await t.callOk("search_catalog", { query: "zxqvwjkly" })

    const logPath = path.join(path.dirname(wsPath), LOG_DIR_NAME, LOG_FILE_NAME)
    const events = fs
      .readFileSync(logPath, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))

    for (const event of events) {
      expect(Date.parse(event.ts)).not.toBeNaN()
    }

    const toolCalls = events.filter((e) => e.event === "tool_call")
    // Every call after open lands in the file (open itself may precede the
    // session binding, so ≥ the 4 calls above).
    expect(toolCalls.length).toBeGreaterThanOrEqual(4)

    const bounce = toolCalls.find((e) => e.tool === "apply_actions" && !e.ok)
    expect(bounce).toMatchObject({
      errorCode: "property_schema_not_served",
      schemaBounce: true,
      failedAction: { index: 0, type: "set_node_properties" },
    })
    expect(bounce.durationMs).toBeGreaterThanOrEqual(0)

    const applies = toolCalls.filter((e) => e.tool === "apply_actions" && e.ok)
    expect(applies.map((e) => e.noopActions)).toEqual([0, 1])

    if (gibberish.results.length === 0) {
      const zero = events.find((e) => e.event === "search_zero_results")
      expect(zero).toMatchObject({ query: "zxqvwjkly" })
      expect(typeof zero.semantic).toBe("boolean")
    }
  })
})
