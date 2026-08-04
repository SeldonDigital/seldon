import { getComponentSchema } from "../../components/catalog"
import { isComponentId } from "../../components/constants"
import { computeProperties } from "../../properties/compute"
import { mergeProperties } from "../../properties/helpers/merge-properties"
import { expandLookPresetFacets, hasExpandableLookPreset } from "../../themes/looks"
import { getComponentPropertyDefaults } from "../helpers/components/get-component-property-defaults"
import { getNodeParentIndex } from "../helpers/graph/build-node-parent-index"
import { getNodeCatalogId } from "../helpers/nodes/get-node-catalog-id"
import { resolveLayoutMode } from "../helpers/nodes/resolve-layout-mode"
import { NORMAL_STATE } from "../model/node-state"
import { parseNodeTemplate, parseThemeTemplate } from "../model/template-ref"
import { getComputedTheme } from "./compute-workspace-themes"

import type { ComponentId } from "../../components/constants"
import type { ComputeContext } from "../../properties/compute"
import type { Properties } from "../../properties/types/properties"
import type { ComputedTheme } from "../../themes/types/theme"
import type { EntryNodeStates, NodeState } from "../model/node-state"
import type { Board, EntryNode, Workspace } from "../types"
import type { WorkspaceThemeEntries } from "./compute-workspace-themes"

type NodeRecord = Record<string, WorkspaceNode>
type BoardRecord = Record<string, WorkspaceComponent>

interface WorkspaceNode {
  id: string
  template?: string
  overrides?: Properties
  states?: EntryNodeStates
  theme?: string | null
}

interface WorkspaceComponent {
  id?: string
  type?: Board["type"]
  catalogId?: string
  componentProperties?: Properties
  componentTheme?: string | null
  variants?: Array<string | { id: string }>
}

interface WorkspacePropertySource {
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
   * Interaction state to resolve. When omitted or `"normal"`, only the Normal
   * (`overrides`) layer is used. When set to a reserved or custom state name,
   * each node's `states[state]` bag is layered on top of its Normal overrides
   * along the template chain.
   */
  state?: NodeState
}

function getNodes(workspace: WorkspacePropertySource): NodeRecord {
  return workspace.nodes ?? {}
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

function getOwnProperties(source: WorkspaceNode | WorkspaceComponent): Properties {
  return (
    ("overrides" in source ? source.overrides : undefined) ??
    ("componentProperties" in source ? source.componentProperties : undefined) ??
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
  return board.componentTheme ?? null
}

function getNodeComponentId(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
): ComponentId | null {
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

  return normalizeThemeRef(board ? getComponentThemeRef(board) : null) ?? "seldon"
}

export function mergeEffectiveProperties(sources: Properties[]): Properties {
  return sources.reduce((merged, source) => mergeProperties(merged, source), {} as Properties)
}

/**
 * Options for effective-merge readers that already resolved theme context. `theme` expands look
 * preset facets and is resolved lazily when omitted. `parentIndex` supplies theme inheritance when
 * `theme` is omitted. `state` is the interaction state to resolve. When omitted or `"normal"`, only
 * Normal overrides are merged. Otherwise each node's `states[state]` bag layers on top of its Normal
 * overrides along the template chain.
 */
export interface EffectivePropertiesOptions {
  theme?: ComputedTheme
  parentIndex?: ReadonlyMap<string, string>
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
    getEffectiveThemeId(node, workspace, parentIndex ?? getNodeParentIndex(workspace)),
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
  const ancestor = getTemplatePropertySources(templateNode, workspace, visited, state)

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
      [schemaProperties, ...templateSources.normal, ...templateSources.state],
      () => options.theme ?? resolveNodeTheme(node, workspace, options.parentIndex),
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

interface EffectivePropertiesMemo {
  theme: ComputedTheme
  state: NodeState
  templateRefs: readonly WorkspaceNode[]
  result: Properties
}

/**
 * Cross-version reuse of effective properties, keyed by the Immer-stable node
 * entry. Reducers preserve the entry reference for nodes an edit does not touch,
 * so an unchanged node with an unchanged template chain returns the identical
 * `Properties` object across edits, which lets downstream compute-context and
 * CSS memoization hit from one edit to the next. Bounded per node so varied
 * theme, state, and template combinations cannot grow it without limit. Entries
 * fall away with their node when a workspace revision is dropped, since the
 * WeakMap key is the node object itself.
 */
const CROSS_VERSION_EFFECTIVE_LIMIT = 8
const crossVersionEffectiveCache = new WeakMap<object, EffectivePropertiesMemo[]>()

/** Shallow reference equality over two arrays of objects. */
function sameObjectRefs(a: readonly object[], b: readonly object[]): boolean {
  if (a.length !== b.length) return false

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return false
  }

  return true
}

/**
 * The template-chain node entries a node's effective properties depend on, from
 * the closest template to the farthest. Editing a template changes its entry
 * reference while leaving the referencing node's entry untouched, so comparing
 * these references detects template edits the node-entry key alone would miss.
 */
function collectTemplateChainRefs(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
): WorkspaceNode[] {
  const refs: WorkspaceNode[] = []
  const visited = new Set<string>([node.id])
  let cursor = getTemplateNode(node, workspace)

  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id)
    refs.push(cursor)
    cursor = getTemplateNode(cursor, workspace)
  }

  return refs
}

