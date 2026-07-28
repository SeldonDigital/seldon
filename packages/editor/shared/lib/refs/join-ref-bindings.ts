import type { WorkspaceNodeRef } from "./collect-workspace-node-refs"
import type { ValidatedBindings } from "./read-bindings-manifest"
import type { RefConsumer } from "@seldon/factory/bindings/types"

/**
 * Whether a referenced node has code driving it.
 *
 * `bound` means the manifest reports at least one consumer. `unbound` means the
 * ref exists in the workspace but no scanned file drives it, which is the state
 * an overlay shows muted. `stale` means the manifest names a ref the workspace no
 * longer has, so the ref was renamed or removed since the scan ran.
 */
export type RefBindingState = "bound" | "unbound" | "stale"

export interface RefBinding {
  ref: string
  state: RefBindingState
  /** Absent for a `stale` binding, since no workspace node carries that ref. */
  node: WorkspaceNodeRef | null
  consumers: RefConsumer[]
}

/**
 * Pairs the refs the workspace declares with the consumers a manifest reports.
 *
 * The join key is the ref name, which the factory emits verbatim from
 * `node.ref`, so a live workspace and a scanned project agree on it without any
 * translation.
 *
 * Both directions are kept. A workspace ref with no consumers is worth showing,
 * because it tells the user nothing drives that node yet. A manifest ref with no
 * workspace node is worth showing too, because it means the manifest has gone
 * stale against the design.
 *
 * When two nodes carry the same ref, each gets its own binding and both list the
 * same consumers. The manifest keys on the ref name alone, so it cannot say which
 * node a consumer meant, and reporting both is the honest answer.
 */
export function joinRefBindings(
  nodeRefs: WorkspaceNodeRef[],
  bindings: ValidatedBindings | null,
): RefBinding[] {
  const consumersByRef = bindings?.refs ?? new Map<string, RefConsumer[]>()
  const joined: RefBinding[] = []
  const seen = new Set<string>()

  for (const node of nodeRefs) {
    const consumers = consumersByRef.get(node.ref) ?? []

    seen.add(node.ref)
    joined.push({
      ref: node.ref,
      state: consumers.length > 0 ? "bound" : "unbound",
      node,
      consumers,
    })
  }

  for (const [ref, consumers] of consumersByRef) {
    if (seen.has(ref)) continue

    joined.push({ ref, state: "stale", node: null, consumers })
  }

  return joined.sort((a, b) => a.ref.localeCompare(b.ref))
}

/** Bindings for one node, which is what a canvas overlay or a sidebar row needs. */
export function getBindingsForNode(bindings: RefBinding[], nodeId: string): RefBinding[] {
  return bindings.filter((binding) => binding.node?.nodeId === nodeId)
}
