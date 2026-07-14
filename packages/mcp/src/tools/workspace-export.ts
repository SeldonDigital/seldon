import fs from "node:fs"
import path from "node:path"

import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import type { FileToExport } from "@seldon/factory/export/types"
import { z } from "zod"

import { resolvePathWithinRoots } from "../config"
import { ToolError } from "../errors"
import { buildMarkerComment, hasGeneratedMarker } from "../export-marker"
import { redactValue } from "../redact"
import { EXPORT_OUTPUT, EXPORT_TARGET } from "../render/export-cache"
import { REPO_ROOT, assertFactorySourcesReachable } from "../repo-root"
import { hashBytes, writeFileAtomic } from "../session"
import type { ToolContext } from "./context"

export const workspaceExportInputSchema = {
  targetDir: z
    .string()
    .min(1)
    .describe(
      "Directory to export into (must resolve inside the server's " +
        "configured roots). Generated React + CSS lands under " +
        "<targetDir>/components.",
    ),
  dryRun: z
    .boolean()
    .default(false)
    .describe(
      "Run the full export and classification but write NOTHING. Always " +
        "dry-run first on a non-empty target to see what would happen.",
    ),
  options: z
    .object({
      enableRemoteFonts: z
        .boolean()
        .optional()
        .describe(
          "Emit remote font host <link>s (off keeps exports request-free).",
        ),
      exportAllIconSetIcons: z
        .boolean()
        .optional()
        .describe(
          "Ship every enabled icon in the workspace's icon sets (can be " +
            "thousands of files). Default false: only icons components use.",
        ),
    })
    .optional(),
}

export const MANIFEST_FILENAME = ".seldon-manifest.json"

/** `.seldon-manifest.json`: every file the last export wrote. */
interface ExportManifest {
  version: 1
  files: Array<{ path: string; hash: string }>
}

export type ExportClassification = "new" | "regenerated" | "conflict"

export interface WorkspaceExportResult {
  targetDir: string
  dryRun: boolean
  /** Every file this export produced, with its classification. */
  files: Array<{ path: string; classification: ExportClassification }>
  /** Write receipt. Empty `written` on dry runs. */
  written: string[]
  skippedConflicts: Array<{ path: string; reason: string }>
  orphans: Array<{ path: string; reason: string }>
  manifestPath?: string
}

/** A produced file after marker injection, ready to classify/write. */
interface PreparedFile {
  /** Export-relative path ("/components/…"). */
  relPath: string
  /** Absolute path under the target directory. */
  absPath: string
  content: string | Buffer
  hash: string
  isText: boolean
}

function prepareFiles(
  files: FileToExport[],
  absTarget: string,
): PreparedFile[] {
  const prepared = new Map<string, PreparedFile>()
  for (const file of files) {
    const absPath = path.join(absTarget, file.path)
    // Factory output is trusted, but a path escaping the target directory
    // would be a write outside the user's chosen folder — hard stop.
    if (!absPath.startsWith(absTarget + path.sep)) {
      throw new ToolError({
        code: "path_outside_roots",
        message: `Export produced a path outside the target directory: "${file.path}".`,
        recovery:
          "This is a Factory bug, not a payload problem — report it. " +
          "Nothing was written.",
      })
    }
    const isText = typeof file.content === "string"
    const marker = isText ? buildMarkerComment(file.path) : null
    const content: string | Buffer = isText
      ? marker
        ? marker + (file.content as string)
        : (file.content as string)
      : Buffer.from(file.content as ArrayBuffer)
    prepared.set(file.path, {
      relPath: file.path,
      absPath,
      content,
      hash: hashBytes(content),
      isText,
    })
  }
  return [...prepared.values()]
}

function readManifest(absTarget: string): ExportManifest | null {
  try {
    const raw = fs.readFileSync(path.join(absTarget, MANIFEST_FILENAME), "utf8")
    const parsed = JSON.parse(raw) as ExportManifest
    return Array.isArray(parsed.files) ? parsed : null
  } catch {
    return null // absent or unreadable — classification falls back to markers
  }
}

