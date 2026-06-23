import { getComponentSchema } from "../../components/catalog"
import { ComponentId, isComponentId } from "../../components/constants"
import { computeProperties } from "../../properties/compute"
import type { ComputeContext } from "../../properties/compute"
import { mergeProperties } from "../../properties/helpers/merge-properties"
import type { Properties } from "../../properties/types/properties"
import {
  expandLookPresetFacets,
  hasExpandableLookPreset,
} from "../../themes/looks"
import type { ComputedTheme } from "../../themes/types/theme"
import { getComponentPropertyDefaults } from "../helpers/components/get-component-property-defaults"
import { getNodeParentIndex } from "../helpers/graph/build-node-parent-index"
import { getNodeCatalogId } from "../helpers/nodes/get-node-catalog-id"
import { resolveLayoutMode } from "../helpers/nodes/resolve-layout-mode"
import type { EntryNodeStates, NodeState } from "../model/node-state"
import { NORMAL_STATE } from "../model/node-state"
import { parseNodeTemplate, parseThemeTemplate } from "../model/template-ref"
import type { Board } from "../types"
import type { EntryNode, Workspace } from "../types"
import { getComputedTheme } from "./compute-workspace-themes"
import type { WorkspaceThemeEntries } from "./compute-workspace-themes"

type NodeRecord = Record<string, WorkspaceNode>
type BoardRecord = Record<string, WorkspaceComponent>

interface WorkspaceNode {
  id: string
  component?: string
  template?: string
  properties?: Properties
  overrides?: Properties
  states?: EntryNodeStates
  theme?: string | null
  children?: string[]
  instanceOf?: string
  variant?: string
}

interface WorkspaceComponent {
  id?: string
  type?: Board["type"]
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
  boards?: BoardRecord
  playgrounds?: BoardRecord
  themes?: WorkspaceThemeEntries
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
  /**
   * `"board"` makes a node without a composition parent resolve `#parent.*` paths against
   * its owning board, so the board background acts as the surface behind variant roots.
   * The editor canvas opts in; export leaves this off so board styling never leaks into
   * exported CSS.
   */
  rootParentFallback?: "board"
  /**
   * Interaction state to resolve. When omitted or `"normal"`, only the Normal
   * (`overrides`) layer is used. When set to a reserved or custom state name,
   * each node's `states[state]` bag is layered on top of its Normal overrides
   * along the template chain.
   */
  state?: NodeState
}

function getNodes(workspace: WorkspacePropertySource): NodeRecord {
  return workspace.byId ?? workspace.nodes ?? {}
}

/**
 * Resolves a catalog row by key from either `boards` or `playgrounds`. Playground
 * containers share the board shape, so property compute treats them the same.
 */
function getBoardOrPlayground(
  workspace: WorkspacePropertySource,
  targetId: string,
): WorkspaceComponent | undefined {
  return workspace.boards?.[targetId] ?? workspace.playgrounds?.[targetId]
}

function getOwnProperties(
  source: WorkspaceNode | WorkspaceComponent,
): Properties {
  return (
    ("properties" in source ? source.properties : undefined) ??
    ("overrides" in source ? source.overrides : undefined) ??
    ("componentProperties" in source
      ? source.componentProperties
      : undefined) ??
    {}
  )
}

/**
 * Returns the node's override bag for `state`, or an empty bag when no state is
 * requested, the state is Normal, or the node has no overrides for it. Boards
 * carry no states, so they always return an empty bag.
 */
