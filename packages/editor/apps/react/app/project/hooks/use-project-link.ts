import {
  deleteProjectLink,
  getLinkPermission,
  getProjectLink,
  isProjectLinkSupported,
  requestLinkPermission,
  resolveComponentsDirectory,
  saveProjectLink,
} from "@seldon/editor/lib/storage/project-link-store"
import { useEffect } from "react"
import { create } from "zustand"

import type { ProjectLink } from "@seldon/editor/lib/storage/project-link-store"

/**
 * Tracks the folder the open workspace was last exported into, so the editor can
 * read what the user's project reports back.
 *
 * `needs-permission` is the normal state after a reload. A stored handle outlives
 * the session but its grant does not, and browsers only re-grant during a user
 * gesture, so the link stays dormant until an interaction calls
 * `grantProjectLinkPermission`.
 */
export type ProjectLinkStatus = "unsupported" | "unlinked" | "needs-permission" | "linked"

interface ProjectLinkState {
  workspaceId: string | null
  link: ProjectLink | null
  permission: PermissionState | null
}

const useStore = create<ProjectLinkState>()(() => ({
  workspaceId: null,
  link: null,
  permission: null,
}))

/** Reads the stored link for a workspace and its current grant, without prompting. */
export async function loadProjectLink(workspaceId: string): Promise<void> {
  const link = await getProjectLink(workspaceId)

  if (!link) {
    useStore.setState({ workspaceId, link: null, permission: null })

    return
  }

  useStore.setState({ workspaceId, link, permission: await getLinkPermission(link) })
}

/**
 * Records the components folder an export just wrote, which is the moment the
 * link becomes true. The handle is stored for reading only.
 */
export async function linkExportedFolder(
  workspaceId: string,
  root: FileSystemDirectoryHandle,
  componentsFolder: string,
): Promise<void> {
  const directory = await resolveComponentsDirectory(root, componentsFolder)

  if (!directory) return

  const link: ProjectLink = {
    directory,
    componentsFolder,
    linkedAt: new Date().toISOString(),
  }

  await saveProjectLink(workspaceId, link)

  useStore.setState({ workspaceId, link, permission: await getLinkPermission(link) })
}

/**
 * Re-grants read access to the stored folder. Call this from a user gesture, such
 * as turning on an overlay that reads the linked folder, because a browser
 * rejects the prompt outside one.
 */
export async function grantProjectLinkPermission(): Promise<boolean> {
  const { link } = useStore.getState()

  if (!link) return false

  const permission = await requestLinkPermission(link)

  useStore.setState({ permission })

  return permission === "granted"
}

export async function unlinkProject(): Promise<void> {
  const { workspaceId } = useStore.getState()

  if (workspaceId) await deleteProjectLink(workspaceId)

  useStore.setState({ link: null, permission: null })
}

function getStatus(
  link: ProjectLink | null,
  permission: PermissionState | null,
): ProjectLinkStatus {
  if (!isProjectLinkSupported()) return "unsupported"
  if (!link) return "unlinked"

  return permission === "granted" ? "linked" : "needs-permission"
}

/**
 * The link for a workspace, loaded on first render and whenever the workspace
 * changes.
 */
export function useProjectLink(workspaceId: string | null) {
  const link = useStore((state) => state.link)
  const permission = useStore((state) => state.permission)
  const loadedId = useStore((state) => state.workspaceId)

  useEffect(() => {
    if (workspaceId && workspaceId !== loadedId) void loadProjectLink(workspaceId)
  }, [workspaceId, loadedId])

  return {
    link,
    status: getStatus(link, permission),
    grantPermission: grantProjectLinkPermission,
  }
}
