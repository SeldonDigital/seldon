/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

const DEFAULT_COMPONENTS_FOLDER = "sdn"
const DEFAULT_COMPONENT_IMPORT_PREFIX = "@seldon/components/"
/**
 * Extensions each framework's consumers are written in. A React scan leaves
 * `.vue` out, so it never needs the Vue compiler. A Vue scan keeps `.ts`, since
 * a Vue project holds plain TypeScript consumers too.
 */
const DEFAULT_EXTENSIONS = {
  react: [".ts", ".tsx"],
  vue: [".ts", ".tsx", ".vue"],
}
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
export function resolveBindingsConfig(input) {
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
    extensions: input.extensions ?? DEFAULT_EXTENSIONS[input.framework],
  }
}
/**
 * Reports whether a file belongs to the scan. A path is in when its extension is
 * scannable, no excluded folder covers it, and either no includes were given or
 * one of them covers it.
 */
export function isScannablePath(path, config) {
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
export function isComponentImport(specifier, config) {
  return config.componentImportPrefixes.some((prefix) => {
    if (specifier.startsWith(prefix)) return true
    return specifier.startsWith(".") && specifier.includes(`/${prefix}`)
  })
}
function isUnderFolder(path, folder) {
  if (folder.length === 0) return false
  return path === folder || path.startsWith(`${folder}/`)
}
function trimSlashes(value) {
  return value.replace(/^\/+/, "").replace(/\/+$/, "")
}
