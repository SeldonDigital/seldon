import { MenuEntry, MenuItem } from "@lib/menus"
import { useMemo } from "react"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import {
  type CustomState,
  NORMAL_STATE,
  type NodeState,
  RESERVED_STATE_GROUPS,
  RESERVED_STATE_LABELS,
  type ReservedStateName,
} from "@seldon/core/workspace/model/node-state"
import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { walkComponentTree } from "@lib/workspace/component-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import {
  useActiveBoardState,
  useBoardStateStore,
} from "@app/canvas/hooks/use-board-state-store"

// Marks board states whose override lives only on a child, matching the punch
// accent the canvas switcher used.
const CHILD_OVERRIDE_COLOR = "var(--sdn-swatch-punch)"

function stateLabel(state: NodeState, customStates: CustomState[]): string {
  if (state === NORMAL_STATE) return "Normal"
  if (state in RESERVED_STATE_LABELS) {
    return RESERVED_STATE_LABELS[state as ReservedStateName]
  }
  return customStates.find((entry) => entry.key === state)?.label ?? state
}

export interface BoardStateMenu {
  /** Menu rows for the shared `MenuController`. */
  items: MenuEntry[]
  /** Trigger label: the current active state name. */
  label: string
  /** True when the selection has no component board to hold state. */
  disabled: boolean
}

/**
 * Interaction-state menu for the properties sidebar. Selects the active state
 * for the selected node's whole board tree through the shared board-state store,
 * the same store the canvas renders from and the `⌥1..0` hotkeys drive. The menu
 * rows, override indicators, hotkey labels, and "Add custom state" match the
 * former on-canvas switcher; only the location changed.
 */
export function useBoardStateMenu(): BoardStateMenu {
  const { workspace, dispatch } = useWorkspace()
  const { selection } = useSelection()
  const setActiveState = useBoardStateStore((store) => store.setActiveState)

  // Resolve the board key the same way `useNodeActiveState` does, so the menu
  // writes to the key the canvas and sidebar read from.
  const boardKey = useMemo<string | undefined>(() => {
    if (!selection) return undefined
    if (isBoard(selection)) return getComponentKey(selection)
    const board = nodeRelationshipService.findBoardForNode(selection, workspace)
    return board ? getComponentKey(board) : undefined
  }, [selection, workspace])

  const activeState = useActiveBoardState(boardKey ?? "")

  const customStates = useMemo(
    () => workspace.metadata.customStates ?? [],
    [workspace.metadata.customStates],
  )

  // Option-1 (Normal) through Option-0 (Dragged), numbered top to bottom in menu
  // display order, matching the hotkeys in `useEditorShortcuts`.
  const stateShortcuts = useMemo(() => {
    const order = [
      NORMAL_STATE,
      ...RESERVED_STATE_GROUPS.flatMap((group) => group.states),
    ]
    const map: Record<string, string> = {}
    order.forEach((state, index) => {
      map[state] = `⌥${(index + 1) % 10}`
    })
    return map
  }, [])

  // Split states that carry overrides into two sets so the menu can show a
  // distinct indicator for each. A state is followed up each node's template
  // chain, so it lights up when the variant or any of its children author it.
  // The root ref (no parent) feeds `ownOverride`; descendants feed `childOnly`.
  // The Normal layer lives in `overrides`, not `states`, so it never appears.
  const { ownOverrideStates, childOverrideStates } = useMemo(() => {
    const ownOverride = new Set<NodeState>()
    const childOverride = new Set<NodeState>()
    const board = boardKey ? workspace.boards[boardKey] : undefined
    if (!board)
      return {
        ownOverrideStates: ownOverride,
        childOverrideStates: childOverride,
      }

    const addStatesFromChain = (startId: string, target: Set<NodeState>) => {
      const visited = new Set<string>()
      let currentId: string | null = startId
      while (currentId && !visited.has(currentId)) {
        visited.add(currentId)
        const node: EntryNode | undefined = workspace.nodes[currentId]
        if (!node) break
        if (node.states) {
          for (const [state, bag] of Object.entries(node.states)) {
            if (bag && Object.keys(bag).length > 0) target.add(state)
          }
        }
        currentId = parseNodeLink(node.template)?.nodeId ?? null
      }
    }

    walkComponentTree(board, (ref, parent) => {
      addStatesFromChain(ref.id, parent === null ? ownOverride : childOverride)
    })
    return {
      ownOverrideStates: ownOverride,
      childOverrideStates: childOverride,
    }
  }, [workspace.boards, workspace.nodes, boardKey])

  const select = (state: NodeState) => {
    if (!boardKey) return
    setActiveState(boardKey, state)
  }

  // Creates a custom state with a sticky default name. Names are not editable
  // yet, so the next free `Custom N` label is assigned automatically.
  const addCustomState = () => {
    const existing = new Set(customStates.map((entry) => entry.key))
    let index = 1
    while (existing.has(`custom-${index}`)) index += 1
    const key = `custom-${index}`
    dispatch({
      type: "add_custom_state",
      payload: { key, label: `Custom ${index}` },
    })
    select(key)
  }

  // Builds a selectable state row. `selected` drives the leading radio for the
  // current state, `active` tints rows whose own node carries overrides, and the
  // punch accent colors rows where only descendants carry overrides.
  const stateItem = (state: NodeState, label: string): MenuItem => {
    const childOnly =
      childOverrideStates.has(state) && !ownOverrideStates.has(state)
    return {
      id: `state-${state}`,
      label,
      onSelect: () => select(state),
      selected: state === activeState,
      activeMarker: "bullet",
      active: ownOverrideStates.has(state),
      labelStyle: childOnly ? { color: CHILD_OVERRIDE_COLOR } : undefined,
      shortcut: stateShortcuts[state],
      testId: `board-state-${state}`,
    }
  }

  const items: MenuEntry[] = [stateItem(NORMAL_STATE, "Normal")]

  for (const group of RESERVED_STATE_GROUPS) {
    items.push("separator")
    for (const state of group.states) {
      items.push(stateItem(state, RESERVED_STATE_LABELS[state]))
    }
  }

  if (customStates.length > 0) {
    items.push("separator")
    for (const entry of customStates) {
      items.push(stateItem(entry.key, entry.label))
    }
  }

  items.push("separator")
  items.push({
    id: "add-custom-state",
    label: "Add custom state",
    onSelect: addCustomState,
    testId: "board-state-add",
  })

  return {
    items,
    label: stateLabel(activeState, customStates),
    disabled: !boardKey,
  }
}
