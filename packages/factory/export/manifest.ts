import type { FileToExport } from "./types"

/**
 * The export manifest records which workspace owns the generated files and refs
 * in a components folder. A later export into the same folder reads it to tell a
 * re-export of the same workspace from a different workspace about to overwrite
 * another's output. It lives at `<componentsFolder>/.seldon-manifest.json` and
 * is committed with the components.
 */
export const EXPORT_MANIFEST_FILENAME = ".seldon-manifest.json"

/** Bumped when the manifest shape changes so a reader can reject an old file. */
export const EXPORT_MANIFEST_VERSION = 1

export interface ExportManifest {
  version: number
  workspaceId: string
  files: string[]
  refs: string[]
}

export interface ExportCollisions {
  files: string[]
  refs: string[]
}

/**
 * Builds the manifest for one export. `files` are the emitted files, minus the
 * manifest itself, recorded by their output-root-relative path. Refs come from
 * the emitted `refs/registry.json` when present, so ownership covers both the
 * files on disk and the ref names app code binds to.
 */
export function buildExportManifest(workspaceId: string, files: FileToExport[]): ExportManifest {
  const paths = files
    .map((file) => file.path)
    .filter((filePath) => basename(filePath) !== EXPORT_MANIFEST_FILENAME)
    .sort()

  return {
    version: EXPORT_MANIFEST_VERSION,
    workspaceId,
    files: paths,
    refs: extractRefIds(files),
  }
}

/**
 * Reports which of the next export's files and refs an earlier export by a
 * different workspace already owns. Returns nothing when there is no prior
 * manifest or when the same workspace re-exports, since a workspace owns its own
 * output and overwriting it is the expected update.
 */
export function detectExportCollisions(
  existing: ExportManifest | null,
  next: ExportManifest,
): ExportCollisions {
  if (!existing || existing.workspaceId === next.workspaceId) {
    return { files: [], refs: [] }
  }

  const nextFiles = new Set(next.files)
  const nextRefs = new Set(next.refs)

  return {
    files: existing.files.filter((filePath) => nextFiles.has(filePath)),
    refs: existing.refs.filter((ref) => nextRefs.has(ref)),
  }
}

/** Safely parses manifest text a reader loaded from disk. Returns null on any problem. */
export function parseExportManifest(text: string): ExportManifest | null {
  try {
    const value = JSON.parse(text) as Partial<ExportManifest>

    if (typeof value?.workspaceId !== "string" || !Array.isArray(value.files)) {
      return null
    }

    return {
      version: typeof value.version === "number" ? value.version : EXPORT_MANIFEST_VERSION,
      workspaceId: value.workspaceId,
      files: value.files.filter((entry): entry is string => typeof entry === "string"),
      refs: Array.isArray(value.refs)
        ? value.refs.filter((entry): entry is string => typeof entry === "string")
        : [],
    }
  } catch {
    return null
  }
}

/** True when a re-export overwrites another workspace's files or refs. */
export function hasExportCollisions(collisions: ExportCollisions): boolean {
  return collisions.files.length > 0 || collisions.refs.length > 0
}

/**
 * A short, human-readable summary of a collision for a CLI prompt or an editor
 * dialog. Names the owning workspace and the first few conflicting entries.
 */
export function describeExportCollisions(
  existing: ExportManifest | null,
  collisions: ExportCollisions,
): string {
  const owner = existing ? existing.workspaceId : "another workspace"
  const parts: string[] = []

  if (collisions.files.length > 0) {
    parts.push(`${collisions.files.length} file(s): ${previewList(collisions.files)}`)
  }

  if (collisions.refs.length > 0) {
    parts.push(`${collisions.refs.length} ref(s): ${previewList(collisions.refs)}`)
  }

  return `This folder already holds an export owned by workspace ${owner}. This export overwrites ${parts.join(" and ")}.`
}

function previewList(entries: string[]): string {
  const shown = entries.slice(0, 3).join(", ")

  return entries.length > 3 ? `${shown}, and ${entries.length - 3} more` : shown
}

function extractRefIds(files: FileToExport[]): string[] {
  const registry = files.find((file) => file.path.endsWith("refs/registry.json"))

  if (!registry || typeof registry.content !== "string") {
    return []
  }

  try {
    const parsed = JSON.parse(registry.content) as { refs?: Record<string, unknown> }

    return parsed.refs ? Object.keys(parsed.refs).sort() : []
  } catch {
    return []
  }
}

function basename(filePath: string): string {
  return filePath.split("/").pop() ?? filePath
}
