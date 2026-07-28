import { createStore, del, get, set } from "idb-keyval"

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

type PermissionMode = "read" | "readwrite"

/**
 * `queryPermission` and `requestPermission` are not in the DOM lib types, so the
 * handle is widened where they are called, the same way the directory picker is.
 */
type HandleWithPermission = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor: { mode: PermissionMode }) => Promise<PermissionState>
  requestPermission?: (descriptor: { mode: PermissionMode }) => Promise<PermissionState>
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
export async function getLinkPermission(link: ProjectLink): Promise<PermissionState> {
  const handle = link.directory as HandleWithPermission

  if (!handle.queryPermission) return "granted"

  try {
    return await handle.queryPermission({ mode: "read" })
  } catch {
    return "denied"
  }
}

/**
 * Asks for read access on a link. Browsers only allow this during a user
 * gesture, so call it from an interaction rather than on load.
 */
export async function requestLinkPermission(link: ProjectLink): Promise<PermissionState> {
  const handle = link.directory as HandleWithPermission

  if (!handle.requestPermission) return "granted"

  try {
    return await handle.requestPermission({ mode: "read" })
  } catch {
    return "denied"
  }
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
  const segments = toSegments(relativePath)

  if (!segments || segments.length === 0) return null

  const fileName = segments.pop() as string

  try {
    let directory = link.directory

    for (const segment of segments) {
      directory = await directory.getDirectoryHandle(segment)
    }

    const file = await directory.getFileHandle(fileName)

    return await (await file.getFile()).text()
  } catch {
    return null
  }
}

/**
 * Resolves the components folder inside a picked project root. The folder may be
 * nested, such as `src/seldon`, so each segment is walked.
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
