import { createStore, del, get, set } from "idb-keyval"
import { REGISTRY_PATH } from "../refs/linked-refs"
import { queryHandlePermission, requestHandlePermission } from "./handle-permission"

import type { UseStore } from "idb-keyval"

/**
 * Per-workspace link to the folder a workspace was last exported into.
 *
 * The link exists so the editor can read what the user's own project reports
 * back, starting with the binding manifest their scripts write. It is only ever
 * read through. Nothing in the editor writes to a linked folder; exporting picks
 * its own directory every time.
 *
 * A directory handle cannot go in localStorage, because it survives only through
 * structured clone. So this is the one piece of editor state kept in IndexedDB.
 * Permission is a separate matter from storage: a handle outlives a reload but
 * its grant does not, so a link comes back needing permission again and the user
 * has to re-grant it through a gesture. See `getLinkPermission`.
 */

let store: UseStore | undefined

/**
 * Opens the store on first use. Creating it at module scope would reach for
 * `indexedDB` as soon as this module loads, which fails anywhere the database is
 * absent. Every caller checks support first.
 */
function getStore(): UseStore {
  store ??= createStore("seldon", "project-links")

  return store
}

export interface ProjectLink {
  /** Handle for the components folder itself, so a link can see nothing else. */
  directory: FileSystemDirectoryHandle
  /** Components folder path relative to the project root, as exported. */
  componentsFolder: string
  linkedAt: string
}

/** Whether this browser can hold a link at all. */
export function isProjectLinkSupported(): boolean {
  return (
    typeof window !== "undefined" && "showDirectoryPicker" in window && "indexedDB" in globalThis
  )
}

export async function getProjectLink(workspaceId: string): Promise<ProjectLink | undefined> {
  if (!isProjectLinkSupported()) return undefined

  try {
    return await get<ProjectLink>(workspaceId, getStore())
  } catch {
    return undefined
  }
}

export async function saveProjectLink(workspaceId: string, link: ProjectLink): Promise<void> {
  if (!isProjectLinkSupported()) return

  try {
    await set(workspaceId, link, getStore())
  } catch {
    // A link is a convenience. Losing it must never fail the export that set it.
  }
}

export async function deleteProjectLink(workspaceId: string): Promise<void> {
  if (!isProjectLinkSupported()) return

  try {
    await del(workspaceId, getStore())
  } catch {
    // Nothing to recover: the link is already unusable.
  }
}

/**
 * Current grant on a link, without prompting. A stored handle reports `prompt`
 * after a reload, which means the link is intact but dormant until a gesture
 * re-grants it.
 */
export function getLinkPermission(link: ProjectLink): Promise<PermissionState> {
  return queryHandlePermission(link.directory, "read")
}

/**
 * Asks for read access on a link. Browsers only allow this during a user
 * gesture, so call it from an interaction rather than on load.
 */
export function requestLinkPermission(link: ProjectLink): Promise<PermissionState> {
  return requestHandlePermission(link.directory, "read")
}

/**
 * Reads one text file from a linked folder, by a path relative to it. Returns
 * null when the file is absent, which is the normal state before the user has
 * run the scripts.
 */
export async function readLinkedTextFile(
  link: ProjectLink,
  relativePath: string,
): Promise<string | null> {
  const file = await getFileHandleAt(link.directory, relativePath)

  if (!file) return null

  try {
    return await (await file.getFile()).text()
  } catch {
    return null
  }
}

/** The one components folder a pick resolved to, or why it resolved to none. */
export interface ComponentsFolderPick {
  match: ComponentsFolderMatch | null
  problem: string | null
}

/** A folder the search recognized as a components folder. */
export interface ComponentsFolderMatch {
  directory: FileSystemDirectoryHandle
  /** Path below the picked folder, or the folder's own name when it is the match. */
  path: string
}

/**
 * How a link attempt ended, for the surface that started it.
 *
 * `message` is null when there is nothing to report, which is what a cancelled
 * pick leaves behind.
 */
export interface LinkWorkspaceOutcome {
  ok: boolean
  message: string | null
}

/**
 * Asks the user for a folder and resolves it to the one components folder inside
 * it.
 *
 * A cancel and an unsupported browser both come back empty with no problem to
 * report, because neither is something the user needs telling. Anything else that
 * leaves the editor without a folder comes back with the sentence to show.
 */
export async function pickComponentsFolder(): Promise<ComponentsFolderPick> {
  let root: FileSystemDirectoryHandle | null = null

  try {
    root = await pickProjectDirectory()
  } catch {
    // The picker throws when it is dismissed, which is not a problem to report.
    return { match: null, problem: null }
  }

  if (!root) return { match: null, problem: null }

  const matches = await findComponentsDirectories(root)

  if (matches.length === 0) {
    return {
      match: null,
      problem: `No components folder found in ${root.name}. Export components there first.`,
    }
  }

  if (matches.length > 1) {
    const paths = matches.map((match) => match.path).join(", ")

    return {
      match: null,
      problem: `${root.name} holds more than one components folder: ${paths}. Pick one of them.`,
    }
  }

  return { match: matches[0], problem: null }
}

