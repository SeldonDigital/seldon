import { getComponentSchema } from "../../components/catalog"
import { ComponentId, isComponentId } from "../../components/constants"
import { getComponentPropertyDefaults } from "../helpers/components/get-component-property-defaults"
import { getNodeParentIndex } from "../helpers/graph/build-node-parent-index"
import type { ComponentEntry } from "../types"
import { computeProperties } from "../../properties/compute"
import type { ComputeContext } from "../../properties/compute"
import type { Properties } from "../../properties/types/properties"
import { mergeTaggedValues } from "../../properties/helpers/merge-tagged-value"
import {
  LAYERED_PAINT_KEYS,
  OBJECT_FACET_PROPERTY_KEYS,
  type LayeredPaintKey,
  type ObjectFacetPropertyKey,
  type PropertyKey,
} from "../../properties/types/property-keys"
import { getNodeCatalogId } from "../helpers/nodes/get-node-catalog-id"
import { parseNodeTemplate, parseThemeTemplate } from "../model/template-ref"
import type { EntryNode, Workspace } from "../types"
import { getComputedTheme } from "./compute-workspace-themes"

type NodeRecord = Record<string, WorkspaceNode>
type BoardRecord = Record<string, WorkspaceComponent>

interface WorkspaceNode {
  id: string
  component?: string
  template?: string
  properties?: Properties
  overrides?: Properties
  theme?: string | null
  children?: string[]
  instanceOf?: string
  variant?: string
}

interface WorkspaceComponent {
  id?: string
  type?: ComponentEntry["type"]
  catalogId?: string
  properties?: Properties
  componentProperties?: Properties
  theme?: string | null
  componentTheme?: string | null
  variants?: Array<string | { id: string }>
}

interface WorkspacePropertySource {
  byId?: NodeRecord
  nodes?: NodeRecord
  components?: BoardRecord
  themes?: any
}

export interface ComputeNodePropertiesOptions {
  /**
   * `"computed"` runs the low-level property compute engine after materializing defaults
   * and overrides. `"effective"` stops before computed values are resolved.
   */
  stage?: "effective" | "computed"
  /**
   * Pre-built child id → composition parent id map from component/playground board
   * `variants` trees. When omitted, a fresh index is built for this call (batch callers
   * can pass one from `buildNodeParentIndex` to avoid repeated walks).
   */
  parentIndex?: ReadonlyMap<string, string>
}

function getNodes(workspace: WorkspacePropertySource): NodeRecord {
  return workspace.byId ?? workspace.nodes ?? {}
}

function getOwnProperties(source: WorkspaceNode | WorkspaceComponent): Properties {
  return (
    ("properties" in source ? source.properties : undefined) ??
    ("overrides" in source ? source.overrides : undefined) ??
    ("componentProperties" in source ? source.componentProperties : undefined) ??
    {}
  )
}

function getComponentThemeRef(board: WorkspaceComponent): string | null {
  return board.theme ?? board.componentTheme ?? null
}

function getNodeComponentId(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
): ComponentId | null {
  if (node.component && isComponentId(node.component)) return node.component

  const parsed = node.template ? parseNodeTemplate(node.template) : null
  if (parsed?.kind === "catalog" && isComponentId(parsed.componentId)) {
    return parsed.componentId
  }

  const catalogId = getNodeCatalogId(
    node as EntryNode,
    workspace as Workspace,
  )
  if (catalogId && isComponentId(catalogId)) return catalogId

  return null
}

function getSchemaProperties(componentId: ComponentId): Properties {
  return getComponentSchema(componentId).properties
}

function getVariantId(variant: string | { id: string }): string {
  return typeof variant === "string" ? variant : variant.id
}

function findComponentForNode(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): WorkspaceComponent | null {
  const nodes = getNodes(workspace)
  const rootNode = getRootNode(node, workspace, compositionParentByChild)

  return (
    Object.values(workspace.components ?? {}).find((board) =>
      (board.variants ?? []).some((variant) => {
        const variantId = getVariantId(variant)
        if (variantId === rootNode.id) return true
        return nodes[variantId]?.id === rootNode.id
      }),
    ) ?? null
  )
}

