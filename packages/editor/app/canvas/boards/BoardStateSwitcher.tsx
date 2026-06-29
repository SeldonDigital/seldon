"use client"

import { CSSProperties, useMemo, useState } from "react"
import {
  type CustomState,
  NORMAL_STATE,
  type NodeState,
  RESERVED_STATE_GROUPS,
  RESERVED_STATE_LABELS,
  type ReservedStateName,
} from "@seldon/core/workspace/model/node-state"
import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"
import type { EntryNode } from "@seldon/core/workspace/types"
import { MenuEntry, MenuItem, VMCombobox, VMMenu } from "@lib/menus"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { walkComponentTree } from "@lib/workspace/component-tree"
import { ButtonMenu } from "@seldon/components/elements/ButtonMenu"
import { FloatingPanel } from "../../panels/FloatingPanel"
import {
  useActiveBoardState,
  useBoardStateStore,
} from "../hooks/use-board-state-store"
import { CHILD_OVERRIDE_COLOR } from "../canvas.bespoke"

interface BoardStateSwitcherProps {
  boardKey: string
}

const wrapperStyle: CSSProperties = {
  position: "absolute",
  top: -28,
  left: 0,
  zIndex: 5,
}

const dialogBodyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 12,
}

const dialogFieldLabelStyle: CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  font: "400 11px/1 system-ui, sans-serif",
}

/** Derives a stable custom-state key from a typed name. */
function toStateKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function stateLabel(state: NodeState, customStates: CustomState[]): string {
  if (state === NORMAL_STATE) return "Normal"
  if (state in RESERVED_STATE_LABELS) {
    return RESERVED_STATE_LABELS[state as ReservedStateName]
  }
  return customStates.find((entry) => entry.key === state)?.label ?? state
}

/**
 * On-canvas interaction-state switcher. Sits just above the board and selects
 * the active state for the whole board tree. The dropdown chrome, positioning,
 * keyboard navigation, and dismissal come from the shared `VMMenu`. Adding
 * and renaming custom states open small dialogs and go only through core
 * actions, never by mutating the registry directly.
 */
export function BoardStateSwitcher({ boardKey }: BoardStateSwitcherProps) {
  const { workspace, dispatch } = useWorkspace()
  const activeState = useActiveBoardState(boardKey)
  const setActiveState = useBoardStateStore((store) => store.setActiveState)

  const [addOpen, setAddOpen] = useState(false)
  const [addValue, setAddValue] = useState("")
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameDrafts, setRenameDrafts] = useState<Record<string, string>>({})

  const customStates = useMemo(
    () => workspace.metadata.customStates ?? [],
    [workspace.metadata.customStates],
  )

  // Split states that carry overrides into two sets so the menu can show a
  // distinct indicator for each. A state is followed up each node's template
  // chain, so it lights up when the variant or any of its children author it.
  // The root ref (no parent) feeds `ownOverride`; descendants feed `childOnly`.
  // The Normal layer lives in `overrides`, not `states`, so it never appears.
  const { ownOverrideStates, childOverrideStates } = useMemo(() => {
    const ownOverride = new Set<NodeState>()
    const childOverride = new Set<NodeState>()
    const board = workspace.boards[boardKey]
    if (!board) return { ownOverrideStates: ownOverride, childOverrideStates: childOverride }

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
    return { ownOverrideStates: ownOverride, childOverrideStates: childOverride }
  }, [workspace.boards, workspace.nodes, boardKey])

  const select = (state: NodeState) => setActiveState(boardKey, state)

  const openAddDialog = () => {
    setAddValue("")
    setAddOpen(true)
  }

  const openRenameDialog = () => {
    setRenameDrafts(
      Object.fromEntries(customStates.map((entry) => [entry.key, entry.label])),
    )
    setRenameOpen(true)
  }

  const commitAdd = (value: string) => {
    const key = toStateKey(value)
    const label = value.trim()
    setAddOpen(false)
    if (!key || key in RESERVED_STATE_LABELS) return
    if (customStates.some((entry) => entry.key === key)) {
      select(key)
      return
    }
    dispatch({ type: "add_custom_state", payload: { key, label } })
    select(key)
  }

  const commitRename = (key: string, value: string) => {
    const label = value.trim()
    if (label.length === 0) return
    dispatch({ type: "rename_custom_state", payload: { key, label } })
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
    label: "Add custom state...",
    onSelect: openAddDialog,
    testId: "board-state-add",
  })
  if (customStates.length > 0) {
    items.push({
      id: "rename-custom-state",
      label: "Rename custom state...",
      onSelect: openRenameDialog,
      testId: "board-state-rename",
    })
  }

  return (
    <div
      style={wrapperStyle}
      onClick={(event) => event.stopPropagation()}
    >
      <VMMenu
        items={items}
        renderTrigger={({ ref, triggerProps }) => (
          <ButtonMenu
            ref={ref}
            type="button"
            {...triggerProps}
            textLabel={{ children: stateLabel(activeState, customStates) }}
            data-testid="board-state-trigger"
          />
        )}
      />

      {addOpen && (
        <FloatingPanel
          handleClose={() => setAddOpen(false)}
          title="Add custom state"
          initialWidth={320}
          initialHeight={150}
          closeOnClickOutside
          testId="add-custom-state-dialog"
        >
          <div style={dialogBodyStyle}>
            <span style={dialogFieldLabelStyle}>State name</span>
            <VMCombobox
              mode="standalone"
              value={addValue}
              onValueChange={setAddValue}
              onSubmit={commitAdd}
              onCancel={() => setAddOpen(false)}
              placeholder="New state name"
            />
          </div>
        </FloatingPanel>
      )}

      {renameOpen && (
        <FloatingPanel
          handleClose={() => setRenameOpen(false)}
          title="Rename custom state"
          initialWidth={320}
          initialHeight={Math.min(140 + customStates.length * 48, 420)}
          closeOnClickOutside
          testId="rename-custom-state-dialog"
        >
          <div style={dialogBodyStyle}>
            {customStates.map((entry) => (
              <div key={entry.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={dialogFieldLabelStyle}>{entry.key}</span>
                <VMCombobox
                  mode="standalone"
                  value={renameDrafts[entry.key] ?? entry.label}
                  onValueChange={(value) =>
                    setRenameDrafts((drafts) => ({ ...drafts, [entry.key]: value }))
                  }
                  onSubmit={(value) => commitRename(entry.key, value)}
                  autoFocus={false}
                  placeholder="State name"
                />
              </div>
            ))}
          </div>
        </FloatingPanel>
      )}
    </div>
  )
}
