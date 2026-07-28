import type { WorkspaceNodeRef } from "./collect-workspace-node-refs"
import type { ValidatedBindings } from "./read-bindings-manifest"
import type { ValidatedRegistry } from "./read-refs-registry"
import type { RefConsumer } from "@seldon/factory/bindings/types"
import type { SeldonRefView } from "@seldon/factory/export/shared/generate-refs-registry"

/**
 * Whether a referenced node has code driving it.
 *
 * `bound` means the manifest reports at least one consumer. `unbound` means the
 * ref exists in the workspace but no scanned file drives it, which is the state
 * an overlay shows muted. `stale` means the manifest names a ref the workspace no
 * longer has, so the ref was renamed or removed since the scan ran.
 */
export type RefBindingState = "bound" | "unbound" | "stale"

/**
 * One ref, seen from all three sides.
 *
 * `node` is the design: where the ref sits in the open workspace. `views` is the
 * generated code: which component exposes it as which prop. `consumers` is the
 * app code: what actually drives it.
 *
 * An empty `views` means the registry does not know this ref, so the export is
 * older than the workspace and the ref has not reached generated code yet.
 */
export interface RefBinding {
  ref: string
  state: RefBindingState
  /** Absent for a `stale` binding, since no workspace node carries that ref. */
  node: WorkspaceNodeRef | null
  views: SeldonRefView[]
  consumers: RefConsumer[]
}

export interface RefBindingSources {
  nodeRefs: WorkspaceNodeRef[]
  registry: ValidatedRegistry | null
  bindings: ValidatedBindings | null
}

/**
 * Pairs the refs the workspace declares with the views the export generated and
 * the consumers a manifest reports.
 *
 * The join key is the ref name throughout. The factory emits it verbatim from
 * `node.ref`, so a live workspace, a generated registry, and a scanned project all
 * agree on it without any translation.
 *
 * Both directions are kept. A workspace ref with no consumers is worth showing,
 * because it tells the user nothing drives that node yet. A manifest ref with no
 * workspace node is worth showing too, because it means the manifest has gone
 * stale against the design.
 *
 * When two nodes carry the same ref, each gets its own binding and both list the
 * same consumers and views. The manifest and the registry key on the ref name
 * alone, so neither can say which node was meant, and reporting both is the honest
 * answer. Core rejects a duplicate ref, so this is the degenerate case.
 */
export function joinRefBindings({ nodeRefs, registry, bindings }: RefBindingSources): RefBinding[] {
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
      views: registry?.refs.get(node.ref)?.views ?? [],
      consumers,
    })
  }

  for (const [ref, consumers] of consumersByRef) {
    if (seen.has(ref)) continue

    joined.push({
      ref,
      state: "stale",
      node: null,
      views: registry?.refs.get(ref)?.views ?? [],
      consumers,
    })
  }

  return joined.sort((a, b) => a.ref.localeCompare(b.ref))
}

/** Bindings for one node, which is what a canvas overlay or a sidebar row needs. */
export function getBindingsForNode(bindings: RefBinding[], nodeId: string): RefBinding[] {
  return bindings.filter((binding) => binding.node?.nodeId === nodeId)
}