/**
 * The overwrite policy for one produced file. Ownership is proven by the
 * previous manifest OR the marker in the on-disk content (an OR, so a lost
 * manifest does not turn our own files into conflicts). Binary files can
 * carry no marker; the manifest is their only proof.
 */
function classify(
  file: PreparedFile,
  manifestPaths: Set<string>,
): ExportClassification {
  if (!fs.existsSync(file.absPath)) return "new"
  if (manifestPaths.has(file.relPath)) return "regenerated"
  if (file.isText) {
    try {
      const onDisk = fs.readFileSync(file.absPath, "utf8")
      if (hasGeneratedMarker(onDisk)) return "regenerated"
    } catch {
      // unreadable existing file: treat as conflict below
    }
  }
  return "conflict"
}

/**
 * Safe export. Rule 1 — generated code is an artifact: overwrite what is
 * provably ours (marker or manifest), skip and report everything else,
 * delete nothing, ever.
 */
export async function workspaceExport(
  ctx: ToolContext,
  input: {
    targetDir: string
    dryRun?: boolean
    options?: { enableRemoteFonts?: boolean; exportAllIconSetIcons?: boolean }
  },
): Promise<WorkspaceExportResult> {
  const open = ctx.session.requireOpen()
  const dryRun = input.dryRun ?? false
  const absTarget = resolvePathWithinRoots(input.targetDir, ctx.config.roots)

  assertFactorySourcesReachable()
  const exported = await exportWorkspace(open.workspace, {
    rootDirectory: REPO_ROOT,
    target: EXPORT_TARGET,
    output: EXPORT_OUTPUT,
    enableRemoteFonts: input.options?.enableRemoteFonts ?? false,
    exportAllIconSetIcons: input.options?.exportAllIconSetIcons ?? false,
  })

  const prepared = prepareFiles(exported, absTarget)
  const previousManifest = readManifest(absTarget)
  const manifestPaths = new Set(
    previousManifest?.files.map((entry) => entry.path) ?? [],
  )

  const files: WorkspaceExportResult["files"] = []
  const written: string[] = []
  const skippedConflicts: WorkspaceExportResult["skippedConflicts"] = []

  for (const file of prepared) {
    const classification = classify(file, manifestPaths)
    files.push({ path: file.relPath, classification })
    if (classification === "conflict") {
      skippedConflicts.push({
        path: file.relPath,
        reason:
          "exists without a @seldon-generated marker and is not in the " +
          "previous manifest — not ours to overwrite",
      })
      continue
    }
    if (!dryRun) {
      writeFileAtomic(file.absPath, file.content)
      written.push(file.relPath)
    }
  }

  // Previously-written files this export no longer produces are
  // reported, never deleted. Only report those still present on disk.
  const producedPaths = new Set(prepared.map((file) => file.relPath))
  const orphans: WorkspaceExportResult["orphans"] = []
  for (const entry of previousManifest?.files ?? []) {
    if (producedPaths.has(entry.path)) continue
    if (!fs.existsSync(path.join(absTarget, entry.path))) continue
    orphans.push({
      path: entry.path,
      reason:
        "written by a previous export but no longer produced — left in " +
        "place; delete manually if unwanted",
    })
  }

  let manifestPath: string | undefined
  if (!dryRun) {
    // The manifest lists what THIS export owns on disk now: everything it
    // wrote. Hashes are of the final bytes (marker included), so a later
    // run's checks agree with reality.
    const manifest: ExportManifest = {
      version: 1,
      files: prepared
        .filter((file) => written.includes(file.relPath))
        .map((file) => ({ path: file.relPath, hash: file.hash })),
    }
    manifestPath = path.join(absTarget, MANIFEST_FILENAME)
    writeFileAtomic(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  }

  return redactValue({
    targetDir: absTarget,
    dryRun,
    files,
    written,
    skippedConflicts,
    orphans,
    ...(manifestPath ? { manifestPath } : {}),
  })
}
