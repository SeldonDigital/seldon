import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { WorkspaceStore } from "@seldon/ai"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"
import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import type { Workspace } from "@seldon/core/workspace/types"

/** Pointer file that names the live workspace source under `.seldon`. */
const PROJECT_POINTER_FILE = "project.json"

/** Parsed `seldon-mcp init` flags: the store path and an optional source file. */
interface InitOptions {
  storeArg: string
  sourceFile?: string
}

/** The Cursor MCP server entry `init` writes so the client can spawn this bin over stdio. */
interface McpServerEntry {
  type: "stdio"
  command: string
  args: string[]
}

/**
 * Scaffolds a project so the editor, MCP, and CLI share one workspace source.
 * It ensures `.seldon` exists, writes `project.json` pointing at that source,
 * adds a `seldon` server to `.cursor/mcp.json`, and seeds a starter workspace
 * when none is present. Running it again is safe: it refreshes the config and
 * leaves an existing source file untouched.
 */
export async function runInit(cwd: string, argv: string[]): Promise<void> {
  const { storeArg, sourceFile } = parseInitArgs(argv)
  const storeDir = path.resolve(cwd, storeArg)
  const seldonDir = path.join(cwd, ".seldon")

  await fs.mkdir(seldonDir, { recursive: true })
  await fs.mkdir(storeDir, { recursive: true })

  const liveFile = await resolveLiveFile(cwd, seldonDir, sourceFile)
  const liveArg = toPosix(path.relative(cwd, liveFile))
  const config = await writeCursorConfig(cwd, storeArg, liveArg)

  await writeProjectPointer(seldonDir, path.basename(liveFile))

  const store = new WorkspaceStore(storeDir, { liveFile })
  const existing = await store.listIds()

  let seeded: { id: string; label: string } | undefined

  if (existing.length === 0) {
    const workspace = sourceFile
      ? await workspaceFromSource(cwd, sourceFile)
      : await readOrCreateLive(liveFile, await projectName(cwd))
    const id = workspace.metadata.id ?? randomUUID()
    const stamped = stampId(workspace, id)

    await store.write(id, stamped)
    seeded = { id, label: stamped.metadata.label || id }
  }

  printSummary({
    storeDir,
    liveFile,
    config,
    seeded,
    existingCount: existing.length,
  })
}

/** Reads `--store` and `--source`/`--workspace` from the `init` argument list. */
function parseInitArgs(argv: string[]): InitOptions {
  const options: InitOptions = { storeArg: ".seldon/workspaces" }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === "--store") options.storeArg = argv[++index]
    else if (arg === "--source" || arg === "--workspace") options.sourceFile = argv[++index]
    else if (arg.startsWith("--store=")) options.storeArg = arg.slice("--store=".length)
    else if (arg.startsWith("--source=")) options.sourceFile = arg.slice("--source=".length)
    else if (arg.startsWith("--workspace=")) options.sourceFile = arg.slice("--workspace=".length)
  }

  return options
}

/**
 * Picks the live workspace source path. An explicit `--source` wins, then an
 * existing project pointer, then the only raw workspace under `.seldon`, then
 * a new `<project>.react.json`.
 */
async function resolveLiveFile(
  cwd: string,
  seldonDir: string,
  sourceFile?: string,
): Promise<string> {
  if (sourceFile) return livePathFromSource(cwd, seldonDir, sourceFile)

  const fromPointer = await readProjectPointer(seldonDir)

  if (fromPointer) return path.join(seldonDir, fromPointer)

  const found = await findSoleWorkspaceSource(seldonDir)

  if (found) return found

  const base = fileBase(await projectName(cwd))

  return path.join(seldonDir, `${base}.react.json`)
}

/** Places a source path under `.seldon` when it is not already there. */
function livePathFromSource(cwd: string, seldonDir: string, sourceFile: string): string {
  const resolved = path.resolve(cwd, sourceFile)
  const prefix = seldonDir.endsWith(path.sep) ? seldonDir : `${seldonDir}${path.sep}`

  if (resolved.startsWith(prefix) || resolved === seldonDir) return resolved

  return path.join(seldonDir, path.basename(resolved))
}

/** Reads `.seldon/project.json`, or undefined when it is absent or malformed. */
async function readProjectPointer(seldonDir: string): Promise<string | undefined> {
  try {
    const raw = await fs.readFile(path.join(seldonDir, PROJECT_POINTER_FILE), "utf8")
    const parsed = JSON.parse(raw) as { workspace?: string }

    if (typeof parsed.workspace === "string" && parsed.workspace.length > 0) {
      return parsed.workspace
    }
  } catch {
    // No pointer yet.
  }

  return undefined
}

/** Writes `.seldon/project.json` so the editor and CLI open the same source. */
async function writeProjectPointer(seldonDir: string, fileName: string): Promise<void> {
  const pointer = { workspace: fileName }

  await fs.writeFile(
    path.join(seldonDir, PROJECT_POINTER_FILE),
    `${JSON.stringify(pointer, null, 2)}\n`,
    "utf8",
  )
}

