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

import type { RefBindingsStatus } from "@seldon/editor/lib/refs/describe-binding"
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
 * Prefer calling this from a user gesture. A standing folder grant needs none, so a
 * workspace change reads on its own, but a lapsed grant can only be re-requested
 * during a gesture and otherwise reports the permission problem instead.
 *
 * Returns whether both arrived. A partial read still keeps what it got: the
 * registry alone describes every view, which is worth showing even when no
 * manifest has been written yet.
 */
export async function loadRefBindings(workspaceId: string): Promise<boolean> {
  // Claimed before the first await, so a second caller sees the workspace already taken
  // and stands down. The overlay reads on the gesture that turns it on and again when
  // the workspace changes, and those two can land together.
  useStore.setState({ workspaceId, loading: true })

  const link = await getProjectLink(workspaceId)

  if (!link) {
    useStore.setState({
      loading: false,
      problem: "No exported folder is linked to this workspace yet.",
    })

    return false
  }

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
        problem: "Missing bindings manifest. Run `npm run bindings` to generate.",
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

/**
 * What the read produced, for a surface that reports one ref rather than the list.
 *
 * A selector rather than a slice of `useRefBindings`, because a card reporting one
 * binding would otherwise re-collect every ref and re-run the join to reach two fields
 * none of that work produces.
 */
export function useRefBindingsStatus(): RefBindingsStatus {
  const problem = useStore((state) => state.problem)
  const hasRegistry = useStore((state) => state.registry !== null)

  return useMemo(() => ({ problem, hasRegistry }), [problem, hasRegistry])
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

  // What was read against one project says nothing about the next one, so the old read
  // goes and a fresh one takes its place. Reading again is the editor's job rather than
  // the reader's, because a card that reports nothing was read is not worth showing when
  // the read can simply happen. This hook mounts with the overlay, so a read here only
  // ever runs while refs are on screen.
  //
  // A standing folder grant needs no gesture, so this reads without one. A lapsed grant
  // cannot be re-requested outside a gesture and lands on the permission problem, which
  // is the actionable thing to report.
  useEffect(() => {
    if (!workspaceId || loadedFor === workspaceId) return

    if (loadedFor) clearRefBindings()

    void loadRefBindings(workspaceId)
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
