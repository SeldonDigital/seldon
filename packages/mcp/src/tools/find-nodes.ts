import { z } from "zod"

import { getCompositionContainerEntries } from "@seldon/core/workspace/helpers/general/get-composition-containers"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type {
  ComponentTreeRef,
  EntryNode,
  Workspace,
} from "@seldon/core/workspace/types"

import { ToolError } from "../errors"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const findNodesInputSchema = {
  query: z
    .string()
    .min(1)
    .describe(
      "Space-separated terms, all of which must match. A bare term matches " +
        "as a case-insensitive substring of a node's label, ref, component " +
        'id, type, or level. A "key=value" term matches nodes whose OWN ' +
        'override of that property contains the value ("key=" alone matches ' +
        "any node overriding that key).",
    ),
  boardKey: z
    .string()
    .optional()
    .describe("Restrict the search to one component board or playground."),
}

/** Results are capped to keep responses small; totalMatches reports the uncapped count. */
const MATCH_CAP = 50

export interface NodeMatch {
  id: string
  label: string
  type: EntryNode["type"]
  level: EntryNode["level"]
  /** Catalog component this node ultimately derives from. */
  componentId: string | null
  boardKey: string
  /** Ancestor labels from the variant root down to this node's parent. */
  path: string[]
}

export interface FindNodesResult {
  matches: NodeMatch[]
  totalMatches: number
  truncated: boolean
}

interface QueryPart {
  kind: "term" | "property"
  key?: string
  value: string
}

function parseQuery(query: string): QueryPart[] {
  return query
    .split(/\s+/)
    .filter(Boolean)
    .map((part): QueryPart => {
      const eq = part.indexOf("=")
      if (eq > 0) {
        return {
          kind: "property",
          key: part.slice(0, eq),
          value: part.slice(eq + 1).toLowerCase(),
        }
      }
      return { kind: "term", value: part.toLowerCase() }
    })
}

function matchesNode(
  parts: QueryPart[],
  node: EntryNode,
  componentId: string | null,
): boolean {
  for (const part of parts) {
    if (part.kind === "property") {
      const override = (
        node.overrides as Record<string, unknown> | undefined
      )?.[part.key!]
      if (override === undefined) return false
      if (
        part.value !== "" &&
        !JSON.stringify(override).toLowerCase().includes(part.value)
      ) {
        return false
      }
      continue
    }
    const haystack = [
      node.label,
      node.ref ?? "",
      componentId ?? "",
      node.type,
      node.level,
    ]
    if (!haystack.some((field) => field.toLowerCase().includes(part.value))) {
      return false
    }
  }
  return true
}

/**
 * The find_nodes tool: deterministic search over node
 * labels, component types, refs, and override values across every
 * composition tree. Feeds sweep workflows: find_nodes → one
 * apply_actions batch over the returned ids.
 */
export function findNodes(
  ctx: ToolContext,
  input: { query: string; boardKey?: string },
): FindNodesResult {
  const { workspace } = ctx.session.requireOpen()
  const parts = parseQuery(input.query)

  let containers = getCompositionContainerEntries(workspace).filter(
    ([, container]) =>
      container.type === "component" || container.type === "playground",
  )
  if (input.boardKey !== undefined) {
    containers = containers.filter(([key]) => key === input.boardKey)
    if (containers.length === 0) {
      throw new ToolError({
        code: "board_not_found",
        message: `No component board or playground has the key "${input.boardKey}".`,
        recovery:
          "Use a board key from get_workspace_outline, or search without boardKey.",
      })
    }
  }

  const matches: NodeMatch[] = []
  let totalMatches = 0

  const visit = (
    boardKey: string,
    ref: ComponentTreeRef,
    path: string[],
  ): void => {
    const node = workspace.nodes[ref.id]
    if (!node) return
    const componentId = getNodeCatalogId(node, workspace as Workspace)

    if (matchesNode(parts, node, componentId)) {
      totalMatches++
      if (matches.length < MATCH_CAP) {
        matches.push({
          id: node.id,
          label: node.label,
          type: node.type,
          level: node.level,
          componentId,
          boardKey,
          path,
        })
      }
    }

    const childPath = [...path, node.label]
    for (const child of ref.children ?? []) {
      visit(boardKey, child, childPath)
    }
  }

  for (const [key, container] of containers) {
    for (const rootRef of container.variants as ComponentTreeRef[]) {
      visit(key, rootRef, [])
    }
  }

  return redactValue({
    matches,
    totalMatches,
    truncated: totalMatches > matches.length,
  })
}
