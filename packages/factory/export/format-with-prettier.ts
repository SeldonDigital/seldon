import { exportPrettierConfig } from "./export-prettier-config"

import type { Options } from "prettier"

/** The Prettier surface the export uses. Kept minimal so the load can stay best effort. */
interface PrettierApi {
  format(source: string, options?: Options): Promise<string>
  resolveConfig?(filePath: string, options?: { editorconfig?: boolean }): Promise<Options | null>
}

/** Destination Prettier settings an export can honor. */
export interface ExportFormatContext {
  formatConfigRoot?: string
  formatConfig?: Options | Record<string, unknown>
  skipFormat?: boolean
}

/** Extension probed per parser so Prettier applies the destination config's per-glob overrides. */
const PARSER_PROBE_EXTENSION: Record<string, string> = {
  typescript: ".tsx",
  css: ".css",
  json: ".json",
  vue: ".vue",
  html: ".html",
}

let prettierModule: PrettierApi | null | undefined

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

/** Accepts the legacy root-path argument or a full format context. */
export function toFormatContext(format?: string | ExportFormatContext): ExportFormatContext {
  if (typeof format === "string") return { formatConfigRoot: format }

  return format ?? {}
}

/**
 * Resolves the destination repository's Prettier config so a generated file
 * lands formatted the way that repository formats its own source. An explicit
 * `formatConfig` wins, so the editor can send the picked project's config
 * without a Node path. Otherwise probes `formatConfigRoot`. Returns an empty
 * object when neither is set, so the built-in export defaults stay the fallback.
 *
 * Does not load plugins from the running process. The Seldon editor lives in a
 * repo that has `@ianvs/prettier-plugin-sort-imports`. Applying that plugin to
 * a consumer export rewrites every import block and fights CLI and MCP output.
 */
async function resolveDestinationConfig(
  prettier: PrettierApi,
  format: ExportFormatContext,
  parser: Options["parser"],
): Promise<Options> {
  if (format.formatConfig) return format.formatConfig as Options

  if (!format.formatConfigRoot || typeof prettier.resolveConfig !== "function") {
    return {}
  }

  const extension = PARSER_PROBE_EXTENSION[String(parser)] ?? ".ts"
  const probePath = `${format.formatConfigRoot.replace(/\/+$/, "")}/${extension}`

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
 * a destination config is given, it layers over the export defaults so output
 * matches that repository. Plugins come only from that destination config.
 */
export async function formatWithPrettier(
  content: string,
  overrides: Options,
  format?: string | ExportFormatContext,
): Promise<string> {
  const prettier = await loadPrettier()

  if (!prettier) return content

  const context = toFormatContext(format)
  const destinationConfig = await resolveDestinationConfig(prettier, context, overrides.parser)

  return prettier.format(content, {
    ...exportPrettierConfig,
    ...destinationConfig,
    ...overrides,
  })
}
