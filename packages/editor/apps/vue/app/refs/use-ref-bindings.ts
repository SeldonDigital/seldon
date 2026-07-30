import { useProjectLinkStore } from "@app/project/project-link-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useWorkspace } from "@app/workspace/use-workspace"
import { collectNodeRefs } from "@seldon/editor/lib/refs/collect-node-refs"
import { joinRefsAndBindings } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

import { useRefBindingsStore } from "./ref-bindings-store"

import type { ProjectLinkStatus } from "@app/project/project-link-store"
import type { RefBindingsStatus } from "@seldon/editor/lib/refs/describe-binding"
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

  // What was read against one project says nothing about the next one, so the old read
  // goes and a fresh one takes its place. Reading again is the editor's job rather than
  // the reader's, because a card that reports nothing was read is not worth showing when
  // the read can simply happen. This hook mounts with the overlay, so a read here only
  // ever runs while refs are on screen.
  //
  // A standing folder grant needs no gesture, so this reads without one. A lapsed grant
  // cannot be re-requested outside a gesture and lands on the permission problem, which
  // is the actionable thing to report.
  watch(
    workspaceId,
    (id) => {
      if (id && id !== projectLink.workspaceId) void projectLink.load(id)
      if (!id || loadedFor.value === id) return

      if (loadedFor.value) store.clear()

      void store.load(id)
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

/**
 * What the read produced, for a surface that reports one ref rather than the list.
 *
 * Reads the store directly rather than taking a slice of `useRefBindings`, because a
 * card reporting one binding would otherwise re-collect every ref and re-run the join
 * to reach two fields none of that work produces.
 *
 * Mirrors the React `useRefBindingsStatus`.
 */
export function useRefBindingsStatus(): ComputedRef<RefBindingsStatus> {
  const { registry, problem } = storeToRefs(useRefBindingsStore())

  return computed(() => ({
    problem: problem.value,
    hasRegistry: registry.value !== null,
  }))
}
