import { useProjectLinkStore } from "@app/project/project-link-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useWorkspace } from "@app/workspace/use-workspace"
import { collectNodeRefs } from "@seldon/editor/lib/refs/collect-node-refs"
import { joinRefsAndBindings } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

import { useRefBindingsStore } from "./ref-bindings-store"

import type { ProjectLinkStatus } from "@app/project/project-link-store"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { ComputedRef } from "vue"

interface RefBindingsState {
  refBindings: ComputedRef<RefBinding[]>
  mode: ComputedRef<string | null>
  droppedEntries: ComputedRef<number>
  scannedFiles: ComputedRef<number>
  linkStatus: ComputedRef<ProjectLinkStatus>
  loading: ComputedRef<boolean>
  problem: ComputedRef<string | null>
}

/**
 * Joins the refs the open workspace declares with the views the export generated
 * and the consumers the manifest reports.
 *
 * The workspace half is always available, so refs list even with no link at all.
 * That matters: an unbound ref is still worth showing, and it is the state every
 * ref starts in. The other two halves arrive only after `loadRefBindings`.
 *
 * Mirrors the React `useRefBindings`.
 */
export function useRefBindings(): RefBindingsState {
  const workspaceId = useWorkspaceId()
  const { workspace } = useWorkspace()
  const projectLink = useProjectLinkStore()
  const store = useRefBindingsStore()
  const { registry, bindings, problem, loading, workspaceId: loadedFor } = storeToRefs(store)

  watch(
    workspaceId,
    (id) => {
      if (id && id !== projectLink.workspaceId) void projectLink.load(id)

      // What was read against one project says nothing about the next one.
      if (loadedFor.value && loadedFor.value !== id) store.clear()
    },
    { immediate: true },
  )

  const nodeRefs = computed(() => collectNodeRefs(workspace.value))
  const refBindings = computed(() =>
    joinRefsAndBindings({
      nodeRefs: nodeRefs.value,
      registry: registry.value,
      bindings: bindings.value,
    }),
  )

  return {
    refBindings,
    mode: computed(() => bindings.value?.mode ?? null),
    droppedEntries: computed(
      () => (registry.value?.droppedEntries ?? 0) + (bindings.value?.droppedEntries ?? 0),
    ),
    scannedFiles: computed(() => bindings.value?.scannedFiles ?? 0),
    linkStatus: computed(() => projectLink.status),
    loading: computed(() => loading.value),
    problem: computed(() => problem.value),
  }
}
