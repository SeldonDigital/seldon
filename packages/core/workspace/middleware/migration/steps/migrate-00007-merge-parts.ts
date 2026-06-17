import { ValueType } from "../../../../properties/constants"
import { BackgroundKind } from "../../../../properties/values/appearance/background/background-kind"
import { Align } from "../../../../properties/values/layout/align"
import { Gap } from "../../../../properties/values/layout/gap"
import { Orientation } from "../../../../properties/values/layout/orientation"
import { Resize } from "../../../../properties/values/layout/resize"
import { isComponentBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import {
  formatNodeCatalog,
  parseNodeCatalog,
} from "../../../model/template-ref"
import type { Workspace } from "../../../model/workspace"

/**
 * Former list and card part component ids that are now variants of a host
 * component. Each entry names the host id the merge folds the component into
 * and the signature property overrides that recreate the variant's root look.
 * Signature overrides are layered beneath a node's own overrides, so user edits
 * win. Variant child subtrees survive because nodes reference children by id.
 */
const MERGE_MAP: Record<
  string,
  { host: string; signature: Record<string, unknown> }
> = {
  listContacts: {
    host: "listStandard",
    signature: {},
  },
  listProducts: {
    host: "listStandard",
    signature: {},
  },
  listTodo: {
    host: "listStandard",
    signature: {},
  },
  listGrid: {
    host: "listStandard",
    signature: {
      orientation: { type: ValueType.OPTION, value: Orientation.HORIZONTAL },
      align: { type: ValueType.OPTION, value: Align.TOP_LEFT },
      gap: { type: ValueType.THEME_ORDINAL, value: "@gap.cozy" },
      wrapChildren: { type: ValueType.EXACT, value: true },
    },
  },
  cardHorizontal: {
    host: "cardStacked",
    signature: {
      orientation: { type: ValueType.OPTION, value: Orientation.HORIZONTAL },
      align: { type: ValueType.OPTION, value: Align.CENTER },
      width: { type: ValueType.OPTION, value: Resize.FILL },
      gap: { type: ValueType.OPTION, value: Gap.EVENLY_SPACED },
    },
  },
  cardProduct: {
    host: "cardStacked",
    signature: {
      width: { type: ValueType.OPTION, value: Resize.FILL },
      gap: { type: ValueType.OPTION, value: Gap.EVENLY_SPACED },
      background: [
        {
          kind: { type: ValueType.OPTION, value: BackgroundKind.IMAGE },
          image: {
            type: ValueType.EXACT,
            value: "https://static.seldon.app/background-default-light.jpg",
          },
          blendMode: { type: ValueType.EMPTY, value: null },
          position: { type: ValueType.EMPTY, value: null },
          size: { type: ValueType.EMPTY, value: null },
          repeat: { type: ValueType.EMPTY, value: null },
          filter: { type: ValueType.EMPTY, value: null },
        },
      ],
    },
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
 * v7: folds `listContacts`, `listProducts`, `listGrid`, and `listTodo` into
 * `listStandard` variants and `cardHorizontal` and `cardProduct` into
 * `cardStacked` variants. It rewrites every `catalog:{droppedId}` node template
 * and component board `catalogId` to the host id and preserves each former
 * variant's root look through signature overrides. Existing child subtrees are
 * referenced by node id, so list and card children survive untouched.
 */
export function migrateV7MergeParts(workspace: Workspace): Workspace {
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
