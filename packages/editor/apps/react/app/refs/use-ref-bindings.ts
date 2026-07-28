import { useProjectLink } from "@app/project/hooks/use-project-link"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { collectWorkspaceNodeRefs } from "@seldon/editor/lib/refs/collect-workspace-node-refs"
import { joinRefBindings } from "@seldon/editor/lib/refs/join-ref-bindings"
import { readBindingsManifest } from "@seldon/editor/lib/refs/read-bindings-manifest"
import { readRefsRegistry } from "@seldon/editor/lib/refs/read-refs-registry"
import { readLinkedTextFile } from "@seldon/editor/lib/storage/project-link-store"
import { useCallback, useEffect, useMemo, useState } from "react"

import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"
import type { ValidatedBindings } from "@seldon/editor/lib/refs/read-bindings-manifest"
import type { ValidatedRegistry } from "@seldon/editor/lib/refs/read-refs-registry"

/** Both files sit under the linked components folder. */
const REGISTRY_PATH = "refs/registry.json"
const MANIFEST_PATH = "refs/bindings.json"

/**
 * Joins the refs the open workspace declares with the views the export generated
 * and the consumers reported by the manifest, both read from the linked project.
 *
 * The workspace half is always available, so refs list even with no link at all.
 * That matters: an unbound ref is still worth showing, and it is the state every
 * ref starts in.
 *
 * Reading is explicit rather than automatic. Both files sit behind a directory
 * permission that a browser only re-grants during a gesture, so a caller loads
 * them when the user asks to see connections.
 */
export function useRefBindings() {
  const workspaceId = useWorkspaceId()
  const { workspace } = useWorkspace()
  const { link, status, grantPermission } = useProjectLink(workspaceId)

  const [registry, setRegistry] = useState<ValidatedRegistry | null>(null)
  const [bindings, setBindings] = useState<ValidatedBindings | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // What was read from one project says nothing about the next one.
  useEffect(() => {
    setRegistry(null)
    setBindings(null)
    setProblem(null)
  }, [workspaceId])

  const load = useCallback(async () => {
    if (!link) {
      setProblem("No exported folder is linked to this workspace yet.")

      return false
    }

    setLoading(true)

    try {
      const granted = status === "linked" || (await grantPermission())

      if (!granted) {
        setProblem("Reading the linked folder needs permission.")

        return false
      }

      const registryText = await readLinkedTextFile(link, REGISTRY_PATH)

      if (registryText === null) {
        setProblem("No refs registry found in the linked folder. Export again to write one.")

        return false
      }

      const registryResult = readRefsRegistry(registryText)

      if (!registryResult.ok) {
        setRegistry(null)
        setBindings(null)
        setProblem(registryResult.reason)

        return false
      }

      const manifestText = await readLinkedTextFile(link, MANIFEST_PATH)

      if (manifestText === null) {
        // The registry alone still describes every view, so it is worth keeping.
        setRegistry(registryResult.registry)
        setBindings(null)
        setProblem(
          "No binding manifest found. Run the bindings script in your project to write one.",
        )

        return false
      }

      const manifestResult = readBindingsManifest(manifestText)

      if (!manifestResult.ok) {
        setRegistry(registryResult.registry)
        setBindings(null)
        setProblem(manifestResult.reason)

        return false
      }

      setRegistry(registryResult.registry)
      setBindings(manifestResult.bindings)
      setProblem(getFrameworkMismatch(registryResult.registry, manifestResult.bindings))

      return true
    } finally {
      setLoading(false)
    }
  }, [link, status, grantPermission])

  const nodeRefs = useMemo(() => collectWorkspaceNodeRefs(workspace), [workspace])
  const refBindings: RefBinding[] = useMemo(
    () => joinRefBindings({ nodeRefs, registry, bindings }),
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
    load,
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
