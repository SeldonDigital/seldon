import { AriaRole, Resize, ValueType } from "../../../../properties"
import { REPEAT_EDITOR_KEY } from "../../../helpers/nodes/node-repeat"
import { isAuthoredBoard, isComponentBoard, isPlaygroundBoard } from "../../../model/components"

import type { ComponentTreeRef } from "../../../model/component-tree"
import type { ComponentBoard } from "../../../model/components"
import type { EntryNode, EntryNodePropertyOverrides } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"

/**
 * v19: fold the Listbox family into the Menu family.
 *
 * A menu and an option list are the same component now. `menu` carries the
 * `options` and `groupedOptions` variants and `menuItem` carries `option`, so
 * `listbox` and `listboxOption` left the catalog. This step moves a stored
 * Listbox family into the Menu boards instead of dropping it, which keeps every
 * option row, ref, label, and override a file already holds.
 *
 * Each old default becomes a variant of the target board and picks up the root
 * overrides that variant declares in the catalog, because Menu and Listbox
 * differ in width, vertical padding, and role. Every other node in the family is
 * re-keyed onto the Menu prefix, and template links, board tree refs, and repeat
 * data keys follow.
 *
 * A file with a Listbox board but no Menu board keeps its own board, re-keyed to
 * `menu`, so the component survives rather than dangling.
 *
 * Guarded and idempotent so it is safe to re-run on files already migrated.
 */

interface MergedFamily {
  oldCatalogId: string
  newCatalogId: string
  boardLabel: string
  /** Old node suffix to the target variant it becomes, `default` included. */
  suffixes: Record<string, string>
  /** Root overrides the moved default needs to keep its look in the new board. */
  variantOverrides: EntryNodePropertyOverrides
}

const FAMILIES: MergedFamily[] = [
  {
    oldCatalogId: "listbox",
    newCatalogId: "menu",
    boardLabel: "Menus",
    suffixes: { default: "options", grouped: "groupedOptions" },
    variantOverrides: {
      width: { type: ValueType.OPTION, value: Resize.FILL },
      padding: {
        top: { type: ValueType.THEME_ORDINAL, value: "@padding.compact" },
        bottom: { type: ValueType.THEME_ORDINAL, value: "@padding.compact" },
      },
      role: { type: ValueType.OPTION, value: AriaRole.LISTBOX },
    },
  },
  {
    oldCatalogId: "listboxOption",
    newCatalogId: "menuItem",
    boardLabel: "Menu Items",
    suffixes: { default: "option" },
    variantOverrides: {
      role: { type: ValueType.OPTION, value: AriaRole.OPTION },
    },
  },
]

/** Labels the Listbox family shipped, and the name each takes in the Menu family. */
const NODE_LABELS: Record<string, string> = {
  Listbox: "Options",
  "Grouped Listbox": "Grouped Options",
  "Listbox Option": "Option",
}

/** Variant ref lists of every board and playground row that owns a node tree. */
function nodeTreeRows(workspace: Workspace): ComponentTreeRef[][] {
  const rows: ComponentTreeRef[][] = []
  const entries = [...Object.values(workspace.boards), ...Object.values(workspace.playgrounds)]

  for (const entry of entries) {
    if (isComponentBoard(entry) || isPlaygroundBoard(entry) || isAuthoredBoard(entry)) {
      rows.push(entry.variants)
    }
  }

  return rows
}

/** Visits a tree ref and every descendant. */
function forEachRef(refs: ComponentTreeRef[], visit: (ref: ComponentTreeRef) => void): void {
  for (const ref of refs) {
    visit(ref)
    if (ref.children) forEachRef(ref.children, visit)
  }
}

/** Keeps a mapped key unique when the Menu family already claims the name. */
function uniqueKey(candidate: string, taken: Set<string>): string {
  if (!taken.has(candidate)) return candidate

  let suffix = 2

  while (taken.has(`${candidate}${suffix}`)) suffix++

  return `${candidate}${suffix}`
}

/** Maps every node key in the old family onto its Menu family key. */
function buildIdMap(
  workspace: Workspace,
  family: MergedFamily,
  oldKeys: string[],
  merges: boolean,
): Map<string, string> {
  const oldPrefix = `component-${family.oldCatalogId}-`
  const newPrefix = `component-${family.newCatalogId}-`
  const taken = new Set(Object.keys(workspace.nodes))

  for (const key of oldKeys) taken.delete(key)

  const idMap = new Map<string, string>()

  for (const key of oldKeys) {
    const suffix = key.slice(oldPrefix.length)
    // Only a merge renames the default onto a variant id. A re-keyed board keeps
    // its own default.
    const mapped = merges ? (family.suffixes[suffix] ?? suffix) : suffix
    const newKey = uniqueKey(newPrefix + mapped, taken)

    taken.add(newKey)
    idMap.set(key, newKey)
  }

  return idMap
}