export function getEffectiveNodeProperties(
  targetId: string,
  workspace: WorkspacePropertySource,
  options: EffectivePropertiesOptions = {},
): Properties {
  const theme = options.theme

  if (!theme) {
    return computeEffectiveNodeProperties(targetId, workspace, options)
  }

  const state = options.state ?? NORMAL_STATE
  const cacheKey = `${targetId}|${theme.id}|${state}`
  let byKey = effectivePropertiesCache.get(workspace as object)
  const cached = byKey?.get(cacheKey)

  if (cached) return cached

  const node = getNodes(workspace)[targetId]
  const result = node
    ? reuseOrComputeEffectiveProperties(node, targetId, workspace, options, theme, state)
    : computeEffectiveNodeProperties(targetId, workspace, options)

  if (!byKey) {
    byKey = new Map<string, Properties>()
    effectivePropertiesCache.set(workspace as object, byKey)
  }

  byKey.set(cacheKey, result)

  return result
}

/**
 * Returns the prior `Properties` object when the node entry, its template chain,
 * the resolved theme, and the state are all unchanged, so unchanged nodes keep
 * one reference across edits. The theme is compared by reference, not id, so a
 * theme edit (which builds a new computed theme with the same id) correctly
 * invalidates look-preset expansion. Otherwise computes and records a fresh
 * entry.
 */
function reuseOrComputeEffectiveProperties(
  node: WorkspaceNode,
  targetId: string,
  workspace: WorkspacePropertySource,
  options: EffectivePropertiesOptions,
  theme: ComputedTheme,
  state: NodeState,
): Properties {
  const templateRefs = collectTemplateChainRefs(node, workspace)
  const memos = crossVersionEffectiveCache.get(node)
  const hit = memos?.find(
    (memo) =>
      memo.theme === theme &&
      memo.state === state &&
      sameObjectRefs(memo.templateRefs, templateRefs),
  )

  if (hit) return hit.result

  const result = computeEffectiveNodeProperties(targetId, workspace, options)
  const memo: EffectivePropertiesMemo = { theme, state, templateRefs, result }

  if (memos) {
    memos.push(memo)
    if (memos.length > CROSS_VERSION_EFFECTIVE_LIMIT) memos.shift()
  } else {
    crossVersionEffectiveCache.set(node, [memo])
  }

  return result
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
      () => options.theme ?? resolveNodeTheme(node, workspace, options.parentIndex),
    ),
  )
}

interface BoardContextMemo {
  theme: ComputedTheme
  context: ComputeContext
}

/**
 * Cross-version reuse of the board surface context, keyed by the Immer-stable
 * board entry. A variant root's parent context is this object, so keeping it
 * reference-stable across node edits is what lets every context above the
 * changed node stay stable too. Recomputed when the board entry or its resolved
 * theme changes.
 */
const boardContextCache = new WeakMap<object, BoardContextMemo>()

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
  const cached = boardContextCache.get(board)

  if (cached && cached.theme === theme) return cached.context

  const properties = mergeEffectiveProperties(
    expandPresetSources([getComponentPropertyDefaults(), getOwnProperties(board)], () => theme),
  )

  const context: ComputeContext = {
    properties,
    parentContext: null,
    theme,
  }

  boardContextCache.set(board, { theme, context })

  return context
}

interface ComputeContextMemo {
  parentContext: ComputeContext | null
  theme: ComputedTheme
  properties: Properties
  layoutMode: ReturnType<typeof resolveLayoutMode>
  state: NodeState
  context: ComputeContext
}

