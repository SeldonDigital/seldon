import {
  deleteProjectLink,
  getLinkPermission,
  getProjectLink,
  isProjectLinkSupported,
  requestLinkPermission,
  resolveComponentsDirectory,
  saveProjectLink,
} from "@seldon/editor/lib/storage/project-link-store"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

import type { ProjectLink } from "@seldon/editor/lib/storage/project-link-store"

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

  /**
   * Records the components folder an export just wrote, which is the moment the
   * link becomes true. The handle is stored for reading only.
   */
  async function linkExportedFolder(
    id: string,
    root: FileSystemDirectoryHandle,
    componentsFolder: string,
  ): Promise<void> {
    const directory = await resolveComponentsDirectory(root, componentsFolder)

    if (!directory) return

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
    grantPermission,
    unlink,
  }
})
