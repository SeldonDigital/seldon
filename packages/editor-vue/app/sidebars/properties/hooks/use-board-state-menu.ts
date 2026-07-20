import { useBoardStateStore } from "@app/canvas/board-state-store"
import type { MenuEntry, MenuItem } from "@app/menus/types"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { walkComponentTree } from "@seldon/editor/lib/workspace/component-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { type ComputedRef, computed } from "vue"

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

const CHILD_OVERRIDE_COLOR = "var(--sdn-swatch-punch)"

function stateLabel(state: NodeState, customStates: CustomState[]): string {
  if (state === NORMAL_STATE) return "Normal"
  if (state in RESERVED_STATE_LABELS) {
    return RESERVED_STATE_LABELS[state as ReservedStateName]
  }
  return customStates.find((entry) => entry.key === state)?.label ?? state
}

export interface BoardStateMenu {
  items: MenuEntry[]
  label: string
  disabled: boolean
}

/**
 * Interaction-state menu for the properties sidebar. Selects the active state
 * for the selected node's whole board tree through the shared board-state store,
 * the same store the canvas renders from. Vue port of the React
 * `useBoardStateMenu`.
 */
export function useBoardStateMenu(): ComputedRef<BoardStateMenu> {
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const { selectedItem } = useSelection()
  const boardStateStore = useBoardStateStore()

  return computed<BoardStateMenu>(() => {
    const ws = workspace.value
    const selection = selectedItem.value

    const boardKey = !selection
      ? undefined
      : isBoard(selection)
        ? getComponentKey(selection)
        : (() => {
            const board = nodeRelationshipService.findBoardForNode(
              selection,
              ws,
            )
            return board ? getComponentKey(board) : undefined
          })()

    const activeState = boardKey
      ? boardStateStore.getActiveState(boardKey)
      : NORMAL_STATE
    const customStates = ws.metadata.customStates ?? []

    const stateShortcuts: Record<string, string> = {}
    const order = [
      NORMAL_STATE,
      ...RESERVED_STATE_GROUPS.flatMap((group) => group.states),
    ]
    order.forEach((state, index) => {
      stateShortcuts[state] = `⌥${(index + 1) % 10}`
    })

    const ownOverrideStates = new Set<NodeState>()
    const childOverrideStates = new Set<NodeState>()
    const board = boardKey ? ws.boards[boardKey] : undefined
    if (board) {
      const addStatesFromChain = (
        startId: string,
        target: Set<NodeState>,
      ): void => {
        const visited = new Set<string>()
        let currentId: string | null = startId
        while (currentId && !visited.has(currentId)) {
          visited.add(currentId)
          const entryNode: EntryNode | undefined = ws.nodes[currentId]
          if (!entryNode) break
          if (entryNode.states) {
            for (const [state, bag] of Object.entries(entryNode.states)) {
              if (bag && Object.keys(bag).length > 0) target.add(state)
            }
          }
          currentId = parseNodeLink(entryNode.template)?.nodeId ?? null
        }
      }
      walkComponentTree(board, (ref, parent) => {
        addStatesFromChain(
          ref.id,
          parent === null ? ownOverrideStates : childOverrideStates,
        )
      })
    }

    const select = (state: NodeState): void => {
      if (!boardKey) return
      boardStateStore.setActiveState(boardKey, state)
    }

    const addCustomState = (): void => {
      const existing = new Set(customStates.map((entry) => entry.key))
      let index = 1
      while (existing.has(`custom-${index}`)) index += 1
      const key = `custom-${index}`
      dispatch({
        type: "add_custom_state",
        payload: { key, label: `Custom ${index}` },
      } as never)
      select(key)
    }

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
  })
}