/**
 * Cross-version reuse of a node's {@link ComputeContext}, keyed by the
 * Immer-stable node entry. Bounded per node so a shared child drawn under
 * several columns (each with its own parent context) cannot grow it without
 * limit. Entries fall away with their node when a workspace revision is dropped.
 */
const COMPUTE_CONTEXT_LIMIT = 8
const computeContextCache = new WeakMap<object, ComputeContextMemo[]>()

function buildComputeContext(
  node: WorkspaceNode,
  workspace: WorkspacePropertySource,
  visited: Set<string>,
  compositionParentByChild: ReadonlyMap<string, string> | undefined,
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
      state,
    )
    // A node's effective theme is its own theme, otherwise the nearest
    // ancestor's. The parent chain is already resolved here, so inherit the
    // parent's computed theme instead of re-walking to the root per node.
    const ownThemeId = normalizeThemeRef(node.theme)

    theme = ownThemeId ? getComputedTheme(ownThemeId, workspace) : parentContext.theme
  } else {
    // A variant root's parent is its owning board, so `#parent.*` paths and the
    // high-contrast / match-color surface walk resolve against the board the
    // same way for every consumer. A cycle guard hit (parentNode already
    // visited) has no board to stand in for.
    parentContext = parentNode
      ? null
      : buildBoardComputeContext(node, workspace, compositionParentByChild)
    const themeId = getEffectiveThemeId(node, workspace, compositionParentByChild)

    theme = getComputedTheme(themeId, workspace)
  }

  const effectiveProperties = getEffectiveNodeProperties(node.id, workspace, {
    theme,
    state,
  })

  const layoutMode = resolveLayoutMode(node as EntryNode, workspace as Workspace)
  const resolvedState = state ?? NORMAL_STATE

  // Cross-version reuse of the whole context. Every input below is already
  // reference-stable for an unchanged subtree (`parentContext` from the cached
  // recursion or board context, `effectiveProperties` from the cross-version
  // effective cache, `theme` from the themes cache, `layoutMode` a primitive),
  // so returning the prior object keeps `ComputeContext` identity stable across
  // edits. That lets the renderer's CSS memo hit and skip regeneration for
  // untouched nodes. `parentContext` distinguishes the same shared child drawn
  // under different columns.
  const memos = computeContextCache.get(node)
  const hit = memos?.find(
    (memo) =>
      memo.parentContext === parentContext &&
      memo.theme === theme &&
      memo.properties === effectiveProperties &&
      memo.layoutMode === layoutMode &&
      memo.state === resolvedState,
  )

  if (hit) return hit.context

  const context: ComputeContext = {
    properties: effectiveProperties,
    parentContext,
    theme,
    layoutMode,
  }
  const memo: ComputeContextMemo = {
    parentContext,
    theme,
    properties: effectiveProperties,
    layoutMode,
    state: resolvedState,
    context,
  }

  if (memos) {
    memos.push(memo)
    if (memos.length > COMPUTE_CONTEXT_LIMIT) memos.shift()
  } else {
    computeContextCache.set(node, [memo])
  }

  return context
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
  options: Pick<ComputeNodePropertiesOptions, "parentIndex" | "state"> = {},
): ComputeContext {
  const node = getNodes(workspace)[targetId]

  if (!node) {
    const board = getBoardOrPlayground(workspace, targetId)
    const theme = resolveBoardTheme(board, workspace)
    const effectiveProperties = getEffectiveNodeProperties(targetId, workspace, { theme })

    return {
      properties: effectiveProperties,
      parentContext: null,
      theme,
    }
  }

  const compositionParentByChild = options.parentIndex ?? getNodeParentIndex(workspace)

  return buildComputeContext(
    node,
    workspace,
    new Set([node.id]),
    compositionParentByChild,
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
    const effectiveProperties = getEffectiveNodeProperties(targetId, workspace, { theme })

    return computeProperties(effectiveProperties, {
      properties: effectiveProperties,
      parentContext: null,
      theme,
    })
  }

  const compositionParentByChild = options.parentIndex ?? getNodeParentIndex(workspace)

  const context = buildComputeContext(
    node,
    workspace,
    new Set([node.id]),
    compositionParentByChild,
    options.state,
  )
  const inputProperties = context.properties

  return computeProperties(inputProperties, context)
}

export type { WorkspacePropertySource }
