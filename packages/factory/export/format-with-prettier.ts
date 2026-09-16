import { exportPrettierConfig } from "./export-prettier-config"

import type { Options } from "prettier"

/** The Prettier surface the export uses. Kept minimal so the load can stay best effort. */
interface PrettierApi {
  format(source: string, options?: Options): Promise<string>
}

/** Format flags a caller can pass through. Destination Prettier configs are ignored. */
export interface ExportFormatContext {
  skipFormat?: boolean
  formatConfigRoot?: string
  formatConfig?: Options | Record<string, unknown>
}

let prettierModule: PrettierApi | null | undefined

/**
 * Loads the Prettier that ships with the factory. Every export surface uses
 * this copy and {@link exportPrettierConfig}, so Editor, CLI, and MCP emit the
 * same text. A consumer project's Prettier install and config are never used.
 */
async function loadPrettier(): Promise<PrettierApi> {
  if (prettierModule) return prettierModule

  try {
    prettierModule = (await import("prettier")) as unknown as PrettierApi
  } catch {
    throw new Error(
      "Prettier is required to format an export. It ships with @seldon/factory. Reinstall that package.",
    )
  }

  return prettierModule
}

/**
 * Formats with the factory Prettier options only. `overrides` sets the parser
 * and any per-formatter option. Destination configs are ignored so every
 * surface writes the same files.
 */
export async function formatWithPrettier(
  content: string,
  overrides: Options,
  _format?: string | ExportFormatContext,
): Promise<string> {
  const prettier = await loadPrettier()

  return prettier.format(content, {
    ...exportPrettierConfig,
    ...overrides,
  })
}