/** Rewrites a `node:` template link through the id map. */
function mapTemplate(template: string, idMap: Map<string, string>): string {
  if (!template.startsWith("node:")) return template

  const mapped = idMap.get(template.slice("node:".length))

  return mapped ? `node:${mapped}` : template
}

/** Remaps repeat data keys, which reference descendant node ids, in place. */
function remapRepeatData(node: EntryNode, idMap: Map<string, string>): void {
  const editor = node.__editor

  if (!editor) return
  const repeat = editor[REPEAT_EDITOR_KEY] as { data?: Record<string, string[]> } | undefined

  if (!repeat || typeof repeat !== "object" || !repeat.data) return
  const remapped: Record<string, string[]> = {}

  for (const [descendantId, values] of Object.entries(repeat.data)) {
    remapped[idMap.get(descendantId) ?? descendantId] = values
  }

  repeat.data = remapped
}

/** Moves the old board row into the target row, or re-keys it when none exists. */
function moveBoardRow(
  workspace: Workspace,
  family: MergedFamily,
  target: ComponentBoard | undefined,
): void {
  const oldRow = workspace.boards[family.oldCatalogId]

  if (!oldRow || !isComponentBoard(oldRow)) return

  if (target) {
    target.variants.push(...oldRow.variants)
    delete workspace.boards[family.oldCatalogId]

    return
  }

  if (workspace.boards[family.newCatalogId]) return

  oldRow.catalogId = family.newCatalogId
  oldRow.label = family.boardLabel
  workspace.boards[family.newCatalogId] = oldRow
  delete workspace.boards[family.oldCatalogId]
}

/** Folds one old family into the board that now owns it. */
function mergeFamily(workspace: Workspace, family: MergedFamily): void {
  const oldPrefix = `component-${family.oldCatalogId}-`
  const newPrefix = `component-${family.newCatalogId}-`
  const oldCatalogTemplate = `catalog:${family.oldCatalogId}`

  const targetRow = workspace.boards[family.newCatalogId]
  const target = targetRow && isComponentBoard(targetRow) ? targetRow : undefined

  const oldKeys = Object.keys(workspace.nodes).filter((key) => key.startsWith(oldPrefix))
  const oldDefaultKey = oldKeys.find((key) => workspace.nodes[key].type === "default")

  if (oldDefaultKey) {
    const oldDefault = workspace.nodes[oldDefaultKey]

    if (target) {
      oldDefault.type = "variant"
      oldDefault.template = `node:${target.variants[0]?.id ?? `${newPrefix}default`}`
      oldDefault.overrides = { ...family.variantOverrides, ...oldDefault.overrides }
    } else {
      oldDefault.template = `catalog:${family.newCatalogId}`
    }
  }

  // Anything else that pointed straight at the old catalog id follows the moved
  // default, so it keeps the option look instead of falling back to the menu one.
  for (const [key, node] of Object.entries(workspace.nodes)) {
    if (key === oldDefaultKey || node.template !== oldCatalogTemplate) continue

    node.template = oldDefaultKey ? `node:${oldDefaultKey}` : `catalog:${family.newCatalogId}`
  }

  const idMap = buildIdMap(workspace, family, oldKeys, target !== undefined)
  const nextNodes: Record<string, EntryNode> = {}

  for (const [key, node] of Object.entries(workspace.nodes)) {
    const newKey = idMap.get(key) ?? key

    node.id = newKey
    node.template = mapTemplate(node.template, idMap)
    remapRepeatData(node, idMap)

    if (idMap.has(key)) {
      const label = NODE_LABELS[node.label]

      if (label) node.label = label
    }

    nextNodes[newKey] = node
  }

  workspace.nodes = nextNodes

  for (const refs of nodeTreeRows(workspace)) {
    forEachRef(refs, (ref) => {
      ref.id = idMap.get(ref.id) ?? ref.id
    })
  }

  moveBoardRow(workspace, family, target)
}

/** True when any board, node, or tree ref still names the Listbox family. */
function migrationApplies(workspace: Workspace): boolean {
  for (const family of FAMILIES) {
    if (workspace.boards[family.oldCatalogId]) return true

    const oldPrefix = `component-${family.oldCatalogId}-`
    const oldCatalogTemplate = `catalog:${family.oldCatalogId}`
    const oldLinkPrefix = `node:${oldPrefix}`

    for (const [key, node] of Object.entries(workspace.nodes)) {
      if (key.startsWith(oldPrefix)) return true
      if (node.template === oldCatalogTemplate) return true
      if (node.template.startsWith(oldLinkPrefix)) return true
    }

    let referenced = false

    for (const refs of nodeTreeRows(workspace)) {
      forEachRef(refs, (ref) => {
        if (ref.id.startsWith(oldPrefix)) referenced = true
      })
    }

    if (referenced) return true
  }

  return false
}

export function migrateV19ListboxToMenu(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const family of FAMILIES) mergeFamily(next, family)

  return next
}
