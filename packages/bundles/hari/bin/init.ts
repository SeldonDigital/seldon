import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { WorkspaceStore } from "@seldon/ai"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"
import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import type { Workspace } from "@seldon/core/workspace/types"

/** Parsed `seldon-mcp init` flags: the store path and an optional source file to seed from. */
interface InitOptions {
  storeArg: string
  sourceFile?: string
}

/** The Cursor MCP server entry `init` writes so the client can spawn this bin over stdio. */
interface McpServerEntry {
  command: string
  args: string[]
}

/**
 * Scaffolds a project so an MCP client can drive its Seldon workspace store. It
 * ensures the store directory exists, adds a `seldon` server to `.cursor/mcp.json`
 * without disturbing other servers, and seeds one starter workspace when the store
 * is empty. Running it again is safe: it refreshes the config entry and leaves an
 * already-seeded store untouched.
 */
export async function runInit(cwd: string, argv: string[]): Promise<void> {
  const { storeArg, sourceFile } = parseInitArgs(argv)
  const storeDir = path.resolve(cwd, storeArg)

  await fs.mkdir(storeDir, { recursive: true })
  const config = await writeCursorConfig(cwd, storeArg)

  const store = new WorkspaceStore(storeDir)
  const existing = await store.listIds()

  let seeded: { id: string; label: string } | undefined

  if (existing.length === 0) {
    const workspace = sourceFile
      ? await workspaceFromSource(cwd, sourceFile)
      : blankWorkspace(await projectName(cwd))
    const id = workspace.metadata.id ?? randomUUID()

    await store.write(id, stampId(workspace, id))
    seeded = { id, label: workspace.metadata.label || id }
  }

  printSummary({ storeDir, config, seeded, existingCount: existing.length })
}

/**
 * Imports a raw workspace file into the store when its id is not already present,
 * returning that id. The server calls this at startup for `--workspace <file>`, so
 * pointing the flag at an export or authored file makes it available as a target.
 */
export async function importSourceIntoStore(storeDir: string, sourceFile: string): Promise<string> {
  const store = new WorkspaceStore(path.resolve(storeDir))
  const raw = await fs.readFile(path.resolve(sourceFile), "utf8")
  const workspace = loadWorkspace(raw)
  const id = workspace.metadata.id ?? randomUUID()
  const present = await store.read(id)

  if (present) return id

  await store.write(id, stampId(workspace, id))

  return id
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

/** Adds or refreshes the `seldon` server in `.cursor/mcp.json`, keeping other servers. */
async function writeCursorConfig(
  cwd: string,
  storeArg: string,
): Promise<{ path: string; added: boolean }> {
  const cursorDir = path.join(cwd, ".cursor")
  const configPath = path.join(cursorDir, "mcp.json")
  const config = await readJsonObject(configPath)

  const servers = (config.mcpServers as Record<string, McpServerEntry> | undefined) ?? {}
  const added = servers.seldon === undefined

  servers.seldon = { command: "npx", args: ["seldon-mcp", "--store", storeArg] }
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

interface SummaryInput {
  storeDir: string
  config: { path: string; added: boolean }
  existingCount: number
  seeded?: { id: string; label: string }
}

/** Prints what `init` created and the next steps, to stdout. */
function printSummary(input: SummaryInput): void {
  const lines = ["", "Seldon MCP initialised.", ""]

  lines.push(`  Store:   ${input.storeDir}`)
  lines.push(`  Config:  ${input.config.path} (seldon server ${input.config.added ? "added" : "updated"})`)

  if (input.seeded) {
    lines.push(`  Seeded:  "${input.seeded.label}" (${input.seeded.id})`)
  } else {
    lines.push(`  Store already holds ${input.existingCount} workspace(s); left as is.`)
  }

  lines.push("")
  lines.push("Next steps:")
  lines.push("  1. Reload Cursor, or open Settings > MCP and enable the \"seldon\" server.")
  lines.push("  2. Ask your agent to list workspaces, then add a component to the seeded one.")
  lines.push("  3. Run the editor separately to view edits live; it shares this store.")
  lines.push("")

  process.stdout.write(`${lines.join("\n")}\n`)
}