/** Returns the only raw workspace file under `.seldon`, or undefined. */
async function findSoleWorkspaceSource(seldonDir: string): Promise<string | undefined> {
  let entries: string[]

  try {
    entries = await fs.readdir(seldonDir)
  } catch {
    return undefined
  }

  const names: string[] = []

  for (const entry of entries) {
    if (!entry.endsWith(".json") || entry === PROJECT_POINTER_FILE) continue

    const full = path.join(seldonDir, entry)

    try {
      const parsed = JSON.parse(await fs.readFile(full, "utf8")) as Record<string, unknown>

      if (isWorkspaceJson(parsed)) names.push(full)
    } catch {
      // Skip a file that will not read or parse as a workspace.
    }
  }

  if (names.length === 1) return names[0]

  return undefined
}

/** True when parsed JSON has the top-level maps a workspace file must carry. */
function isWorkspaceJson(value: Record<string, unknown>): boolean {
  return (
    typeof value.metadata === "object" &&
    value.metadata !== null &&
    typeof value.boards === "object" &&
    value.boards !== null &&
    typeof value.nodes === "object" &&
    value.nodes !== null
  )
}

/** Loads the live file when it already exists, otherwise builds a blank workspace. */
async function readOrCreateLive(liveFile: string, name: string): Promise<Workspace> {
  try {
    return loadWorkspace(await fs.readFile(liveFile, "utf8"))
  } catch {
    return blankWorkspace(name)
  }
}

/** Adds or refreshes the `seldon` server in `.cursor/mcp.json`, keeping other servers. */
async function writeCursorConfig(
  cwd: string,
  storeArg: string,
  workspaceArg: string,
): Promise<{ path: string; added: boolean }> {
  const cursorDir = path.join(cwd, ".cursor")
  const configPath = path.join(cursorDir, "mcp.json")
  const config = await readJsonObject(configPath)

  const servers = (config.mcpServers as Record<string, McpServerEntry> | undefined) ?? {}
  const added = servers.seldon === undefined

  servers.seldon = {
    type: "stdio",
    command: "npx",
    args: ["seldon-mcp", "--store", storeArg, "--workspace", workspaceArg],
  }
  config.mcpServers = servers

  await fs.mkdir(cursorDir, { recursive: true })
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8")

  return { path: configPath, added }
}

/** Reads a JSON object file, returning an empty object when it is absent. */
async function readJsonObject(filePath: string): Promise<Record<string, unknown>> {
  let raw: string

  try {
    raw = await fs.readFile(filePath, "utf8")
  } catch {
    return {}
  }

  const parsed = JSON.parse(raw) as unknown

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Cannot merge ${filePath}: expected a JSON object.`)
  }

  return parsed as Record<string, unknown>
}

/** Loads and normalizes a raw workspace file, resolving it against the project root. */
async function workspaceFromSource(cwd: string, sourceFile: string): Promise<Workspace> {
  const raw = await fs.readFile(path.resolve(cwd, sourceFile), "utf8")

  return loadWorkspace(raw)
}

/** Builds an empty workspace labelled after the project. */
function blankWorkspace(name: string): Workspace {
  return setWorkspaceLabel({ value: name }, createEmptyWorkspace())
}

/** Returns a copy of the workspace whose `metadata.id` matches the store key. */
function stampId(workspace: Workspace, id: string): Workspace {
  if (workspace.metadata.id === id) return workspace

  return { ...workspace, metadata: { ...workspace.metadata, id } }
}

/** Reads the project's package name, falling back to the directory name. */
async function projectName(cwd: string): Promise<string> {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf8")
    const parsed = JSON.parse(raw) as { name?: string }

    if (typeof parsed.name === "string" && parsed.name.length > 0) return parsed.name
  } catch {
    // No package.json, so fall back to the folder name below.
  }

  return path.basename(cwd)
}

/** Turns a display name into a file base, matching the editor source name. */
function fileBase(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "workspace"
}

/** Normalizes a relative path to POSIX separators for mcp.json. */
function toPosix(value: string): string {
  return value.replaceAll("\\", "/")
}

interface SummaryInput {
  storeDir: string
  liveFile: string
  config: { path: string; added: boolean }
  existingCount: number
  seeded?: { id: string; label: string }
}

/** Prints what `init` created and the next steps, to stdout. */
function printSummary(input: SummaryInput): void {
  const lines = ["", "Seldon MCP initialised.", ""]

  lines.push(`  Source:  ${input.liveFile}`)
  lines.push(`  Backup:  ${input.storeDir}`)
  lines.push(
    `  Config:  ${input.config.path} (seldon server ${input.config.added ? "added" : "updated"})`,
  )

  if (input.seeded) {
    lines.push(`  Seeded:  "${input.seeded.label}" (${input.seeded.id})`)
  } else {
    lines.push(`  Source already holds a workspace; left as is.`)
  }

  lines.push("")
  lines.push("Next steps:")
  lines.push('  1. Reload Cursor, or open Settings > MCP and enable the "seldon" server.')
  lines.push("  2. Ask your agent to list workspaces, then add a component to the source file.")
  lines.push("  3. Open the same source in the editor. Export settings travel with the file.")
  lines.push("")

  process.stdout.write(`${lines.join("\n")}\n`)
}