function findParentNode(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): WorkspaceNode | null {
  const nodes = getNodes(workspace)
  const legacyParent =
    Object.values(nodes).find((possibleParent) =>
      possibleParent.children?.includes(node.id),
    ) ?? null
  if (legacyParent) return legacyParent

  const parentId = compositionParentByChild?.get(node.id)
  if (parentId) {
    const fromIndex = nodes[parentId]
    if (fromIndex) return fromIndex
  }

  return null
}

function getTemplateNode(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
): WorkspaceNode | null {
  const nodes = getNodes(workspace)
  if (node.instanceOf && nodes[node.instanceOf]) return nodes[node.instanceOf]
  if (node.variant && nodes[node.variant]) return nodes[node.variant]

  const parsed = node.template ? parseNodeTemplate(node.template) : null
  if (parsed?.kind === "node") return nodes[parsed.nodeId] ?? null

  return null
}

function getRootNode(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): WorkspaceNode {
  let current = node
  let parent = findParentNode(current, workspace, compositionParentByChild)

  while (parent) {
    current = parent
    parent = findParentNode(current, workspace, compositionParentByChild)
  }

  return current
}

function normalizeThemeRef(themeRef: string | null | undefined): string | null {
  if (!themeRef) return null

  const parsed = parseThemeTemplate(themeRef)
  if (parsed?.kind === "catalog") return parsed.themeCatalogId
  if (parsed?.kind === "theme") return parsed.themeId

  return themeRef
}

function getEffectiveThemeId(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): string {
  let current: WorkspaceNode | null = node

  while (current) {
    const themeId = normalizeThemeRef(current.theme)
    if (themeId) return themeId
    current = findParentNode(current, workspace, compositionParentByChild)
  }

  const board = findComponentForNode(node, workspace, compositionParentByChild)
  return normalizeThemeRef(board ? getComponentThemeRef(board) : null) ?? "default"
}

function mergeLayerArrays<T extends Record<string, unknown>>(
  base: T[],
  next: T[],
): T[] {
  const length = Math.max(base.length, next.length)
  return Array.from({ length }, (_, index) => {
    const baseLayer = base[index]
    const nextLayer = next[index]
    if (nextLayer === undefined) return baseLayer as T
    if (baseLayer === undefined) return nextLayer as T
    return { ...baseLayer, ...nextLayer } as T
  })
}

function mergePropertySource(base: Properties, next: Properties): Properties {
  return (Object.keys(next) as PropertyKey[]).reduce((merged, key) => {
    const baseValue = base[key]
    const nextValue = next[key]
    let value: unknown = nextValue

    if (
      LAYERED_PAINT_KEYS.has(key as LayeredPaintKey) &&
      Array.isArray(baseValue) &&
      Array.isArray(nextValue)
    ) {
      value = mergeLayerArrays(
        baseValue as Record<string, unknown>[],
        nextValue as Record<string, unknown>[],
      )
    } else if (
      OBJECT_FACET_PROPERTY_KEYS.has(key as ObjectFacetPropertyKey) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      !("type" in baseValue) &&
      nextValue &&
      typeof nextValue === "object" &&
      !Array.isArray(nextValue) &&
      !("type" in nextValue)
    ) {
      value = { ...baseValue, ...nextValue }
    } else {
      value = mergeTaggedValues(baseValue, nextValue)
    }

    return { ...merged, [key]: value }
  }, base)
}

export function mergeEffectiveProperties(sources: Properties[]): Properties {
  return sources.reduce(
    (merged, source) => mergePropertySource(merged, source),
    {} as Properties,
  )
}

function getTemplatePropertySources(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  visited: Set<string>,
): Properties[] {
  const templateNode = getTemplateNode(node, workspace)
  if (!templateNode || visited.has(templateNode.id)) return []

  visited.add(templateNode.id)
  return [
    ...getTemplatePropertySources(templateNode, workspace, visited),
    getOwnProperties(templateNode),
  ]
}

