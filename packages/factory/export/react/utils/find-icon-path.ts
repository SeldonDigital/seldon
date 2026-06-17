import fs from "node:fs"
import path from "node:path"

import { IconId } from "@seldon/core/icon-sets"

import { getIconComponentName } from "../discovery/get-icon-component-name"

export type ResolvedIconExport = {
  /** Exported component name, taken from the matched catalog file basename */
  componentName: string
  /** Path relative to the icons output directory, without extension */
  relativePath: string
}

/**
 * Normalize a component or file name for tolerant matching: lowercase with
 * all non-alphanumeric characters removed. This absorbs the differences
 * between catalog file names and `pascalCase` output, such as
 * `IconSeldonDeviceTV` vs `IconSeldonDeviceTv` and
 * `IconSeldonBattery0Bar` vs `IconSeldonBattery_0bar`.
 */
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "")
}

const catalogIndexCache = new Map<string, Map<string, ResolvedIconExport>>()

/**
 * Build an index of every icon component file under the icon-sets catalog,
 * keyed by normalized file basename. Cached per catalog directory.
 */
function getCatalogIndex(catalogDir: string): Map<string, ResolvedIconExport> {
  const cached = catalogIndexCache.get(catalogDir)
  if (cached) {
    return cached
  }

  const index = new Map<string, ResolvedIconExport>()

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) {
      return
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        scanDir(fullPath)
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        const componentName = entry.name.replace(/\.tsx$/, "")
        const relativePath = path
          .relative(catalogDir, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.tsx$/, "")
        index.set(normalizeName(componentName), { componentName, relativePath })
      }
    }
  }

  scanDir(catalogDir)
  catalogIndexCache.set(catalogDir, index)
  return index
}

function getCatalogDir(rootDirectory: string): string {
  return path.join(rootDirectory, "packages", "core", "icon-sets", "catalog")
}

/**
 * Resolve an icon id to its catalog file. Matching is case-insensitive and
 * prefix-aware: it tries the full `Icon{PascalCase(id)}` name first, then the
 * id without its set prefix, which covers files like `IconSocialGithub.tsx`
 * for the id `seldon-iconSocialGithub`.
 *
 * Returns null when no catalog file matches, so callers can skip the icon
 * instead of emitting dangling references.
 */
export function resolveIconExport(
  iconId: IconId,
  rootDirectory: string,
): ResolvedIconExport | null {
  if (iconId === "__default__") {
    return { componentName: "IconDefault", relativePath: "IconDefault" }
  }

  const index = getCatalogIndex(getCatalogDir(rootDirectory))

  const candidates = [getIconComponentName(iconId)]
  const dashIndex = iconId.indexOf("-")
  if (dashIndex > 0) {
    const suffix = iconId.slice(dashIndex + 1)
    candidates.push(getIconComponentName(suffix))
  }

  for (const candidate of candidates) {
    const hit = index.get(normalizeName(candidate))
    if (hit) {
      return hit
    }
    // getIconComponentName prefixes "Icon"; ids like "seldon-iconSocialGithub"
    // already carry it, producing "IconIconSocialGithub". Try without the
    // doubled prefix.
    if (candidate.startsWith("IconIcon")) {
      const dedupedHit = index.get(normalizeName(candidate.slice(4)))
      if (dedupedHit) {
        return dedupedHit
      }
    }
  }

  return null
}

/**
 * Absolute path to the catalog source file for a resolved icon.
 */
export function getIconSourcePath(
  resolved: ResolvedIconExport,
  rootDirectory: string,
): string {
  return path.join(getCatalogDir(rootDirectory), `${resolved.relativePath}.tsx`)
}
