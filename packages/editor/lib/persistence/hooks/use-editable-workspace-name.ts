"use client"

import React, { useCallback, useState } from "react"

type UseEditableWorkspaceNameArgs = {
  name: string
  onRename: (name: string) => void
}

/**
 * Inline rename behavior for the workspace title. Double-click enters edit mode,
 * Enter or blur commits a non-empty change, Escape reverts.
 */
export function useEditableWorkspaceName({
  name,
  onRename,
}: UseEditableWorkspaceNameArgs) {
  const [mode, setMode] = useState<"edit" | "display">("display")

  const commit = useCallback(
    (text: string) => {
      const next = text.trim()
      if (next.length > 0 && next.length <= 200 && next !== name) {
        onRename(next)
      }
      setMode("display")
    },
    [name, onRename],
  )

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      setMode("edit")
      const target = event.currentTarget
      requestAnimationFrame(() => {
        target.focus()
        window.getSelection()?.selectAllChildren(target)
      })
    },
    [],
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (mode === "display") return
      commit(event.currentTarget.innerText)
    },
    [mode, commit],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (mode === "display") return

      if (event.key === "Escape") {
        event.preventDefault()
        event.currentTarget.innerText = name
        setMode("display")
        event.currentTarget.blur()
        return
      }

      if (event.key === "Enter") {
        event.preventDefault()
        commit(event.currentTarget.innerText)
        event.currentTarget.blur()
      }
    },
    [mode, name, commit],
  )

  return {
    onDoubleClick: mode === "display" ? handleDoubleClick : undefined,
    onBlur: mode === "edit" ? handleBlur : undefined,
    onKeyDown: mode === "edit" ? handleKeyDown : undefined,
    contentEditable: mode === "edit" ? true : undefined,
    suppressContentEditableWarning: true,
  }
}
