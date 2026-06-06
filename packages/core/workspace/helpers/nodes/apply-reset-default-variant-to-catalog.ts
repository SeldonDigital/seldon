import { produce } from "immer"

import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId, isComponentId } from "../../../components/constants"
import { type SchemaChild, isComplexSchema } from "../../../components/types"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { formatNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { componentBoardUniqueNodeId } from "../components/entry-node-ids"
import { walkComponentTreeRefs } from "../components/walk-component-tree-refs"
import { findComponentContainingTreeNodeId } from "./duplicate-entry-variant-subtree"
import { getNodeCatalogId } from "./get-node-catalog-id"
import { resolveSchemaChild } from "./resolve-schema-child"
import { applyVariantFallbackToSlot } from "./schema-composition-children"

function collectTreeRefIds(ref: ComponentTreeRef): string[] {
  const ids = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}

function collectAllComponentTreeNodeIds(workspace: Workspace): Set<string> {
  const out = new Set<string>()
  for (const board of Object.values(workspace.components)) {
    walkComponentTreeRefs(board.variants ?? [], (ref) => {
      out.add(ref.id)
    })
  }
  return out
}

/**
 * Rebuilds the default variant's child tree from `schema.default.children`.
 * Reuses an existing child node id when a child of the same component sits at
 * the same position, so canonical child ids referenced by schema-variant trees
 * and instances stay stable. Restored-but-currently-absent children mint fresh
 * ids. Child overrides are restored to the schema slot's overrides.
 */
function rebuildDefaultChildren(
  slots: SchemaChild[],
  existingRefs: ComponentTreeRef[] | undefined,
  workspace: Workspace,
  newNodes: Record<string, EntryNode>,
): ComponentTreeRef[] {
  const usedExisting = new Set<number>()
  const result: ComponentTreeRef[] = []

  for (const rawSlot of slots) {
    const slot = applyVariantFallbackToSlot(rawSlot, undefined)
    const resolved = resolveSchemaChild(slot)

    let reuseId: string | undefined
    let existingGrandchildren: ComponentTreeRef[] | undefined
    if (existingRefs) {
      const matchIdx = existingRefs.findIndex((ref, index) => {
        if (usedExisting.has(index)) return false
        const node = workspace.nodes[ref.id]
        return (
          !!node && getNodeCatalogId(node, workspace) === resolved.componentId
        )
      })
      if (matchIdx >= 0) {
        usedExisting.add(matchIdx)
        reuseId = existingRefs[matchIdx].id
        existingGrandchildren = existingRefs[matchIdx].children
      }
    }

    const id = reuseId ?? componentBoardUniqueNodeId(resolved.schema.id)
    const overrides = mergeProperties({}, slot.overrides ?? {})

    newNodes[id] = {
      id,
      type: "instance",
      level: resolved.schema.level as EntryNode["level"],
      label: resolved.label,
      theme: null,
      template: formatNodeLink(resolved.templateNodeId),
      overrides: overrides as EntryNode["overrides"],
      origin: "schema",
      __editor: { initialOverrides: structuredClone(overrides) },
    }

    const childSlots: SchemaChild[] = slot.children?.length
      ? slot.children
      : resolved.fallbackChildren
    const childRefs = rebuildDefaultChildren(
      childSlots,
      existingGrandchildren,
      workspace,
      newNodes,
    )

    result.push(childRefs.length ? { id, children: childRefs } : { id })
  }

  return result
}

type ComponentShape = { component: string | null; children: ComponentShape[] }

function expectedCatalogShape(slots: SchemaChild[]): ComponentShape[] {
  return slots.map((rawSlot) => {
    const slot = applyVariantFallbackToSlot(rawSlot, undefined)
    const resolved = resolveSchemaChild(slot)
    const childSlots: SchemaChild[] = slot.children?.length
      ? slot.children
      : resolved.fallbackChildren
    return {
      component: resolved.componentId,
      children: expectedCatalogShape(childSlots),
    }
  })
}

function actualTreeShape(
  refs: ComponentTreeRef[] | undefined,
  workspace: Workspace,
): ComponentShape[] {
  return (refs ?? []).map((ref) => {
    const node = workspace.nodes[ref.id]
    return {
      component: node ? getNodeCatalogId(node, workspace) : null,
      children: actualTreeShape(ref.children, workspace),
    }
  })
}

/**
 * Returns true when the default variant's child tree already matches its
 * catalog schema default composition by component and nesting. Use this to
 * decide whether a "Reset to Catalog" action is meaningful after structural
 * edits, independent of whether any overrides exist.
 */
export function defaultVariantMatchesCatalogStructure(
  workspace: Workspace,
  defaultVariantRootId: string,
): boolean {
  const located = findComponentContainingTreeNodeId(
    workspace,
    defaultVariantRootId,
  )
  if (
    !located ||
    !(isComponentBoard(located.board) || isPlaygroundBoard(located.board))
  ) {
    return true
  }

  const { board } = located
  const defaultRef = board.variants?.[0]
  if (!defaultRef || defaultRef.id !== defaultVariantRootId) return true

  const rootNode = workspace.nodes[defaultVariantRootId]
  if (!rootNode) return true

  const catalogId = getNodeCatalogId(rootNode, workspace)
  if (!catalogId || !isComponentId(catalogId)) return true
  const schema = getComponentSchema(catalogId as ComponentId)

  const expected = isComplexSchema(schema)
    ? expectedCatalogShape(schema.default.children ?? [])
    : []
  const actual = actualTreeShape(defaultRef.children, workspace)

  return JSON.stringify(expected) === JSON.stringify(actual)
}

/**
 * Resets a default variant to its catalog schema default composition. Rebuilds
 * `board.variants[0]` to match `getComponentSchema(id).default`: re-adds removed
 * children, drops added ones, fixes order, and restores child overrides, while
 * preserving canonical child ids that schema variants and instances reference.
 * Schema-variant and user-variant entries are left untouched. Orphaned nodes
 * that nothing else references are removed.
 */
export function applyResetDefaultVariantToCatalog(
  workspace: Workspace,
  defaultVariantRootId: string,
): Workspace {
  return produce(workspace, (draft) => {
    const located = findComponentContainingTreeNodeId(
      draft,
      defaultVariantRootId,
    )
    if (
      !located ||
      !(isComponentBoard(located.board) || isPlaygroundBoard(located.board))
    ) {
      return
    }

    const { board } = located
    const defaultRef = board.variants[0]
    if (!defaultRef || defaultRef.id !== defaultVariantRootId) return

    const rootNode = draft.nodes[defaultVariantRootId]
    if (!rootNode || rootNode.type !== "default") return

    const catalogId = getNodeCatalogId(rootNode, draft as unknown as Workspace)
    if (!catalogId || !isComponentId(catalogId)) return
    const schema = getComponentSchema(catalogId as ComponentId)

    const oldIds = new Set(collectTreeRefIds(defaultRef))

    rootNode.overrides = {}
    rootNode.theme = null
    rootNode.__editor = { initialOverrides: {} }

    if (!isComplexSchema(schema)) {
      board.variants[0] = { id: defaultVariantRootId }
    } else {
      const newNodes: Record<string, EntryNode> = {}
      const childRefs = rebuildDefaultChildren(
        schema.default.children ?? [],
        defaultRef.children,
        draft as unknown as Workspace,
        newNodes,
      )
      board.variants[0] = childRefs.length
        ? { id: defaultVariantRootId, children: childRefs }
        : { id: defaultVariantRootId }
      for (const [id, node] of Object.entries(newNodes)) {
        draft.nodes[id] = node
      }
    }

    const newIds = new Set(collectTreeRefIds(board.variants[0]))
    const referenced = collectAllComponentTreeNodeIds(
      draft as unknown as Workspace,
    )

    for (const id of oldIds) {
      if (newIds.has(id)) continue
      if (referenced.has(id)) continue
      delete draft.nodes[id]
    }
  })
}
