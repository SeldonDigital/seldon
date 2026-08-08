import { exportPrettierConfig } from "./export-prettier-config"

import type { Options } from "prettier"

/** The one Prettier entry the export uses. Kept minimal so the load can stay best effort. */
interface PrettierApi {
  format(source: string, options?: Options): Promise<string>
}

let prettierModule: PrettierApi | null | undefined
let sortPlugins: string[] | undefined

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
 * Formats with the export's shared config, best effort. Returns the input
 * unchanged when Prettier is unavailable. `overrides` sets the parser and any
 * per-formatter option. The import-sort plugin is added only when it resolves.
 */
export async function formatWithPrettier(content: string, overrides: Options): Promise<string> {
  const prettier = await loadPrettier()

  if (!prettier) return content

  const plugins = await resolveSortPlugins()

  return prettier.format(content, { ...exportPrettierConfig, ...overrides, plugins })
}
