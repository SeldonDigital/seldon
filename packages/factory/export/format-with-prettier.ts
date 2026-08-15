import { exportPrettierConfig } from "./export-prettier-config"

import type { Options } from "prettier"

/** The Prettier surface the export uses. Kept minimal so the load can stay best effort. */
interface PrettierApi {
  format(source: string, options?: Options): Promise<string>
  resolveConfig?(filePath: string, options?: { editorconfig?: boolean }): Promise<Options | null>
}

/** Extension probed per parser so Prettier applies the destination config's per-glob overrides. */
const PARSER_PROBE_EXTENSION: Record<string, string> = {
  typescript: ".tsx",
  css: ".css",
  json: ".json",
  vue: ".vue",
}

let prettierModule: PrettierApi | null | undefined
let sortPlugins: string[] | undefined

// Resolved destination config, keyed by the probe path so a per-parser override
// resolves once and reuses across the many files an export formats.
const resolvedConfigByProbe = new Map<string, Options | null>()

/**
 * Loads Prettier once, best effort. A consumer project that does not install
 * Prettier gets unformatted but working output rather than a crashed export.
 * Prettier is external to the factory bundles, so this import resolves it from
 * the consumer's own install when present.
 */
async function loadPrettier(): Promise<PrettierApi | null> {
  if (prettierModule !== undefined) return prettierModule

  try {
    prettierModule = (await import("prettier")) as unknown as PrettierApi
  } catch {
    prettierModule = null
  }

  return prettierModule
}

/**
 * Resolves the import-sort plugin once. It is applied only when it resolves, so
 * a consumer without it gets valid output with unsorted imports instead of a
 * "cannot find package" failure from Prettier's plugin loader.
 */
async function resolveSortPlugins(): Promise<string[]> {
  if (sortPlugins !== undefined) return sortPlugins

  try {
    await import("@ianvs/prettier-plugin-sort-imports")
    sortPlugins = ["@ianvs/prettier-plugin-sort-imports"]
  } catch {
    sortPlugins = []
  }

  return sortPlugins
}

/**
 * Resolves the destination repository's Prettier config so a generated file
 * lands formatted the way that repository formats its own source. Probes with a
 * per-parser filename so the config's `overrides` globs match. Returns an empty
 * object when no `formatConfigRoot` is given or the repository has no config, so
 * the built-in export defaults stay the fallback.
 */
async function resolveDestinationConfig(
  prettier: PrettierApi,
  formatConfigRoot: string | undefined,
  parser: Options["parser"],
): Promise<Options> {
  if (!formatConfigRoot || typeof prettier.resolveConfig !== "function") {
    return {}
  }

  const extension = PARSER_PROBE_EXTENSION[String(parser)] ?? ".ts"
  const probePath = `${formatConfigRoot.replace(/\/+$/, "")}/${extension}`

  if (!resolvedConfigByProbe.has(probePath)) {
    try {
      resolvedConfigByProbe.set(probePath, await prettier.resolveConfig(probePath))
    } catch {
      resolvedConfigByProbe.set(probePath, null)
    }
  }

  return resolvedConfigByProbe.get(probePath) ?? {}
}

/**
 * Formats best effort, returning the input unchanged when Prettier is
 * unavailable. `overrides` sets the parser and any per-formatter option. When
 * `formatConfigRoot` is given, the destination repository's Prettier config
 * layers over the export defaults so output matches that repository. The
 * import-sort plugin is added only when it resolves.
 */
export async function formatWithPrettier(
  content: string,
  overrides: Options,
  formatConfigRoot?: string,
): Promise<string> {
  const prettier = await loadPrettier()

  if (!prettier) return content

  const plugins = await resolveSortPlugins()
  const destinationConfig = await resolveDestinationConfig(
    prettier,
    formatConfigRoot,
    overrides.parser,
  )

  return prettier.format(content, {
    ...exportPrettierConfig,
    ...destinationConfig,
    ...overrides,
    plugins,
  })
}
