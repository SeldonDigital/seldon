import {
  Board,
  Instance,
  ValueType,
  Variant,
  Workspace,
  getNodeRepeat,
  resolveInheritedRepeatData,
  resolveNodeRepeat,
} from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { collectDescendantNodeIds } from "@lib/workspace/component-tree"
import {
  findComponentForNode,
  getNodeCatalogComponentId,
} from "@lib/workspace/node-tree"
import { getNode } from "@lib/workspace/workspace-accessors"
import { FlatProperty } from "./properties-data"

/** Synthetic compound key for the editor-only Repeat row. */
export const REPEAT_ROW_KEY = "repeat"

const EMPTY_VALUE = { type: ValueType.EMPTY, value: null }

/** A text/icon descendant that can carry per-echo prototyping values. */
interface RepeatDataDescendant {
  id: string
  label: string
  /** Which property the echo value overrides on the canvas. */
  slot: "content" | "symbol"
}

/**
 * Repeat is an instance-only (child) capability. Default and user variant roots
 * are the component itself and never repeat.
 */
export function isRepeatEligible(
  node: Variant | Instance | Board,
): node is Instance {
  if (isBoard(node)) return false
  return typeCheckingService.isInstance(node)
}

/** Text/icon descendants of a node, in tree order, as repeat data slots. */
export function getRepeatDataDescendants(
  node: Variant | Instance,
  workspace: Workspace,
): RepeatDataDescendant[] {
  const board = findComponentForNode(node, workspace)
  if (!board) return []
  const descendants: RepeatDataDescendant[] = []
  for (const descendantId of collectDescendantNodeIds(board, node.id)) {
    const descendant = getNode(workspace, descendantId)
    if (!descendant) continue
    const componentId = getNodeCatalogComponentId(descendant, workspace)
    if (componentId === ComponentId.ICON) {
      descendants.push({ id: descendantId, label: descendant.label, slot: "symbol" })
    } else if (componentId === ComponentId.TEXT) {
      descendants.push({ id: descendantId, label: descendant.label, slot: "content" })
    }
  }
  return descendants
}

/** Key for a per-echo data row. Uses "#" so the key stays a single child segment. */
export function repeatDataRowKey(descendantId: string, echoIndex: number): string {
  return `${REPEAT_ROW_KEY}.${descendantId}#${echoIndex}`
}

/** Parses a data-row key back into its descendant id and echo index. */
export function parseRepeatDataRowKey(
  key: string,
): { descendantId: string; echoIndex: number } | null {
  const prefix = `${REPEAT_ROW_KEY}.`
  if (!key.startsWith(prefix)) return null
  const rest = key.slice(prefix.length)
  const hashIndex = rest.lastIndexOf("#")
  if (hashIndex <= 0) return null
  const descendantId = rest.slice(0, hashIndex)
  const echoIndex = Number.parseInt(rest.slice(hashIndex + 1), 10)
  if (!descendantId || !Number.isInteger(echoIndex) || echoIndex < 1) return null
  return { descendantId, echoIndex }
}

/**
 * Returns the icon descendant a repeat echo symbol row edits, or null when the
 * key is not a repeat symbol row. Lets the symbol-picker UI treat the echo row
 * exactly like the real `symbol` property.
 */
export function getRepeatSymbolDescendant(
  key: string,
  workspace: Workspace,
): Variant | Instance | null {
  const repeatRow = parseRepeatDataRowKey(key)
  if (!repeatRow) return null
  const descendant = getNode(workspace, repeatRow.descendantId)
  if (
    !descendant ||
    isBoard(descendant) ||
    getNodeCatalogComponentId(descendant, workspace) !== ComponentId.ICON
  ) {
    return null
  }
  return descendant
}

/**
 * Builds the synthetic Repeat rows for a node: a compound count row plus, when
 * the count is above 1, one text row per echo for every text/icon descendant.
 * Returns an empty list for nodes that cannot repeat.
 */
export function buildRepeatRows(
  node: Variant | Instance | Board,
  workspace: Workspace,
): FlatProperty[] {
  if (!isRepeatEligible(node)) return []

  const repeat = resolveNodeRepeat(node.id, workspace)
  const ownRepeat = getNodeRepeat(node)
  const inheritedData = resolveInheritedRepeatData(node.id, workspace)
  const count = repeat?.count ?? 1

  const parent: FlatProperty = {
    key: REPEAT_ROW_KEY,
    propertyType: "compound",
    label: "Repeat",
    icon: "seldon-component",
    value: { type: ValueType.EXACT, value: count },
    actualValue: String(count),
    valueType: ValueType.EXACT,
    controlType: "number",
    isCompound: true,
    isShorthand: false,
    isSubProperty: false,
    status: count > 1 ? "set" : "unset",
  }

  const rows: FlatProperty[] = [parent]

  if (count > 1) {
    const descendants = getRepeatDataDescendants(node, workspace)

    // Cluster by echo (the repeated copy), then by descendant in tree order:
    // "Icon 2, Label 2, Icon 3, Label 3" rather than grouping all icons first.
    // Symbol rows render a combo whose options are generated against the icon
    // descendant in build-property-options, matching the real symbol picker.
    for (let echoIndex = 1; echoIndex <= count - 1; echoIndex++) {
      for (const descendant of descendants) {
        const values = repeat?.data?.[descendant.id] ?? []
        const current = values[echoIndex - 1]

        // A slot is an override when this node sets its own value for the echo and
        // it diverges from the inherited slot (empty when this node owns the
        // repeat). An explicit per-echo value is a deviation from the index[0]
        // base, so it shows blue.
        const ownValue = ownRepeat?.data?.[descendant.id]?.[echoIndex - 1]
        const inheritedValue = inheritedData[descendant.id]?.[echoIndex - 1] ?? ""
        const hasOwn = ownValue != null && ownValue !== ""
        const isOverride = hasOwn && ownValue !== inheritedValue

        rows.push({
          key: repeatDataRowKey(descendant.id, echoIndex),
          propertyType: "atomic",
          label: `${descendant.label} ${echoIndex + 1}`,
          icon: "seldon-token",
          value: current ? { type: ValueType.EXACT, value: current } : EMPTY_VALUE,
          actualValue: current ?? "",
          valueType: current ? ValueType.EXACT : ValueType.EMPTY,
          controlType: descendant.slot === "symbol" ? "combo" : "text",
          isCompound: false,
          isShorthand: false,
          isSubProperty: true,
          status: isOverride ? "override" : current ? "set" : "unset",
        })
      }
    }
  }

  return rows
}

/**
 * Inserts the Repeat rows into a flat property list, just above the `cursor`
 * row when present, otherwise at the front. Returns the input unchanged for
 * nodes that cannot repeat.
 */
export function injectRepeatRows(
  properties: FlatProperty[],
  node: Variant | Instance | Board,
  workspace: Workspace,
): FlatProperty[] {
  const repeatRows = buildRepeatRows(node, workspace)
  if (repeatRows.length === 0) return properties

  const cursorIndex = properties.findIndex((property) => property.key === "cursor")
  const insertAt = cursorIndex >= 0 ? cursorIndex : 0
  return [
    ...properties.slice(0, insertAt),
    ...repeatRows,
    ...properties.slice(insertAt),
  ]
}
