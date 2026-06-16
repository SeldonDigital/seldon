import { ValueType } from "../../../../properties/constants"
import { HtmlElement } from "../../../../properties/values/attributes/html-element"
import { isComponentBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import {
  formatNodeCatalog,
  parseNodeCatalog,
} from "../../../model/template-ref"
import type { Workspace } from "../../../model/workspace"

/**
 * Former primitive component ids that are now variants of a host primitive.
 * Each entry names the host id the merge folds the component into and the
 * signature property overrides that recreate the variant's look. Signature
 * overrides are layered beneath a node's own overrides, so user edits win.
 */
const MERGE_MAP: Record<
  string,
  { host: string; signature: Record<string, unknown> }
> = {
  description: {
    host: "text",
    signature: {
      htmlElement: { type: ValueType.OPTION, value: HtmlElement.P },
      font: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@font.body" },
      },
    },
  },
  codeblock: {
    host: "text",
    signature: {
      htmlElement: { type: ValueType.OPTION, value: HtmlElement.PRE },
      font: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@font.code" },
      },
    },
  },
  option: {
    host: "text",
    signature: {
      htmlElement: { type: ValueType.OPTION, value: HtmlElement.OPTION },
      font: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@font.label" },
      },
      lines: { type: ValueType.EXACT, value: 2 },
    },
  },
  tableInput: {
    host: "tableData",
    signature: {},
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

/** Rewrites a node template and merges variant signature overrides under existing ones. */
function migrateNode(node: EntryNode): EntryNode {
  const parsed = parseNodeCatalog(node.template)
  if (!parsed) return node

  const entry = MERGE_MAP[parsed.componentId]
  if (!entry) return node

  const existing = isRecord(node.overrides)
    ? (node.overrides as Record<string, unknown>)
    : {}

  return {
    ...node,
    template: formatNodeCatalog(entry.host),
    overrides: { ...entry.signature, ...existing } as typeof node.overrides,
  }
}

/**
 * v5: folds the `description`, `codeblock`, and `option` primitives into `text`
 * variants and `tableInput` into a `tableData` variant. It rewrites every
 * `catalog:{droppedId}` node template and component board `catalogId` to the
 * host id and preserves each former variant's look through signature overrides.
 */
export function migrateV5MergeTextPrimitives(workspace: Workspace): Workspace {
  const next: Workspace = {
    ...workspace,
    nodes: { ...workspace.nodes },
    boards: { ...workspace.boards },
  }

  for (const [nodeId, node] of Object.entries(next.nodes) as Array<
    [string, EntryNode]
  >) {
    next.nodes[nodeId] = migrateNode(node)
  }

  for (const [boardKey, board] of Object.entries(next.boards) as Array<
    [string, Board]
  >) {
    if (!isComponentBoard(board)) continue

    const entry = MERGE_MAP[board.catalogId]
    if (!entry) continue

    next.boards[boardKey] = { ...board, catalogId: entry.host }
  }

  return next
}
