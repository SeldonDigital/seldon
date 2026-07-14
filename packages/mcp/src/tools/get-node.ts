import { getCssObjectFromProperties } from "@seldon/factory/styles/css-properties/get-css-object-from-properties"
import type { CSSObject } from "@seldon/factory/styles/css-properties/types"
import type { StyleGenerationContext } from "@seldon/factory/styles/types"
import { z } from "zod"

import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getVariantTree } from "@seldon/core/workspace/helpers/components/get-variant-tree"
import { getCompositionContainerEntries } from "@seldon/core/workspace/helpers/general/get-composition-containers"
import type {
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"

import { ToolError } from "../errors"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getNodeInputSchema = {
  nodeId: z.string().describe("Id of a variant or instance node."),
  mode: z
    .enum(["raw", "computed"])
    .default("raw")
    .describe(
      '"raw" = the editing view: template ref plus this node\'s own sparse ' +
        'overrides. "computed" = the fully resolved values in CSS vocabulary ' +
        "(what would render).",
    ),
}

/** Child tree with identity only — ids, types, labels — never property bags. */
export interface NodeTreeEntry {
  id: string
  type?: string
  label?: string
  children?: NodeTreeEntry[]
}

export interface GetNodeResult {
  node: {
    id: string
    type: EntryNode["type"]
    level: EntryNode["level"]
    label: string
    theme: string | null
    template: string
    ref?: string
    origin?: string
    /** raw mode only */
    overrides?: EntryNode["overrides"]
    states?: EntryNode["states"]
    /** computed mode only: resolved values in CSS vocabulary. */
    css?: CSSObject
  }
  /** Key of the board or playground whose variant tree holds this node. */
  boardKey: string | null
  children: NodeTreeEntry[]
}

function toTreeEntry(
  workspace: Workspace,
  ref: ComponentTreeRef,
): NodeTreeEntry {
  const node = workspace.nodes[ref.id]
  return {
    id: ref.id,
    type: node?.type,
    label: node?.label,
    children: ref.children?.map((child) => toTreeEntry(workspace, child)),
  }
}

export function getNode(
  ctx: ToolContext,
  input: { nodeId: string; mode?: "raw" | "computed" },
): GetNodeResult {
  const { workspace } = ctx.session.requireOpen()
  const mode = input.mode ?? "raw"

  const node = workspace.nodes[input.nodeId]
  if (!node) {
    throw new ToolError({
      code: "node_not_found",
      message: `No node with id "${input.nodeId}" exists in this workspace.`,
      recovery:
        "Use get_workspace_outline to list boards and their variant ids, or " +
        "read created ids from your last apply_actions receipt.",
    })
  }

  const board = getBoardByNodeId(workspace, input.nodeId)
  const boardKey =
    getCompositionContainerEntries(workspace).find(
      ([, candidate]) => candidate === board,
    )?.[0] ?? null

  const refSubtree = board
    ? getVariantTree(board, input.nodeId as EntryNodeId)
    : null
  const children =
    refSubtree?.children?.map((child) => toTreeEntry(workspace, child)) ?? []

  const base = {
    id: node.id,
    type: node.type,
    level: node.level,
    label: node.label,
    theme: node.theme,
    template: node.template,
    ref: node.ref,
    origin: node.origin,
  }

  if (mode === "raw") {
    return redactValue({
      node: { ...base, overrides: node.overrides, states: node.states },
      boardKey,
      children,
    })
  }

  // Computed view (CSS vocabulary): resolve the full inheritance/theme chain
  // with Core's compute engine, then convert to CSS with the same Factory
  // helper the Editor canvas and the code export use.
  const context = getNodeComputeContext(input.nodeId, workspace)
  const css = getCssObjectFromProperties(
    context.properties,
    context as StyleGenerationContext,
  )

  return redactValue({
    node: { ...base, css },
    boardKey,
    children,
  })
}
