import { createHash } from "node:crypto"

import { BINDINGS_VERSION } from "../../bindings/version"
import { formatJson } from "./format-json"

import type { ExportOptions, FileToExport } from "../types"

const INTEGRITY_FILE = "INTEGRITY.json"

/**
 * Records a sha256 for each emitted script file.
 *
 * Hashes cover the bytes as written, so this runs after the license header and
 * the format pass. Running it earlier would record hashes for content that never
 * reaches disk.
 *
 * A check the script runs on itself is not a security control, since a modified
 * script can report any hash. The check that means something is external: the
 * factory is deterministic, so a re-export of the same workspace emits the same
 * bytes, and any difference is a factory update or a local edit. The emitted
 * README says so.
 */
export async function generateScriptsIntegrity(
  scriptFiles: FileToExport[],
  options: ExportOptions,
): Promise<FileToExport> {
  const scriptsFolder = `${options.output.componentsFolder}/scripts`
  const files: Record<string, string> = {}

  for (const file of scriptFiles) {
    if (typeof file.content !== "string") continue

    const relativePath = file.path.slice(`${scriptsFolder}/`.length)

    if (relativePath === INTEGRITY_FILE) continue

    files[relativePath] = createHash("sha256").update(file.content, "utf8").digest("hex")
  }

  const ordered: Record<string, string> = {}

  for (const relativePath of Object.keys(files).sort()) {
    ordered[relativePath] = files[relativePath]
  }

  const integrity = {
    algorithm: "sha256",
    bindingsVersion: BINDINGS_VERSION,
    files: ordered,
  }

  return {
    path: `${scriptsFolder}/${INTEGRITY_FILE}`,
    content: await formatJson(JSON.stringify(integrity, null, 2), options.formatConfigRoot),
  }
}
