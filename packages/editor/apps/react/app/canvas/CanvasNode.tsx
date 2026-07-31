"use client"

import { useThemeById } from "@app/themes/hooks/use-theme-by-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { buildChildRenders } from "@seldon/editor/lib/canvas/node-render/build-child-renders"
import { resolveRenderAsDiv } from "@seldon/editor/lib/canvas/node-render/resolve-render-as-div"
import { buildCanvasSelectionAttributes } from "@seldon/editor/lib/canvas/node-render/selection-attributes"
import { isWorkspaceIconUnavailable } from "@seldon/editor/lib/icon-sets/icon-availability"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { buildRenderParentIndex } from "@seldon/editor/lib/workspace/render-parent-index"
import { buildContext } from "@seldon/factory/helpers/compute-workspace"
import { memo, useMemo } from "react"

import { Display, ValueType, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { NORMAL_STATE } from "@seldon/core/workspace/model/node-state"

import { ComponentRenderer } from "./ComponentRenderer"
import { useAddNodeFontFamily } from "./hooks/use-add-node-font-family"
import { getPropertyHtmlAttributes } from "./property-html-attributes"

import type { CanvasHtmlAttributes } from "./ComponentRenderer"
import type { Board, Instance, InstanceId, Properties, Variant, VariantId } from "@seldon/core"
import type { IconId } from "@seldon/core/icon-sets"
import type { ThemeInstanceId } from "@seldon/core/themes/types"
import type { NodeState } from "@seldon/core/workspace/model/node-state"

export type CanvasNodeProps = {
  nodeId: VariantId | InstanceId
  initialThemeId: ThemeInstanceId
  parentNode?: Variant | Instance | Board
  isRoot?: boolean
  /**
   * Node-id path of this copy, from the variant-root down to this node, joined
   * by "/". Stamped as `data-selection-root-id` so a child id shared across
   * columns resolves to the clicked copy. Defaults to the node id at a root.
   */
  rootPath?: string
  /**
   * Active interaction state for the board. Threaded from the board down so the
   * whole tree renders the selected state. Defaults to Normal.
   */
  activeState?: NodeState
  /**
   * Per-echo text/icon preview values keyed by descendant node id, threaded
   * down a repeated subtree. A matching descendant renders this value for its
   * `content` (text) or `symbol` (icon) instead of its own. Editor preview only.
   */
  repeatOverrides?: Record<string, string>
}

export const CanvasNode = memo(function CanvasNode({
  nodeId,
  initialThemeId,
  isRoot = false,
  rootPath,
  activeState = NORMAL_STATE,
  repeatOverrides,
}: CanvasNodeProps) {
  const { workspace } = useWorkspace()
  const node = workspace.nodes[nodeId]

  if (!node) {
    return null
  }

  // Add the font family to the editor fonts - must be called before any early returns
  useAddNodeFontFamily(nodeId)

  // Node-id path from the variant root down to this node. A shared child id can
  // appear under several variant trees, so this render-position path tells the
  // compute pipeline which parent to resolve `#parent.*` against.
  const selfPath = rootPath ?? nodeId
  const renderParentIndex = useMemo(() => buildRenderParentIndex(selfPath), [selfPath])

  // Memoize the compute context so it stays referentially stable while the node
  // and workspace are unchanged, letting ComponentRenderer's CSS memo hit.
  const computeContext = useMemo(
    () => buildContext(node, workspace, renderParentIndex, activeState),
    [node, workspace, renderParentIndex, activeState],
  )

  /**
   * For the children of the root screen initialThemeId is set to the theme of the screen
   * A node's theme should either be that, unless it's explicitly set. If that's the case
   * We should hold that value until a new 'branch' of the tree is found with a new theme
   *
   * Note: This only works because we're a standard algorithm that traverses the tree from top to bottom
   */
  const themeId = node.theme || initialThemeId
  const theme = useThemeById(themeId)

  invariant(theme, `Theme ${themeId} not found`)

  const catalogComponentId = getNodeCatalogComponentId(node, workspace)

  if (!catalogComponentId) {
    console.warn(`Skipping node ${nodeId} with no catalog component id`)

    return null
  }

  let component

  try {
    component = getComponentSchema(catalogComponentId)
  } catch {
    console.warn(
      `Skipping node ${nodeId} with invalid component ID in CanvasNode: ${catalogComponentId}`,
    )

    return null // Don't render nodes with invalid component IDs
  }

  const nodeProperties = getNodeProperties(node, workspace)

  // Don't render the node at all if it's set to be hidden
  if (nodeProperties?.display?.value === Display.EXCLUDE) {
    return null
  }

  const renderAsDiv = resolveRenderAsDiv(node, workspace, nodeId, catalogComponentId)

  const iconUnavailable =
    catalogComponentId === ComponentId.ICON &&
    isWorkspaceIconUnavailable(nodeProperties?.symbol?.value as IconId | undefined, workspace)

  // A shared child id renders once per variant column. Scope the style class by
  // render position so each copy's computed CSS (e.g. an icon sized from its own
  // parent's buttonSize) does not collide on a single `node-<id>` selector.
  // Repeat echoes share index 0's render position, so they intentionally share
  // its style scope: one node painted N times, identical styling.
  const styleScopeId = selfPath.replace(/[^a-zA-Z0-9_-]/g, "-") as InstanceId | VariantId

  // Echoes of a repeated child preview a per-index text/icon value instead of
  // the node's own. This is a render-only override; the node's stored content
  // and symbol are untouched.
  const repeatValue = repeatOverrides?.[nodeId]
  let renderContext = computeContext

  if (repeatValue != null) {
    const overriddenProperties: Properties = { ...computeContext.properties }

    if (catalogComponentId === ComponentId.ICON) {
      overriddenProperties.symbol = {
        type: ValueType.EXACT,
        value: repeatValue as IconId,
      }
    } else {
      overriddenProperties.content = {
        type: ValueType.EXACT,
        value: repeatValue,
      }
    }

    renderContext = { ...computeContext, properties: overriddenProperties }
  }

  const styleOverrides = isRoot
    ? catalogComponentId === ComponentId.SANDBOX
      ? { position: "absolute" as const }
      : { position: "relative" as const }
    : undefined

  const htmlAttributes: CanvasHtmlAttributes = {
    ...buildCanvasSelectionAttributes({
      nodeId: node.id,
      selfPath,
      catalogComponentId,
    }),
    ...getPropertyHtmlAttributes(nodeProperties),
  }

  const childRenders = buildChildRenders(node, workspace, selfPath, repeatOverrides)
  const children = childRenders.map((child) => (
    <CanvasNode
      key={child.key}
      parentNode={node}
      nodeId={child.nodeId as InstanceId | VariantId}
      initialThemeId={themeId as ThemeInstanceId}
      rootPath={child.rootPath}
      activeState={activeState}
      repeatOverrides={child.repeatOverrides}
    />
  ))

  return (
    <ComponentRenderer
      computeContext={renderContext}
      styleOverrides={styleOverrides}
      componentId={component.id}
      htmlAttributes={htmlAttributes}
      nodeId={styleScopeId}
      renderAsDiv={renderAsDiv}
      iconUnavailable={iconUnavailable}
    >
      {children}
    </ComponentRenderer>
  )
})
