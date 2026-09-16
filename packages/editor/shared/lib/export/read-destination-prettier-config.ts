/** JSON Prettier config files the destination project may keep at its root. */
const PRETTIER_JSON_FILES = [".prettierrc", ".prettierrc.json", "prettier.config.json"] as const

/**
 * Reads the destination project's Prettier config through a folder handle.
 *
 * The editor export runs on the Seldon dev server, which has no Node path to
 * the picked folder. Sending this object lets the factory format the same way
 * MCP and the CLI do when they resolve config from disk. JavaScript Prettier
 * configs are skipped; those need a path, which the browser handle does not
 * provide.
 */
export async function readDestinationPrettierConfig(
  root: FileSystemDirectoryHandle,
): Promise<Record<string, unknown> | undefined> {
  for (const name of PRETTIER_JSON_FILES) {
    const parsed = await readJsonFile(root, name)

    if (parsed && !Array.isArray(parsed)) return parsed
  }

  const pkg = await readJsonFile(root, "package.json")
  const prettier = pkg?.prettier

  if (prettier && typeof prettier === "object" && !Array.isArray(prettier)) {
    return prettier as Record<string, unknown>
  }

  return undefined
}

/** Reads and parses one JSON file from a directory, or undefined when absent. */
async function readJsonFile(
  root: FileSystemDirectoryHandle,
  name: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    const handle = await root.getFileHandle(name)
    const parsed: unknown = JSON.parse(await (await handle.getFile()).text())

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // Missing or not JSON, so try the next name.
  }

  return undefined
}
