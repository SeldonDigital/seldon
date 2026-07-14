import fs from "node:fs"
import path from "node:path"

/** Monotonic per-process sequence for preview filenames. */
let previewSeq = 0

/**
 * Every image render is also written to
 * `.seldon/previews/<target>-<seq>.png` next to the workspace file, so the
 * human can open, keep, and compare renders outside the conversation. No
 * rotation/cleanup in v1 (matches the observability-log decision).
 */
export function persistPreview(
  workspaceFilePath: string,
  target: string,
  png: Buffer,
): string {
  const dir = path.join(path.dirname(workspaceFilePath), ".seldon", "previews")
  fs.mkdirSync(dir, { recursive: true })
  const safeTarget = target.replace(/[^a-zA-Z0-9_-]/g, "_")
  const previewPath = path.join(dir, `${safeTarget}-${++previewSeq}.png`)
  fs.writeFileSync(previewPath, png)
  return previewPath
}
