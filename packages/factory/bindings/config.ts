import type { BindingsConfig, BindingsConfigInput } from "./types"

const DEFAULT_COMPONENTS_FOLDER = "seldon"

const DEFAULT_COMPONENT_IMPORT_PREFIX = "@seldon/components/"

const DEFAULT_EXTENSIONS = [".ts", ".tsx", ".vue"]

/**
 * Folders that never hold consumer code. The components folder is excluded
 * separately, which also covers the `scripts/` folder emitted inside it, so a
 * generated tree never reports itself as a consumer of its own refs.
 */
const ALWAYS_EXCLUDED = ["node_modules", "dist", "build", ".next", ".nuxt", ".git", "coverage"]

/**
 * Fills a partial config with defaults.
 *
 * The components folder is always excluded from the scan, and always contributes
 * an import prefix, so a consumer that imports through a path alias and one that
 * imports by relative path are both recognized.
 */
export function resolveBindingsConfig(input: BindingsConfigInput): BindingsConfig {
  const componentsFolder = trimSlashes(input.componentsFolder ?? DEFAULT_COMPONENTS_FOLDER)

  const componentImportPrefixes = input.componentImportPrefixes ?? [
    DEFAULT_COMPONENT_IMPORT_PREFIX,
    `${componentsFolder}/`,
  ]

  const exclude = [componentsFolder, ...ALWAYS_EXCLUDED, ...(input.exclude ?? [])].map(trimSlashes)

  return {
    framework: input.framework,
    componentsFolder,
    componentImportPrefixes,
    include: (input.include ?? []).map(trimSlashes),
    exclude: Array.from(new Set(exclude)),
    extensions: input.extensions ?? DEFAULT_EXTENSIONS,
  }
}

/**
 * Reports whether a file belongs to the scan. A path is in when its extension is
 * scannable, no excluded folder covers it, and either no includes were given or
 * one of them covers it.
 */
export function isScannablePath(path: string, config: BindingsConfig): boolean {
  if (!config.extensions.some((extension) => path.endsWith(extension))) return false
  if (config.exclude.some((folder) => isUnderFolder(path, folder))) return false
  if (config.include.length === 0) return true

  return config.include.some((folder) => isUnderFolder(path, folder))
}

/**
 * Reports whether an import specifier points into the generated components
 * folder. A relative specifier is matched on its tail, since the number of `../`
 * steps depends on how deep the consuming file sits.
 */
export function isComponentImport(specifier: string, config: BindingsConfig): boolean {
  return config.componentImportPrefixes.some((prefix) => {
    if (specifier.startsWith(prefix)) return true

    return specifier.startsWith(".") && specifier.includes(`/${prefix}`)
  })
}

function isUnderFolder(path: string, folder: string): boolean {
  if (folder.length === 0) return false

  return path === folder || path.startsWith(`${folder}/`)
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+/, "").replace(/\/+$/, "")
}
