/**
 * Safe-export coverage:
 * dry-run classifies correctly against seeded new/regenerated/conflict/
 * orphan cases; the real run skips the conflict, writes the rest, puts the
 * marker in every written text file, writes a complete manifest, and
 * deletes nothing.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"

import { ToolError } from "../errors"
import { SELDON_GENERATED_MARKER } from "../export-marker"
import { Session } from "../session"
import { applyActions } from "./apply-actions"
import type { ToolContext } from "./context"
import { workspaceExport } from "./workspace-export"
import { workspaceOpen } from "./workspace-open"

const tmpDirs: string[] = []
afterAll(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

async function openButtonWorkspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-export-"))
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
  const target = path.join(root, "export-target")
  return { ctx, root, target }
}

describe("workspace_export — dry run classification", () => {
  it("classifies everything as new on an empty target and writes NOTHING", async () => {
    const { ctx, target } = await openButtonWorkspace()
    const result = await workspaceExport(ctx, {
      targetDir: target,
      dryRun: true,
    })

    expect(result.dryRun).toBe(true)
    expect(result.files.length).toBeGreaterThan(0)
    expect(result.files.every((f) => f.classification === "new")).toBe(true)
    expect(result.written).toEqual([])
    expect(result.skippedConflicts).toEqual([])
    expect(result.orphans).toEqual([])
    expect(fs.existsSync(target)).toBe(false) // truly nothing, not even dirs
  })

  it("classifies a seeded markerless file as conflict, a marked one as regenerated", async () => {
    const { ctx, target } = await openButtonWorkspace()

    // Seed: user-owned file at a produced path (no marker) → conflict.
    const stylesPath = path.join(target, "components", "styles.css")
    fs.mkdirSync(path.dirname(stylesPath), { recursive: true })
    fs.writeFileSync(stylesPath, "/* hand-written, precious */")

    // Seed: our own file (marker, no manifest — e.g. manifest was lost).
    const buttonPath = path.join(target, "components", "elements", "Button.tsx")
    fs.mkdirSync(path.dirname(buttonPath), { recursive: true })
    fs.writeFileSync(
      buttonPath,
      `/* ${SELDON_GENERATED_MARKER} */\nexport function Button() {}`,
    )

    const result = await workspaceExport(ctx, {
      targetDir: target,
      dryRun: true,
    })
    const byPath = new Map(result.files.map((f) => [f.path, f.classification]))
    expect(byPath.get("/components/styles.css")).toBe("conflict")
    expect(byPath.get("/components/elements/Button.tsx")).toBe("regenerated")
    expect(result.skippedConflicts).toHaveLength(1)

    // Dry run: the conflicting file is untouched.
    expect(fs.readFileSync(stylesPath, "utf8")).toBe(
      "/* hand-written, precious */",
    )
  })
})

describe("workspace_export — real run", () => {
  it("writes files with markers, skips conflicts, writes a complete manifest", async () => {
    const { ctx, target } = await openButtonWorkspace()

    const stylesPath = path.join(target, "components", "styles.css")
    fs.mkdirSync(path.dirname(stylesPath), { recursive: true })
    fs.writeFileSync(stylesPath, "/* hand-written, precious */")

    const result = await workspaceExport(ctx, { targetDir: target })

    // The conflict was skipped and survives byte-identically.
    expect(result.skippedConflicts.map((c) => c.path)).toEqual([
      "/components/styles.css",
    ])
    expect(fs.readFileSync(stylesPath, "utf8")).toBe(
      "/* hand-written, precious */",
    )

    // Everything else was written, and every written text file carries the
    // marker.
    expect(result.written.length).toBeGreaterThan(0)
    expect(result.written).not.toContain("/components/styles.css")
    let checkedText = 0
    for (const relPath of result.written) {
      const absPath = path.join(target, relPath)
      expect(fs.existsSync(absPath)).toBe(true)
      if (/\.(tsx?|css|md|html)$/.test(relPath)) {
        expect(
          fs.readFileSync(absPath, "utf8"),
          `marker missing in ${relPath}`,
        ).toContain(SELDON_GENERATED_MARKER)
        checkedText++
      }
    }
    expect(checkedText).toBeGreaterThan(0)

    // Manifest lists exactly the written files.
    const manifest = JSON.parse(
      fs.readFileSync(path.join(target, ".seldon-manifest.json"), "utf8"),
    ) as { version: number; files: Array<{ path: string; hash: string }> }
    expect(manifest.version).toBe(1)
    expect(manifest.files.map((f) => f.path).sort()).toEqual(
      [...result.written].sort(),
    )
  })

  it("re-export over its own output regenerates everything, conflicts nothing", async () => {
    const { ctx, target } = await openButtonWorkspace()
    await workspaceExport(ctx, { targetDir: target })

    const second = await workspaceExport(ctx, { targetDir: target })
    expect(second.skippedConflicts).toEqual([])
    expect(second.files.every((f) => f.classification === "regenerated")).toBe(
      true,
    )
  })

  it("reports orphans from the previous manifest and never deletes them", async () => {
    const { ctx, target } = await openButtonWorkspace()
    await workspaceExport(ctx, { targetDir: target })

    // Simulate a file a previous export wrote that this export no longer
    // produces: add it to the manifest and put it on disk.
    const manifestPath = path.join(target, ".seldon-manifest.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    const ghostRel = "/components/elements/RemovedComponent.tsx"
    const ghostAbs = path.join(target, ghostRel)
    fs.writeFileSync(ghostAbs, `/* ${SELDON_GENERATED_MARKER} */`)
    manifest.files.push({ path: ghostRel, hash: "stale" })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))

    const result = await workspaceExport(ctx, { targetDir: target })
    expect(result.orphans.map((o) => o.path)).toContain(ghostRel)
    expect(fs.existsSync(ghostAbs)).toBe(true) // reported, never deleted

    // And the fresh manifest no longer claims the orphan.
    const fresh = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    expect(fresh.files.map((f: { path: string }) => f.path)).not.toContain(
      ghostRel,
    )
  })

  it("rejects target directories outside the configured roots", async () => {
    const { ctx } = await openButtonWorkspace()
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-outside-"))
    tmpDirs.push(outside)
    try {
      await workspaceExport(ctx, { targetDir: outside })
      throw new Error("expected a ToolError")
    } catch (error) {
      expect(error).toBeInstanceOf(ToolError)
      expect((error as ToolError).teaching.code).toBe("path_outside_roots")
    }
  })
})
