import { EXPORT_MANIFEST_FILENAME, parseExportManifest } from "@seldon/factory/export/manifest"
import { FRAMEWORK_LAYOUTS } from "@seldon/factory/export/presets"
import { kebabCase } from "change-case"

import type { ExportManifest } from "@seldon/factory/export/manifest"
import type { FrameworkId } from "@seldon/factory/export/presets"
import type { PlatformId } from "@seldon/factory/export/types"

/** Folders a project scan never enters. */
const SKIP_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  ".next",
  ".nuxt",
  "coverage",
  ".turbo",
  "out",
])

/** How deep to walk for a components folder such as `decks/sdn`. */
const MAX_SCAN_DEPTH = 3

const SOURCE_FILE = /^(.+)\.(react|vue|html)\.json$/

const LAYOUTS_BY_FOLDER_LENGTH = Object.entries(FRAMEWORK_LAYOUTS).sort(
  (left, right) => right[1].componentsFolder.length - left[1].componentsFolder.length,
) as Array<[FrameworkId, { componentsFolder: string }]>

type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  values: () => AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>
}

export interface ExportRootScan {
  hasOwnedExport: boolean
  framework?: FrameworkId
  platform?: PlatformId
  outputFolder?: string
}

interface FoundManifest {
  directoryPath: string
  manifest: ExportManifest
}

/**
 * Reads App Framework, Component Type, and Export To from a picked project root.
 *
 * An export this workspace already owns wins. That match fills all three fields,
 * including an empty Export To when the layout already names the folder. A root
 * with no owned export only fills App Framework from the app's package file, so
 * a second workspace in the same repo is not forced onto the first export.
 */
export async function scanExportRoot(
  root: FileSystemDirectoryHandle,
  workspaceId?: string | null,
  workspaceLabel?: string | null,
): Promise<ExportRootScan> {
  const manifests = await findManifests(root)
  const owned = workspaceId
    ? manifests.find((entry) => entry.manifest.workspaceId === workspaceId)
    : undefined

  if (owned) {
    const layout = layoutFromComponentsPath(owned.directoryPath)
    const platform = platformFromFiles(owned.manifest.files)

    return {
      hasOwnedExport: true,
      framework: layout.framework,
      ...(platform ? { platform } : {}),
      outputFolder: layout.outputFolder,
    }
  }

  const sourcePlatform = await readSourcePlatform(root, workspaceId, workspaceLabel)
  const framework = await frameworkFromPackage(root)

  if (sourcePlatform) {
    return {
      hasOwnedExport: true,
      platform: sourcePlatform,
      ...(framework ? { framework } : {}),
    }
  }

  return {
    hasOwnedExport: false,
    ...(framework ? { framework } : {}),
  }
}

async function findManifests(
  root: FileSystemDirectoryHandle,
  prefix = "",
  depth = 0,
): Promise<FoundManifest[]> {
  const found: FoundManifest[] = []

  for await (const entry of (root as IterableDirectoryHandle).values()) {
    if (entry.kind === "file" && entry.name === EXPORT_MANIFEST_FILENAME) {
      const text = await (await (entry as FileSystemFileHandle).getFile()).text()
      const manifest = parseExportManifest(text)

      if (manifest) found.push({ directoryPath: prefix, manifest })
      continue
    }

    if (entry.kind !== "directory") continue
    if (SKIP_DIRECTORIES.has(entry.name)) continue
    if (depth >= MAX_SCAN_DEPTH) continue

    const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name
    const nested = await findManifests(entry as FileSystemDirectoryHandle, nextPrefix, depth + 1)

    found.push(...nested)
  }

  return found
}

async function readSourcePlatform(
  root: FileSystemDirectoryHandle,
  workspaceId?: string | null,
  workspaceLabel?: string | null,
): Promise<PlatformId | undefined> {
  let directory: FileSystemDirectoryHandle

  try {
    directory = await root.getDirectoryHandle(".seldon")
  } catch {
    return undefined
  }

  const expectedName = workspaceLabel ? kebabCase(workspaceLabel) : ""

  for await (const entry of (directory as IterableDirectoryHandle).values()) {
    if (entry.kind !== "file") continue

    const match = SOURCE_FILE.exec(entry.name)

    if (!match) continue

    const platform = match[2] as PlatformId

    if (expectedName && match[1] === expectedName) return platform
    if (!workspaceId) continue

    try {
      const text = await (await (entry as FileSystemFileHandle).getFile()).text()
      const parsed = JSON.parse(text) as { metadata?: { id?: string } }

      if (parsed.metadata?.id === workspaceId) return platform
    } catch {
      // Skip a file that will not parse.
    }
  }

  return undefined
}

async function frameworkFromPackage(
  root: FileSystemDirectoryHandle,
): Promise<FrameworkId | undefined> {
  try {
    const handle = await root.getFileHandle("package.json")
    const text = await (await handle.getFile()).text()
    const parsed = JSON.parse(text) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const deps = { ...parsed.dependencies, ...parsed.devDependencies }

    if (deps.next) return "next"
    if (deps.nuxt) return "nuxt"
    if (deps.astro) return "astro"
    if (deps["@sveltejs/kit"]) return "sveltekit"
    if (deps["@remix-run/react"] || deps["@remix-run/node"]) return "remix"
    if (deps.vite) return "vite"
  } catch {
    // No package file, or it will not parse.
  }

  return undefined
}

function platformFromFiles(files: string[]): PlatformId | undefined {
  if (files.some((file) => file.endsWith(".vue"))) return "vue"
  if (files.some((file) => file.endsWith(".tsx"))) return "react"

  if (files.some((file) => file.endsWith(".html") && !file.endsWith("fonts.html"))) {
    return "html"
  }

  return undefined
}

function layoutFromComponentsPath(relative: string): {
  framework: FrameworkId
  outputFolder: string
} {
  for (const [id, layout] of LAYOUTS_BY_FOLDER_LENGTH) {
    const folder = layout.componentsFolder

    if (relative === folder) return { framework: id, outputFolder: "" }

    if (relative.endsWith(`/${folder}`)) {
      return {
        framework: id,
        outputFolder: relative.slice(0, -(folder.length + 1)),
      }
    }
  }

  if (relative === "sdn") return { framework: "none", outputFolder: "" }

  if (relative.endsWith("/sdn")) {
    return { framework: "none", outputFolder: relative.slice(0, -4) }
  }

  return { framework: "none", outputFolder: relative }
}
