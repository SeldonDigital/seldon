"use client"

import { COLORS } from "@lib/helpers/colors"
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import {
  type CustomState,
  NORMAL_STATE,
  type NodeState,
  RESERVED_STATE_LABELS,
  type ReservedStateName,
} from "@seldon/core/workspace/model/node-state"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import {
  useActiveBoardState,
  useBoardStateStore,
} from "../hooks/use-board-state-store"
import { walkComponentTree } from "@lib/workspace/component-tree"
import { Combobox } from "@seldon/components/custom-components/controls/combobox/Combobox"

/** Editor-only display order for the reserved states in the switcher menu. */
const RESERVED_STATE_MENU_ORDER: ReservedStateName[] = [
  "active",
  "disabled",
  "selected",
  "hover",
  "focused",
  "checked",
  "dragged",
  "error",
]

interface BoardStateSwitcherProps {
  boardKey: string
}

const wrapperStyle: CSSProperties = {
  position: "absolute",
  top: -28,
  left: 0,
  zIndex: 5,
}

const triggerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 22,
  padding: "0 8px",
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.85)",
  font: "500 11px/1 system-ui, sans-serif",
  cursor: "pointer",
}

const menuStyle: CSSProperties = {
  position: "absolute",
  top: 26,
  left: 0,
  minWidth: 180,
  padding: 4,
  borderRadius: 6,
  background: "#1f1f22",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  zIndex: 6,
}

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  height: 24,
  padding: "0 8px",
  borderRadius: 4,
  color: "rgba(255,255,255,0.85)",
  font: "400 12px/1 system-ui, sans-serif",
  cursor: "pointer",
}

const overriddenItemStyle: CSSProperties = {
  ...itemStyle,
  color: COLORS.primary[500],
}

const separatorStyle: CSSProperties = {
  height: 1,
  margin: "4px 0",
  background: "rgba(255,255,255,0.1)",
}

const editButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "rgba(255,255,255,0.5)",
  font: "400 11px/1 system-ui, sans-serif",
  cursor: "pointer",
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
 * the active state for the whole board tree. Adding and renaming custom states
 * go only through core actions, never by mutating the registry directly.
 */
export function BoardStateSwitcher({ boardKey }: BoardStateSwitcherProps) {
  const { workspace, dispatch } = useWorkspace()
  const activeState = useActiveBoardState(boardKey)
  const setActiveState = useBoardStateStore((store) => store.setActiveState)

  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addValue, setAddValue] = useState("")
  const [renamingKey, setRenamingKey] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)

  const customStates = useMemo(
    () => workspace.metadata.customStates ?? [],
    [workspace.metadata.customStates],
  )

  // Collect every state key that carries overrides anywhere in the board tree.
  // The `states` map is sparse, so a present key with a non-empty bag means that
  // state has authored overrides. The Normal layer lives in `overrides`, not here.
  const statesWithOverrides = useMemo(() => {
    const set = new Set<NodeState>()
    const board = workspace.boards[boardKey]
    if (!board) return set
    walkComponentTree(board, (ref) => {
      const states = workspace.nodes[ref.id]?.states
      if (!states) return
      for (const [state, bag] of Object.entries(states)) {
        if (bag && Object.keys(bag).length > 0) set.add(state)
      }
    })
    return set
  }, [workspace.boards, workspace.nodes, boardKey])

  const closeMenu = () => {
    setOpen(false)
    setAdding(false)
    setAddValue("")
    setRenamingKey(null)
    setRenameValue("")
  }

  // Dismiss the menu on an outside click or Escape so it behaves like a popover.
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()
    }

    document.addEventListener("pointerdown", handlePointerDown, true)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const select = (state: NodeState) => {
    setActiveState(boardKey, state)
    closeMenu()
  }

  const commitAdd = (value: string) => {
    const key = toStateKey(value)
    const label = value.trim()
    setAdding(false)
    setAddValue("")
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
    setRenamingKey(null)
    setRenameValue("")
    if (label.length === 0) return
    dispatch({ type: "rename_custom_state", payload: { key, label } })
  }

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <button
        type="button"
        style={triggerStyle}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        {stateLabel(activeState, customStates)}
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div style={menuStyle} role="menu">
          <div style={itemStyle} onClick={() => select(NORMAL_STATE)}>
            Normal
          </div>

          <div style={separatorStyle} />

          {RESERVED_STATE_MENU_ORDER.map((state) => (
            <div
              key={state}
              style={
                statesWithOverrides.has(state) ? overriddenItemStyle : itemStyle
              }
              onClick={() => select(state)}
            >
              {RESERVED_STATE_LABELS[state]}
            </div>
          ))}

          {customStates.length > 0 && <div style={separatorStyle} />}

          {customStates.map((entry) =>
            renamingKey === entry.key ? (
              <div key={entry.key} style={{ padding: "2px 4px" }}>
                <Combobox
                  mode="standalone"
                  value={renameValue}
                  onValueChange={setRenameValue}
                  onSubmit={(value) => commitRename(entry.key, value)}
                  onCancel={() => setRenamingKey(null)}
                  placeholder="State name"
                />
              </div>
            ) : (
              <div key={entry.key} style={itemStyle}>
                <span
                  style={{
                    flex: 1,
                    color: statesWithOverrides.has(entry.key)
                      ? COLORS.primary[500]
                      : undefined,
                  }}
                  onClick={() => select(entry.key)}
                >
                  {entry.label}
                </span>
                <button
                  type="button"
                  style={editButtonStyle}
                  onClick={() => {
                    setRenamingKey(entry.key)
                    setRenameValue(entry.label)
                  }}
                >
                  Rename
                </button>
              </div>
            ),
          )}

          <div style={separatorStyle} />

          {adding ? (
            <div style={{ padding: "2px 4px" }}>
              <Combobox
                mode="standalone"
                value={addValue}
                onValueChange={setAddValue}
                onSubmit={commitAdd}
                onCancel={() => {
                  setAdding(false)
                  setAddValue("")
                }}
                placeholder="New state name"
              />
            </div>
          ) : (
            <div style={itemStyle} onClick={() => setAdding(true)}>
              Add custom state...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
