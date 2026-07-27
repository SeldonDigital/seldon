import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { findComponentSchema } from "@seldon/core/components/catalog"
import { computeNodeProperties } from "@seldon/core/workspace/compute"
import { getNodeParentIndex } from "@seldon/core/workspace/helpers/graph/build-node-parent-index"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import { isTaggedValue } from "../../../prompt/property-taxonomy"
import { resolveNodeTarget } from "../resolve-target"
import { textResult } from "./commit"
import { applyPropertyEdit } from "./set-properties"

import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { Workspace } from "@seldon/core/workspace/types"

/** Position words the tool accepts, mapped to the 2D container anchor. */
const ALIGN_BY_POSITION: Record<string, string> = {
  center: "center",
  left: "left",
  right: "right",
  top: "top-center",
  bottom: "bottom-center",
  "top-left": "top-left",
  "top-right": "top-right",
  "bottom-left": "bottom-left",
  "bottom-right": "bottom-right",
}

/** Horizontal positions that a Text node can satisfy with inline textAlign. */
const TEXT_ALIGN_BY_POSITION: Record<string, string> = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
}

const POSITIONS = [...Object.keys(ALIGN_BY_POSITION), "justify"] as const

/** The settable keys of the component a node instantiates, or an empty set. */
function exposedKeys(workspace: Workspace, nodeId: string): Set<string> {
  const node = workspace.nodes?.[nodeId]

  if (!node) return new Set()
  const catalogId = getNodeCatalogId(node, workspace)

  if (!catalogId) return new Set()
  const schema = findComponentSchema(catalogId)

  if (!schema?.properties) return new Set()

  return new Set(Object.keys(schema.properties))
}

/** True when the node's effective width is the "fill" resize option. */
function widthIsFill(workspace: Workspace, nodeId: string): boolean {
  const effective = computeNodeProperties(nodeId, workspace, {
    stage: "effective",
  }) as Record<string, unknown>
  const width = effective.width

  return isTaggedValue(width) && width.type === "option" && width.value === "fill"
}

/**
 * Intent verb: anchor a node within its container, or align its text. Seldon
 * layout is container-driven, so the property is not obvious: text that fills
 * its box centers by inline textAlign, while text that hugs its content, or any
 * node placed at an edge, anchors through the container's align on the parent.
 * This reads the node's width and picks the right property. It does not reorder.
 */
export function createSetAlignTool(state: PiTurnState, resolved: ResolvedContext): ToolDefinition {
  return defineTool({
    name: "align",
    label: "Align",
    description:
      'Anchor a node within its container, or align its text: "center the title", "move the image to the top", "put the button on the right". It reads the node to pick the right property (inline textAlign for filled text, the container align anchor otherwise). Do not use it to reorder items in a stack; use reorder_component for that.',
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      position: Type.Union(
        POSITIONS.map((position) => Type.Literal(position)),
        {
          description:
            "Where to place it: center, left, right, top, bottom, a corner, or justify (text only).",
        },
      ),
      match: Type.Optional(
        Type.String({
          description: "Label or catalog id to locate the node when out of scope.",
        }),
      ),
    }),

    execute: async (_id, params) => {
      const resolution = resolveNodeTarget(
        state.workspace,
        resolved.resolvedKey,
        resolved.selectedNodeId,
        resolved.selectedBoardId,
        params.target as TargetSpec,
        params.match,
        resolved.scope,
        resolved.isolation?.allowedBoardKeys,
      )

      if (resolution.kind === "message") return textResult(resolution.text)

      const nodeId = resolution.nodeId
      const position = params.position
      const keys = exposedKeys(state.workspace, nodeId)

      // Filled text centers by inline textAlign; everything else anchors within
      // the parent container. A vertical or corner position never uses textAlign.
      const textAlign = TEXT_ALIGN_BY_POSITION[position]

      if (keys.has("textAlign") && textAlign && widthIsFill(state.workspace, nodeId)) {
        return textResult(
          applyPropertyEdit(state, resolved, {
            target: { nodeId },
            properties: {
              textAlign: { type: "option", value: textAlign },
            },
            match: params.match,
          }),
        )
      }

      const anchor = ALIGN_BY_POSITION[position] ?? "center"
      const parentId = getNodeParentIndex(state.workspace).get(nodeId)
      const parentExposesAlign =
        parentId !== undefined && exposedKeys(state.workspace, parentId).has("align")
      // Anchor within the parent container. When there is no parent, or it takes
      // no align, fall back to the node's own align when it is itself a container.
      const anchorNodeId = parentExposesAlign && parentId ? parentId : nodeId

      if (!exposedKeys(state.workspace, anchorNodeId).has("align")) {
        return textResult(
          `Cannot anchor ${nodeId}: neither it nor its container exposes an align property. Use set_properties, or reorder_component to change its order.`,
        )
      }

      return textResult(
        applyPropertyEdit(state, resolved, {
          target: { nodeId: anchorNodeId },
          properties: {
            align: { type: "option", value: anchor },
          },
          match: params.match,
        }),
      )
    },
  })
}
