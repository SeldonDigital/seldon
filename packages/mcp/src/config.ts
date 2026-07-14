import fs from "node:fs"
import path from "node:path"

import { ToolError } from "./errors"

/**
 * Server configuration. Roots are set at startup via CLI flags or
 * environment; the model can never change them. Every workspace (and
 * export) path must resolve inside one of them.
 */
export interface ServerConfig {
  /** Absolute, normalized allowed filesystem roots. Never empty. */
  roots: string[]
}

/**
 * Parses `--root <path>` (repeatable, also `--root=<path>`) from argv, falling
 * back to the `SELDON_MCP_ROOTS` env var (`path.delimiter`-separated), falling
 * back to the process working directory.
 */
export function parseServerConfig(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): ServerConfig {
  const roots: string[] = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!
    if (arg === "--root") {
      const value = argv[i + 1]
      if (!value || value.startsWith("--")) {
        throw new Error("--root requires a path argument")
      }
      roots.push(value)
      i++
    } else if (arg.startsWith("--root=")) {
      roots.push(arg.slice("--root=".length))
    }
  }

  if (roots.length === 0 && env.SELDON_MCP_ROOTS) {
    roots.push(...env.SELDON_MCP_ROOTS.split(path.delimiter).filter(Boolean))
  }

  if (roots.length === 0) {
    roots.push(cwd)
  }

  return { roots: roots.map((root) => path.resolve(cwd, root)) }
}

/**
 * Resolves symlinks on the deepest existing ancestor of `absPath` and rejoins
 * the not-yet-existing tail, so a path escape through a symlinked directory is
 * caught even when the target file does not exist yet.
 */
function realpathDeep(absPath: string): string {
  let existing = absPath
  let tail = ""

  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing)
    if (parent === existing) break
    tail = path.join(path.basename(existing), tail)
    existing = parent
  }

  return path.join(fs.realpathSync(existing), tail)
}

/**
 * Resolves a model-supplied path to an absolute path and verifies it lands
 * inside one of the configured roots, following symlinks in both the
 * path and the roots. Throws a teaching error on escape.
 */
export function resolvePathWithinRoots(
  inputPath: string,
  roots: string[],
): string {
  const abs = path.resolve(inputPath)
  const real = realpathDeep(abs)

  for (const root of roots) {
    const realRoot = realpathDeep(root)
    if (real === realRoot || real.startsWith(realRoot + path.sep)) {
      return abs
    }
  }

  throw new ToolError({
    code: "path_outside_roots",
    message: `Path "${inputPath}" resolves outside the allowed filesystem roots.`,
    recovery:
      `Use a path under one of the configured roots: ${roots.join(", ")}. ` +
      "Roots are server configuration and cannot be changed from this session.",
    detail: { roots },
  })
}
