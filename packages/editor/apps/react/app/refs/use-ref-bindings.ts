import { useProjectLink } from "@app/project/hooks/use-project-link"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { collectWorkspaceNodeRefs } from "@seldon/editor/lib/refs/collect-workspace-node-refs"
import { joinRefBindings } from "@seldon/editor/lib/refs/join-ref-bindings"
import { readBindingsManifest } from "@seldon/editor/lib/refs/read-bindings-manifest"
import { readLinkedTextFile } from "@seldon/editor/lib/storage/project-link-store"
import { useCallback, useEffect, useMemo, useState } from "react"

import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"
import type { ValidatedBindings } from "@seldon/editor/lib/refs/read-bindings-manifest"

/** Where the manifest is written, relative to the linked components folder. */
const MANIFEST_PATH = "refs/bindings.json"

/**
 * Joins the refs the open workspace declares with the consumers reported by the
 * manifest in the linked project folder.
 *
 * The workspace half is always available, so refs list even with no link at all.
 * That matters: an unbound ref is still worth showing, and it is the state every
 * ref starts in.
 *
 * Reading is explicit rather than automatic. The manifest sits behind a directory
 * permission that a browser only re-grants during a gesture, so a caller loads it
 * when the user asks to see connections.
 */
export function useRefBindings() {
  const workspaceId = useWorkspaceId()
  const { workspace } = useWorkspace()
  const { link, status, grantPermission } = useProjectLink(workspaceId)

  const [bindings, setBindings] = useState<ValidatedBindings | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // A manifest read against one project says nothing about the next one.
  useEffect(() => {
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

      const text = await readLinkedTextFile(link, MANIFEST_PATH)

      if (text === null) {
        setProblem(
          "No binding manifest found. Run the bindings script in your project to write one.",
        )

        return false
      }

      const result = readBindingsManifest(text)

      if (!result.ok) {
        setBindings(null)
        setProblem(result.reason)

        return false
      }

      setBindings(result.bindings)
      setProblem(null)

      return true
    } finally {
      setLoading(false)
    }
  }, [link, status, grantPermission])

  const nodeRefs = useMemo(() => collectWorkspaceNodeRefs(workspace), [workspace])
  const refBindings: RefBinding[] = useMemo(
    () => joinRefBindings(nodeRefs, bindings),
    [nodeRefs, bindings],
  )

  return {
    refBindings,
    mode: bindings?.mode ?? null,
    droppedEntries: bindings?.droppedEntries ?? 0,
    scannedFiles: bindings?.scannedFiles ?? 0,
    linkStatus: status,
    loading,
    problem,
    load,
  }
}
