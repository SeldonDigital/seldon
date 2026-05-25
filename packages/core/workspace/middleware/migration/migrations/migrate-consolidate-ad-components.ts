import type { ComponentTreeRef, Workspace } from "../../../types"

const REMOVED_AD_COMPONENT_IDS = [
  "adInstagram",
  "adTikTok",
  "adLinkedIn",
  "adYouTube",
] as const

function collectTreeNodeIds(refs: ComponentTreeRef[]): Set<string> {
  const ids = new Set<string>()
  const walk = (ref: ComponentTreeRef) => {
    ids.add(ref.id)
    ref.children?.forEach(walk)
  }
  refs.forEach(walk)
  return ids
}

/** Removes legacy per-platform ad component boards and remaps catalog templates to adSocialMedia. */
export function migrateConsolidateAdComponents(workspace: Workspace): Workspace {
  const components = { ...workspace.components }
  const nodes = { ...workspace.nodes }

  for (const oldId of REMOVED_AD_COMPONENT_IDS) {
    const board = components[oldId]
    if (!board || board.type !== "component") continue

    for (const nodeId of collectTreeNodeIds(board.variants)) {
      delete nodes[nodeId]
    }
    delete components[oldId]
  }

  for (const [nodeId, node] of Object.entries(nodes)) {
    for (const oldId of REMOVED_AD_COMPONENT_IDS) {
      if (node.template === `catalog:${oldId}`) {
        nodes[nodeId] = {
          ...node,
          template: "catalog:adSocialMedia",
        }
      }
    }
  }

  return {
    ...workspace,
    components,
    nodes,
  }
}
