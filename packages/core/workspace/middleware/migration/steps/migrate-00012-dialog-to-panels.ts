import { REPEAT_EDITOR_KEY } from "../../../helpers/nodes/node-repeat"
import type { ComponentTreeRef } from "../../../model/component-tree"
import { isComponentBoard, isPlaygroundBoard } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"

/**
 * v12: rename the Dialog component to Panels.
 *
 * The component id changed from `dialog` to `panels`, and the exported
 * component name derives from that id. This step re-keys the whole Dialog
 * family so persisted workspaces export as Panels: the component board row, its
 * `catalogId` and label, every `component-dialog-*` node key and id, and every
 * reference to those ids (catalog and node template links, board variant and
 * child refs, and repeat data keys). Custom variants and instances follow,
 * because they resolve their catalog id up the same template chain.
 *
 * It also renames the friendly `label` on the schema-locked default node from
 * `Dialog` to the singular component name `Panel`, matching the label a freshly
 * created component would get. The board row uses the plural `Panels`. User
 * variants keep their own names, and a default a user already renamed is left
 * untouched.
 *
 * Guarded and idempotent so it is safe to re-run on files already migrated.
 */

const OLD_CATALOG_ID = "dialog"
const NEW_CATALOG_ID = "panel"
const OLD_NODE_LABEL = "Dialog"
const NEW_NODE_LABEL = "Panel"
const NEW_BOARD_LABEL = "Panels"
const OLD_NODE_PREFIX = "component-dialog-"
const NEW_NODE_PREFIX = "component-panel-"
const OLD_CATALOG_TEMPLATE = `catalog:${OLD_CATALOG_ID}`
const NEW_CATALOG_TEMPLATE = `catalog:${NEW_CATALOG_ID}`
const OLD_NODE_LINK_PREFIX = `node:${OLD_NODE_PREFIX}`

/** Maps a node id from the Dialog family to its Panels id, else returns it unchanged. */
function mapNodeId(id: string): string {
  return id.startsWith(OLD_NODE_PREFIX)
    ? NEW_NODE_PREFIX + id.slice(OLD_NODE_PREFIX.length)
    : id
}

/** Rewrites a node template ref (`catalog:` or `node:`) onto the Panels id. */
function mapTemplate(template: string): string {
  if (template === OLD_CATALOG_TEMPLATE) return NEW_CATALOG_TEMPLATE
  if (template.startsWith(OLD_NODE_LINK_PREFIX)) {
    return `node:${mapNodeId(template.slice("node:".length))}`
  }
  return template
}

/** Remaps `id` on a component tree ref and its descendants in place. */
function remapTreeRefs(refs: ComponentTreeRef[]): void {
  for (const ref of refs) {
    ref.id = mapNodeId(ref.id)
    if (ref.children) remapTreeRefs(ref.children)
  }
}

/** Remaps repeat data keys, which reference descendant node ids, in place. */
function remapRepeatData(node: EntryNode): void {
  const editor = node.__editor
  if (!editor) return
  const repeat = editor[REPEAT_EDITOR_KEY] as
    | { data?: Record<string, string[]> }
    | undefined
  if (!repeat || typeof repeat !== "object" || !repeat.data) return
  const remapped: Record<string, string[]> = {}
  for (const [descendantId, values] of Object.entries(repeat.data)) {
    remapped[mapNodeId(descendantId)] = values
  }
  repeat.data = remapped
}

/** True when any node or board still references the Dialog id. */
function migrationApplies(workspace: Workspace): boolean {
  for (const [key, node] of Object.entries(workspace.nodes)) {
    if (key.startsWith(OLD_NODE_PREFIX)) return true
    if (node.template === OLD_CATALOG_TEMPLATE) return true
    if (node.template.startsWith(OLD_NODE_LINK_PREFIX)) return true
    // Self-heal a workspace already re-keyed to Panels but left with the old
    // default label (migrated by an earlier build before the rename existed).
    if (
      node.type === "default" &&
      key.startsWith(NEW_NODE_PREFIX) &&
      node.label === OLD_NODE_LABEL
    ) {
      return true
    }
  }
  for (const [key, board] of Object.entries(workspace.boards)) {
    // A board still stored under the old `dialog` key needs repair even when an
    // earlier partial migration already flipped its `catalogId` to `panel`.
    if (key === OLD_CATALOG_ID) return true
    if (isComponentBoard(board) && board.catalogId === OLD_CATALOG_ID) {
      return true
    }
  }
  return false
}

export function migrateV12DialogToPanels(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  const nextNodes: Record<string, EntryNode> = {}
  for (const [key, node] of Object.entries(next.nodes)) {
    const newKey = mapNodeId(key)
    node.id = mapNodeId(node.id)
    node.template = mapTemplate(node.template)
    remapRepeatData(node)
    if (
      node.type === "default" &&
      newKey.startsWith(NEW_NODE_PREFIX) &&
      node.label === OLD_NODE_LABEL
    ) {
      node.label = NEW_NODE_LABEL
    }
    nextNodes[newKey] = node
  }
  next.nodes = nextNodes

  const boards = next.boards
  for (const [key, board] of Object.entries(boards)) {
    if (!isComponentBoard(board) && !isPlaygroundBoard(board)) continue
    remapTreeRefs(board.variants)
    if (!isComponentBoard(board)) continue

    // Treat a board as Dialog-family when it still carries the old catalog id or
    // is still stored under the old `dialog` key. Keying off the board key too
    // catches a board an earlier partial migration flipped to `catalogId: panel`
    // but left keyed `dialog`, which renders a `data-board-id="dialog"` that no
    // catalog id resolves.
    const isDialogFamily =
      board.catalogId === OLD_CATALOG_ID || key === OLD_CATALOG_ID
    if (!isDialogFamily) continue

    board.catalogId = NEW_CATALOG_ID
    board.label = NEW_BOARD_LABEL

    // Re-key the converted board onto `panel` and remove the stale `dialog` key
    // so no `dialog` key or catalog id survives the migration.
    if (key === OLD_CATALOG_ID) {
      boards[NEW_CATALOG_ID] = board
      delete boards[key]
    }
  }

  return next
}