/**
 * Opens the folder picker for read access, which is all a link ever needs. An
 * export picks its own folder for writing, so the two never share a pick.
 *
 * Returns null when the browser cannot pick a folder, and throws when the user
 * dismisses the picker, which is how the API reports a cancel.
 */
async function pickProjectDirectory(): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
    return null
  }

  const showDirectoryPicker = (
    window as Window & {
      showDirectoryPicker: (options?: {
        mode?: "read" | "readwrite"
      }) => Promise<FileSystemDirectoryHandle>
    }
  ).showDirectoryPicker

  return showDirectoryPicker({ mode: "read" })
}

/**
 * Folders the search never descends into. A project keeps its dependencies and
 * its build output under these, and an export never writes a components folder
 * inside one.
 */
const SKIPPED_FOLDERS = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".git",
  "coverage",
])

/**
 * How far below the picked folder the search looks. Two levels reach the usual
 * homes, `sdn` and `src/sdn`, and a third reaches a package in a monorepo, such
 * as `apps/web/sdn`. Past that a search costs more than asking the user to pick
 * the folder itself.
 */
const MAX_SEARCH_DEPTH = 3

/**
 * Finds the components folders below a picked folder, nearest first.
 *
 * The pick may be the components folder or a project root above it, because a
 * user who exported outside the editor has no reason to know which one the
 * editor wants. A folder counts as a components folder when it holds the refs
 * registry, which is the file a link exists to read.
 *
 * Every match at the nearest depth is returned rather than the first one found.
 * A monorepo can hold one per app, and guessing between them would link the
 * wrong project silently.
 */
async function findComponentsDirectories(
  root: FileSystemDirectoryHandle,
): Promise<ComponentsFolderMatch[]> {
  if (await hasRefsRegistry(root)) {
    return [{ directory: root, path: root.name }]
  }

  const matches: ComponentsFolderMatch[] = []
  let level: ComponentsFolderMatch[] = [{ directory: root, path: "" }]

  for (let depth = 0; depth < MAX_SEARCH_DEPTH && matches.length === 0; depth += 1) {
    const next: ComponentsFolderMatch[] = []

    for (const parent of level) {
      for (const child of await readSubdirectories(parent)) {
        if (await hasRefsRegistry(child.directory)) matches.push(child)
        else next.push(child)
      }
    }

    level = next
  }

  return matches
}

/** Whether a folder holds the refs registry, which is what marks a components folder. */
async function hasRefsRegistry(directory: FileSystemDirectoryHandle): Promise<boolean> {
  return (await getFileHandleAt(directory, REGISTRY_PATH)) !== null
}

/**
 * A directory handle that can be walked. The DOM types this project builds
 * against declare the lookups but not the async iteration, which every browser
 * that supports the picker also supports.
 */
type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  values: () => AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>
}

/** The child folders of one folder that are worth searching, with paths carried down. */
async function readSubdirectories(parent: ComponentsFolderMatch): Promise<ComponentsFolderMatch[]> {
  const children: ComponentsFolderMatch[] = []
  const directory = parent.directory as IterableDirectoryHandle

  try {
    for await (const entry of directory.values()) {
      if (entry.kind !== "directory") continue
      if (SKIPPED_FOLDERS.has(entry.name) || entry.name.startsWith(".")) continue

      children.push({
        directory: entry,
        path: parent.path ? `${parent.path}/${entry.name}` : entry.name,
      })
    }
  } catch {
    // A folder that will not open holds nothing the search can use. Skipping it
    // keeps one unreadable folder from ending the whole search.
  }

  return children
}

/**
 * Walks a relative path to the file at the end of it. Returns null when any
 * segment is missing, which every caller reads as the file not being there.
 */
async function getFileHandleAt(
  directory: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<FileSystemFileHandle | null> {
  const segments = toSegments(relativePath)

  if (!segments || segments.length === 0) return null

  const fileName = segments.pop() as string

  try {
    let current = directory

    for (const segment of segments) {
      current = await current.getDirectoryHandle(segment)
    }

    return await current.getFileHandle(fileName)
  } catch {
    return null
  }
}

/**
 * Resolves the components folder inside a picked project root. The folder may be
 * nested, such as `src/sdn`, so each segment is walked.
 */
export async function resolveComponentsDirectory(
  root: FileSystemDirectoryHandle,
  componentsFolder: string,
): Promise<FileSystemDirectoryHandle | null> {
  const segments = toSegments(componentsFolder)

  if (!segments || segments.length === 0) return null

  try {
    let directory = root

    for (const segment of segments) {
      directory = await directory.getDirectoryHandle(segment)
    }

    return directory
  } catch {
    return null
  }
}

/**
 * Splits a relative path, refusing one that tries to climb out of the folder.
 * Dropping a `..` instead would quietly resolve to a different file than the
 * caller named, so an attempt to climb reads nothing at all.
 */
function toSegments(relativePath: string): string[] | null {
  const segments = relativePath.split("/").filter((segment) => segment && segment !== ".")

  return segments.some((segment) => segment === "..") ? null : segments
}
