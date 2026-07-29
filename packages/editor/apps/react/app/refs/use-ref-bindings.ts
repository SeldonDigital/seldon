import { useProjectLink } from "@app/project/hooks/use-project-link"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { collectNodeRefs } from "@seldon/editor/lib/refs/collect-node-refs"
import { joinRefsAndBindings } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import { readBindingsManifest } from "@seldon/editor/lib/refs/read-bindings-manifest"
import { readRefsRegistry } from "@seldon/editor/lib/refs/read-refs-registry"
import {
  getLinkPermission,
  getProjectLink,
  readLinkedTextFile,
  requestLinkPermission,
} from "@seldon/editor/lib/storage/project-link-store"
import { useEffect, useMemo } from "react"
import { create } from "zustand"

import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { ValidatedBindings } from "@seldon/editor/lib/refs/read-bindings-manifest"
import type { ValidatedRegistry } from "@seldon/editor/lib/refs/read-refs-registry"
import type { ProjectLink } from "@seldon/editor/lib/storage/project-link-store"

/** Both files sit under the linked components folder. */
const REGISTRY_PATH = "refs/registry.json"
const MANIFEST_PATH = "refs/bindings.json"

/**
 * What was read from the linked project, held once for the whole editor.
 *
 * A store rather than component state, because the sidebar and the canvas overlay
 * show the same bindings. Reading costs a directory permission that a browser only
 * grants during a gesture, so one load has to serve every surface.
 */
interface RefBindingsState {
  workspaceId: string | null
  registry: ValidatedRegistry | null
  bindings: ValidatedBindings | null
  problem: string | null
  loading: boolean
}

const useStore = create<RefBindingsState>()(() => ({
  workspaceId: null,
  registry: null,
  bindings: null,
  problem: null,
  loading: false,
}))

/**
 * Reads the refs registry and the binding manifest from the linked folder.
 *
 * Call this from a user gesture. A browser only re-grants a directory permission
 * during one, and the permission is requested here when it has lapsed.
 *
 * Returns whether both arrived. A partial read still keeps what it got: the
 * registry alone describes every view, which is worth showing even when no
 * manifest has been written yet.
 */
export async function loadRefBindings(workspaceId: string): Promise<boolean> {
  const link = await getProjectLink(workspaceId)

  if (!link) {
    useStore.setState({
      workspaceId,
      problem: "No exported folder is linked to this workspace yet.",
    })

    return false
  }

  useStore.setState({ workspaceId, loading: true })

  try {
    if (!(await hasReadPermission(link))) {
      useStore.setState({ problem: "Reading the linked folder needs permission." })

      return false
    }

    const registryText = await readLinkedTextFile(link, REGISTRY_PATH)

    if (registryText === null) {
      useStore.setState({
        problem: "No refs registry found in the linked folder. Export again to write one.",
      })

      return false
    }

    const registryResult = readRefsRegistry(registryText)

    if (!registryResult.ok) {
      useStore.setState({ registry: null, bindings: null, problem: registryResult.reason })

      return false
    }

    const registry = registryResult.registry
    const manifestText = await readLinkedTextFile(link, MANIFEST_PATH)

    if (manifestText === null) {
      useStore.setState({
        registry,
        bindings: null,
        problem: "No binding manifest found. Run the bindings script in your project to write one.",
      })

      return false
    }

    const manifestResult = readBindingsManifest(manifestText)

    if (!manifestResult.ok) {
      useStore.setState({ registry, bindings: null, problem: manifestResult.reason })

      return false
    }

    useStore.setState({
      registry,
      bindings: manifestResult.bindings,
      problem: getFrameworkMismatch(registry, manifestResult.bindings),
    })

    return true
  } finally {
    useStore.setState({ loading: false })
  }
}

/** Drops what was read, so nothing from one project shows against another. */
export function clearRefBindings(): void {
  useStore.setState({ registry: null, bindings: null, problem: null })
}

/** Asks for the folder permission only when the standing grant has lapsed. */
async function hasReadPermission(link: ProjectLink): Promise<boolean> {
  if ((await getLinkPermission(link)) === "granted") return true

  return (await requestLinkPermission(link)) === "granted"
}

/**
 * Joins the refs the open workspace declares with the views the export generated
 * and the consumers the manifest reports.
 *
 * The workspace half is always available, so refs list even with no link at all.
 * That matters: an unbound ref is still worth showing, and it is the state every
 * ref starts in. The other two halves arrive only after `loadRefBindings`.
 */
export function useRefBindings() {
  const workspaceId = useWorkspaceId()
  const { workspace } = useWorkspace()
  const { status } = useProjectLink(workspaceId)
  const { registry, bindings, problem, loading, workspaceId: loadedFor } = useStore()

  // What was read against one project says nothing about the next one.
  useEffect(() => {
    if (loadedFor && loadedFor !== workspaceId) {
      clearRefBindings()
    }
  }, [loadedFor, workspaceId])

  const nodeRefs = useMemo(() => collectNodeRefs(workspace), [workspace])
  const refBindings: RefBinding[] = useMemo(
    () => joinRefsAndBindings({ nodeRefs, registry, bindings }),
    [nodeRefs, registry, bindings],
  )

  return {
    refBindings,
    mode: bindings?.mode ?? null,
    droppedEntries: (registry?.droppedEntries ?? 0) + (bindings?.droppedEntries ?? 0),
    scannedFiles: bindings?.scannedFiles ?? 0,
    linkStatus: status,
    loading,
    problem,
  }
}

/**
 * The two files should describe one project. When they disagree on the target,
 * the manifest was scanned somewhere other than where the export was written, so
 * the consumers on screen may belong to another app.
 */
function getFrameworkMismatch(
  registry: ValidatedRegistry,
  bindings: ValidatedBindings,
): string | null {
  if (registry.framework === bindings.framework) return null

  return `The export targeted ${registry.framework} but the manifest scanned ${bindings.framework}. They may describe different projects.`
}