function getOwnStateProperties(
  source: WorkspaceNode | WorkspaceComponent,
  state: NodeState | undefined,
): Properties {
  if (!state || state === NORMAL_STATE) return {}
  const states = "states" in source ? source.states : undefined
  return states?.[state] ?? {}
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

  const catalogId = getNodeCatalogId(node as EntryNode, workspace as Workspace)
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
    Object.values(workspace.boards ?? {}).find((board) =>
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
  return (
    normalizeThemeRef(board ? getComponentThemeRef(board) : null) ?? "seldon"
  )
}

export function mergeEffectiveProperties(sources: Properties[]): Properties {
  return sources.reduce(
    (merged, source) => mergeProperties(merged, source),
    {} as Properties,
  )
}

/** Options for effective-merge readers that already resolved theme context. */
export interface EffectivePropertiesOptions {
  /** Theme used to expand look preset facets. Resolved lazily when omitted. */
  theme?: ComputedTheme
  /** Parent index used for theme inheritance when `theme` is omitted. */
  parentIndex?: ReadonlyMap<string, string>
  /**
   * Interaction state to resolve. When omitted or `"normal"`, only Normal
   * overrides are merged. Otherwise each node's `states[state]` bag layers on
   * top of its Normal overrides along the template chain.
   */
  state?: NodeState
}

/**
 * Expands look preset facets in every snapshot before the effective merge, so
 * a snapshot carrying a compound `preset` acts as a full look application.
 * Snapshots without preset refs skip theme resolution entirely.
 */
function expandPresetSources(
  sources: Properties[],
  resolveTheme: () => ComputedTheme,
): Properties[] {
  if (!sources.some(hasExpandableLookPreset)) return sources
  const theme = resolveTheme()
  return sources.map((source) => expandLookPresetFacets(source, theme))
}

function resolveNodeTheme(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  parentIndex?: ReadonlyMap<string, string>,
): ComputedTheme {
  return getComputedTheme(
    getEffectiveThemeId(
      node,
      workspace,
      parentIndex ?? getNodeParentIndex(workspace),
    ),
    workspace,
  )
}

function resolveBoardTheme(
  board: WorkspaceComponent | undefined,
  workspace: WorkspacePropertySource,
): ComputedTheme {
  const themeId = normalizeThemeRef(board ? getComponentThemeRef(board) : null)
  return getComputedTheme(themeId ?? "seldon", workspace)
}

/**
 * Property sources gathered from a node's template chain, split by layer. A
 * state bag must sit on top of every Normal layer, so the caller merges all
 * `normal` sources first and then all `state` sources. Both arrays run from the
 * farthest ancestor to the closest template, so a closer layer overrides a
 * farther one within its own layer.
 */
interface TemplatePropertySources {
  normal: Properties[]
  state: Properties[]
}

function getTemplatePropertySources(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  visited: Set<string>,
  state?: NodeState,
): TemplatePropertySources {
  const templateNode = getTemplateNode(node, workspace)
  if (!templateNode || visited.has(templateNode.id)) {
    return { normal: [], state: [] }
  }

  visited.add(templateNode.id)
  const ancestor = getTemplatePropertySources(
    templateNode,
    workspace,
    visited,
    state,
  )
  return {
    normal: [...ancestor.normal, getOwnProperties(templateNode)],
    state: [...ancestor.state, getOwnStateProperties(templateNode, state)],
  }
}

/** Merges catalog schema defaults with the template chain, excluding the target node's overrides. */
export function getInheritedNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: EffectivePropertiesOptions = {},
): Properties {
  const node = getNodes(workspace)[targetId]
  if (!node) {
    throw new Error(`Workspace node ${targetId} not found`)
  }

  const componentId = getNodeComponentId(node, workspace)
  const schemaProperties = componentId ? getSchemaProperties(componentId) : {}

  const templateSources = getTemplatePropertySources(
    node,
    workspace,
    new Set([node.id]),
    options.state,
  )

  return mergeEffectiveProperties(
    expandPresetSources(
      [
        schemaProperties,
        ...templateSources.normal,
        ...templateSources.state,
      ],
      () =>
        options.theme ?? resolveNodeTheme(node, workspace, options.parentIndex),
    ),
  )
}

/**
 * Render-scoped memo for the explicit-theme effective-property path. With an
 * explicit `theme`, the result is a pure function of `(workspace, targetId,
 * theme.id)`, so it is safe to reuse across the many ancestor rebuilds the
 * canvas performs. Keyed by the `workspace` reference, which reducers replace on
 * every edit, so cache entries fall away with the workspace they describe.
 */
const effectivePropertiesCache = new WeakMap<object, Map<string, Properties>>()

export function getEffectiveNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: EffectivePropertiesOptions = {},
): Properties {
  const theme = options.theme
  if (theme) {
    const cacheKey = `${targetId}|${theme.id}|${options.state ?? NORMAL_STATE}`
    let byKey = effectivePropertiesCache.get(workspace as object)
    const cached = byKey?.get(cacheKey)
    if (cached) return cached

    const result = computeEffectiveNodeProperties(targetId, workspace, options)
    if (!byKey) {
      byKey = new Map<string, Properties>()
      effectivePropertiesCache.set(workspace as object, byKey)
    }
    byKey.set(cacheKey, result)
    return result
  }

  return computeEffectiveNodeProperties(targetId, workspace, options)
}

function computeEffectiveNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: EffectivePropertiesOptions = {},
): Properties {
  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = getBoardOrPlayground(workspace, targetId)
    if (!board) throw new Error(`Workspace object ${targetId} not found`)

    return mergeEffectiveProperties(
      expandPresetSources(
        [getComponentPropertyDefaults(), getOwnProperties(board)],
        () => options.theme ?? resolveBoardTheme(board, workspace),
      ),
    )
  }

  const componentId = getNodeComponentId(node, workspace)
  const schemaProperties = componentId ? getSchemaProperties(componentId) : {}

  const templateSources = getTemplatePropertySources(
    node,
    workspace,
    new Set([node.id]),
    options.state,
  )
  return mergeEffectiveProperties(
    expandPresetSources(
      [
        schemaProperties,
        ...templateSources.normal,
        getOwnProperties(node),
        ...templateSources.state,
        getOwnStateProperties(node, options.state),
      ],
      () =>
        options.theme ?? resolveNodeTheme(node, workspace, options.parentIndex),
    ),
  )
}

/**
 * Builds a parent-like {@link ComputeContext} from the board that owns `node`, so `#parent.*`
 * paths on a variant root resolve against the board surface, such as its background color.
 */
function buildBoardComputeContext(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
): ComputeContext | null {
  const board = findComponentForNode(node, workspace, compositionParentByChild)
  if (!board) return null

  const theme = resolveBoardTheme(board, workspace)
  const properties = mergeEffectiveProperties(
    expandPresetSources(
      [getComponentPropertyDefaults(), getOwnProperties(board)],
      () => theme,
    ),
  )

  return {
    properties,
    parentContext: null,
    theme,
  }
}

function buildComputeContext(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  visited: Set<string>,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
  rootParentFallback?: "board",
  state?: NodeState,
): ComputeContext {
  const parentNode = findParentNode(node, workspace, compositionParentByChild)

  let theme: ComputedTheme
  let parentContext: ComputeContext | null

  if (parentNode && !visited.has(parentNode.id)) {
    visited.add(parentNode.id)
    parentContext = buildComputeContext(
      parentNode,
      workspace,
      visited,
      compositionParentByChild,
      rootParentFallback,
      state,
    )
    // A node's effective theme is its own theme, otherwise the nearest
    // ancestor's. The parent chain is already resolved here, so inherit the
    // parent's computed theme instead of re-walking to the root per node.
    const ownThemeId = normalizeThemeRef(node.theme)
    theme = ownThemeId
      ? getComputedTheme(ownThemeId, workspace)
      : parentContext.theme
  } else {
    parentContext =
      !parentNode && rootParentFallback === "board"
        ? buildBoardComputeContext(node, workspace, compositionParentByChild)
        : null
    const themeId = getEffectiveThemeId(
      node,
      workspace,
      compositionParentByChild,
    )
    theme = getComputedTheme(themeId, workspace)
  }

  const effectiveProperties = getEffectiveNodeProperties(node.id, workspace, {
    theme,
    state,
  })

  const layoutMode = resolveLayoutMode(
    node as EntryNode,
    workspace as Workspace,
  )

  return {
    properties: effectiveProperties,
    parentContext,
    theme,
    layoutMode,
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
  options: Pick<
    ComputeNodePropertiesOptions,
    "parentIndex" | "rootParentFallback" | "state"
  > = {},
): ComputeContext {
  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = getBoardOrPlayground(workspace, targetId)
    const theme = resolveBoardTheme(board, workspace)
    const effectiveProperties = getEffectiveNodeProperties(
      targetId,
      workspace,
      { theme },
    )
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
    options.rootParentFallback,
    options.state,
  )
}

export function computeNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: ComputeNodePropertiesOptions = {},
): Properties {
  if (options.stage === "effective") {
    return getEffectiveNodeProperties(targetId, workspace, {
      parentIndex: options.parentIndex,
      state: options.state,
    })
  }

  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = getBoardOrPlayground(workspace, targetId)
    const theme = resolveBoardTheme(board, workspace)
    const effectiveProperties = getEffectiveNodeProperties(
      targetId,
      workspace,
      { theme },
    )
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
    options.rootParentFallback,
    options.state,
  )
  const inputProperties = context.properties

  return computeProperties(inputProperties, context)
}

export type { WorkspacePropertySource }
