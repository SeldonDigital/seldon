import {
  deleteProjectLink,
  getLinkPermission,
  getProjectLink,
  isProjectLinkSupported,
  pickComponentsFolder,
  requestLinkPermission,
  resolveComponentsDirectory,
  saveProjectLink,
} from "@seldon/editor/lib/storage/project-link-store"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

import type {
  LinkWorkspaceOutcome,
  ProjectLink,
} from "@seldon/editor/lib/storage/project-link-store"

/**
 * Tracks the folder the open workspace was last exported into, so the editor can
 * read what the user's project reports back.
 *
 * `needs-permission` is the normal state after a reload. A stored handle outlives
 * the session but its grant does not, and browsers only re-grant during a user
 * gesture, so the link stays dormant until an interaction calls `grantPermission`.
 *
 * Mirrors the React `use-project-link`.
 */
export type ProjectLinkStatus = "unsupported" | "unlinked" | "needs-permission" | "linked"

export const useProjectLinkStore = defineStore("project-link", () => {
  const workspaceId = ref<string | null>(null)
  const link = ref<ProjectLink | null>(null)
  const permission = ref<PermissionState | null>(null)

  const status = computed<ProjectLinkStatus>(() => {
    if (!isProjectLinkSupported()) return "unsupported"
    if (!link.value) return "unlinked"

    return permission.value === "granted" ? "linked" : "needs-permission"
  })

  /** Reads the stored link for a workspace and its current grant, without prompting. */
  async function load(id: string): Promise<void> {
    const stored = await getProjectLink(id)

    workspaceId.value = id

    if (!stored) {
      link.value = null
      permission.value = null

      return
    }

    link.value = stored
    permission.value = await getLinkPermission(stored)
  }

  /** Stores a link and makes it the current one. */
  async function saveLink(
    id: string,
    directory: FileSystemDirectoryHandle,
    componentsFolder: string,
  ): Promise<void> {
    const next: ProjectLink = {
      directory,
      componentsFolder,
      linkedAt: new Date().toISOString(),
    }

    await saveProjectLink(id, next)

    workspaceId.value = id
    link.value = next
    permission.value = await getLinkPermission(next)
  }

  /**
   * Records the components folder an export just wrote, which is the moment the
   * link becomes true. The handle is stored for reading only.
   *
   * Throws when the folder the export just named cannot be opened. The export
   * itself has already succeeded by then, and a link the editor cannot make is
   * worth saying out loud, because every ref card stays empty without it.
   */
  async function linkExportedFolder(
    id: string,
    root: FileSystemDirectoryHandle,
    componentsFolder: string,
  ): Promise<void> {
    const directory = await resolveComponentsDirectory(root, componentsFolder)

    if (!directory) {
      throw new Error(`Export finished, but ${componentsFolder} could not be opened to link it.`)
    }

    await saveLink(id, directory, componentsFolder)
  }

  /**
   * Links a workspace to a components folder the user picks.
   *
   * This is the way a link gets made when the export did not make one, such as an
   * export run from the command line or a project that already holds generated
   * components. The pick may be the components folder or a project root above it,
   * and a search settles which.
   */
  async function linkWorkspaceFolder(id: string): Promise<LinkWorkspaceOutcome> {
    const { match, problem } = await pickComponentsFolder()

    if (!match) return { ok: false, message: problem }

    await saveLink(id, match.directory, match.path)

    return { ok: true, message: `Linked ${match.path}.` }
  }

  /**
   * Re-grants read access to the stored folder. Call this from a user gesture,
   * such as turning on an overlay that reads the linked folder, because a browser
   * rejects the prompt outside one.
   */
  async function grantPermission(): Promise<boolean> {
    const current = link.value

    if (!current) return false

    permission.value = await requestLinkPermission(current)

    return permission.value === "granted"
  }

  async function unlink(): Promise<void> {
    const id = workspaceId.value

    if (id) await deleteProjectLink(id)

    link.value = null
    permission.value = null
  }

  return {
    workspaceId,
    link,
    permission,
    status,
    load,
    linkExportedFolder,
    linkWorkspaceFolder,
    grantPermission,
    unlink,
  }
})