/** Merges catalog schema defaults with the template chain, excluding the target node's overrides. */
export function getInheritedNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
): Properties {
  const node = getNodes(workspace)[targetId]
  if (!node) {
    throw new Error(`Workspace node ${targetId} not found`)
  }

  const componentId = getNodeComponentId(node, workspace)
  const schemaProperties = componentId ? getSchemaProperties(componentId) : {}

  return mergeEffectiveProperties([
    schemaProperties,
    ...getTemplatePropertySources(node, workspace, new Set([node.id])),
  ])
}

export function getEffectiveNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
): Properties {
  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = workspace.components?.[targetId]
    if (!board) throw new Error(`Workspace object ${targetId} not found`)

    return mergeEffectiveProperties([
      getComponentPropertyDefaults(),
      getOwnProperties(board),
    ])
  }

  const componentId = getNodeComponentId(node, workspace)
  const schemaProperties = componentId ? getSchemaProperties(componentId) : {}

  return mergeEffectiveProperties([
    schemaProperties,
    ...getTemplatePropertySources(node, workspace, new Set([node.id])),
    getOwnProperties(node),
  ])
}

function buildComputeContext(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  visited: Set<string>,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): ComputeContext {
  const effectiveProperties = getEffectiveNodeProperties(node.id, workspace)
  const theme = getComputedTheme(
    getEffectiveThemeId(node, workspace, compositionParentByChild),
    workspace,
  )
  const parentNode = findParentNode(node, workspace, compositionParentByChild)

  if (!parentNode || visited.has(parentNode.id)) {
    return {
      properties: effectiveProperties,
      parentContext: null,
      theme,
    }
  }

  visited.add(parentNode.id)

  return {
    properties: effectiveProperties,
    parentContext: buildComputeContext(
      parentNode,
      workspace,
      visited,
      compositionParentByChild,
    ),
    theme,
  }
}

/**
 * Workspace-aware read-side property materializer. It merges schema defaults,
 * template/instance overrides, inherited theme context, and then resolves
 * `ValueType.COMPUTED` values without writing computed values back to the workspace.
 */
/**
 * Builds a {@link ComputeContext} for canvas and export callers that need parent chains
 * and theme resolution without running the full computed-property pass.
 */
export function getNodeComputeContext(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: Pick<ComputeNodePropertiesOptions, "parentIndex"> = {},
): ComputeContext {
  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = workspace.components?.[targetId]
    const effectiveProperties = getEffectiveNodeProperties(targetId, workspace)
    const themeId = normalizeThemeRef(board ? getComponentThemeRef(board) : null)
    const theme = getComputedTheme(themeId ?? "default", workspace)
    return {
      properties: effectiveProperties,
      parentContext: null,
      theme,
    }
  }

  const compositionParentByChild =
    options.parentIndex ?? getNodeParentIndex(workspace)

  return buildComputeContext(
    node,
    workspace,
    new Set([node.id]),
    compositionParentByChild,
  )
}

export function computeNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: ComputeNodePropertiesOptions = {},
): Properties {
  if (options.stage === "effective") {
    return getEffectiveNodeProperties(targetId, workspace)
  }

  const node = getNodes(workspace)[targetId]
  const effectiveProperties = getEffectiveNodeProperties(targetId, workspace)

  if (!node) {
    const board = workspace.components?.[targetId]
    const themeId = normalizeThemeRef(board ? getComponentThemeRef(board) : null)
    const theme = getComputedTheme(themeId ?? "default", workspace)
    return computeProperties(effectiveProperties, {
      properties: effectiveProperties,
      parentContext: null,
      theme,
    })
  }

  const compositionParentByChild =
    options.parentIndex ?? getNodeParentIndex(workspace)

  const context = buildComputeContext(
    node,
    workspace,
    new Set([node.id]),
    compositionParentByChild,
  )
  const inputProperties = context.properties

  return computeProperties(inputProperties, context)
}

export type { WorkspacePropertySource }
